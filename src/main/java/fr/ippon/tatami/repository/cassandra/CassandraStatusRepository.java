package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.StatusRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import me.prettyprint.hector.api.query.QueryResult;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.*;
import java.util.*;

import static fr.ippon.tatami.config.ColumnFamilyKeys.*;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the status repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraStatusRepository implements StatusRepository {

    private final Log log = LogFactory.getLog(CassandraStatusRepository.class);

    @Inject
    private EntityManager em;

    @Inject
    private Keyspace keyspaceOperator;

    private static ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static Validator validator = factory.getValidator();

    @Override
    public Status createStatus(String login, String username, String domain, String content, String replyTo)
            throws ConstraintViolationException {

        Status status = new Status();
        status.setStatusId(TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString());
        status.setLogin(login);
        status.setUsername(username);
        status.setDomain(domain);
        status.setContent(content);
        status.setStatusDate(Calendar.getInstance().getTime());
        status.setReplyTo(replyTo);
        status.setRemoved(false);
        if (log.isDebugEnabled()) {
            log.debug("Persisting Status : " + status);
        }
        Set<ConstraintViolation<Status>> constraintViolations = validator.validate(status);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(status);
        return status;
    }

    @Override
    @Cacheable("status-cache")
    public Status findStatusById(String statusId) {
        if (log.isDebugEnabled()) {
            log.debug("Finding status : " + statusId);
        }
        Status status = em.find(Status.class, statusId);
        return Boolean.TRUE.equals(status.getRemoved()) ? null : status;
    }

    @Override
    @CacheEvict(value = "status-cache", key = "#status.statusId")
    public void removeStatus(Status status) {
        status.setRemoved(true);
        if (log.isDebugEnabled()) {
            log.debug("Updating Status : " + status);
        }
        em.persist(status);
    }

    @Override
    public void addStatusToTimeline(String login, Status status) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, TIMELINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Status status) {
        shareStatus(timelineLogin, status, sharedByLogin, TIMELINE_CF);
    }

    @Override
    public Map<String, String> getTimeline(String login, int size, String since_id, String max_id) {
        return getLineFromCF(TIMELINE_CF, login, size, since_id, max_id);
    }

    @Override
    public void addStatusToUserline(Status status) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(status.getLogin(), USERLINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void shareStatusToUserline(String currentLogin, Status status) {
        shareStatus(currentLogin, status, currentLogin, USERLINE_CF);
    }

    @Override
    public Map<String, String> getUserline(String login, int size, String since_id, String max_id) {
        return getLineFromCF(USERLINE_CF, login, size, since_id, max_id);
    }

    @Override
    @CacheEvict(value = "favorites-cache", key = "#login")
    public void addStatusToFavoritesline(Status status, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, FAVLINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()), "",
                UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    @CacheEvict(value = "favorites-cache", key = "#login")
    public void removeStatusFromFavoritesline(Status status, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, FAVLINE_CF, UUID.fromString(status.getStatusId()), UUIDSerializer.get());
    }

    @Override
    @Cacheable("favorites-cache")
    public Map<String, String> getFavoritesline(String login) {
        Map<String, String> line = new LinkedHashMap<String, String>();
        ColumnSlice<UUID, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(FAVLINE_CF)
                .setKey(login)
                .setRange(null, null, true, 50)
                .execute()
                .get();

        for (HColumn<UUID, String> column : result.getColumns()) {
            line.put(column.getName().toString(), column.getValue());
        }
        return line;
    }

    @Override
    public void deleteFavoritesline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, FAVLINE_CF);
        mutator.execute();
    }

    @Override
    public void deleteUserline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, USERLINE_CF);
        mutator.execute();
    }

    @Override
    public void deleteTimeline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, TIMELINE_CF);
        mutator.execute();
    }

    private Map<String, String> getLineFromCF(String cf, String login, int size, String since_id, String max_id) {
        Map<String, String> line = new LinkedHashMap<String, String>();
        ColumnSlice<UUID, String> result;
        if (max_id != null) {
            result = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(UUID.fromString(max_id), null, true, size)
                    .execute()
                    .get();

            for (HColumn<UUID, String> column : result.getColumns().subList(1, result.getColumns().size())) {
                line.put(column.getName().toString(), column.getValue());
            }
        } else if (since_id != null) {
            result = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, UUID.fromString(since_id), true, size)
                    .execute()
                    .get();

            for (HColumn<UUID, String> column : result.getColumns().subList(0, result.getColumns().size() - 1)) {
                line.put(column.getName().toString(), column.getValue());
            }
        } else {
            result = createSliceQuery(keyspaceOperator,
                    StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                    .setColumnFamily(cf)
                    .setKey(login)
                    .setRange(null, null, true, size)
                    .execute()
                    .get();

            for (HColumn<UUID, String> column : result.getColumns()) {
                line.put(column.getName().toString(), column.getValue());
            }
        }
        return line;
    }

    private void shareStatus(String login, Status status, String sharedByLogin, String columnFamily) {
        UUID name = UUID.fromString(status.getStatusId());
        ColumnQuery<String, UUID, String> columnQuery =
                HFactory.createColumnQuery(keyspaceOperator, StringSerializer.get(),
                        UUIDSerializer.get(), StringSerializer.get());

        columnQuery.setColumnFamily(columnFamily).setKey(login).setName(name);
        QueryResult<HColumn<UUID, String>> result = columnQuery.execute();
        if (result.get() == null) {
            Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
            mutator.insert(login, columnFamily, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                    sharedByLogin, UUIDSerializer.get(), StringSerializer.get()));
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Shared status " + status.getStatusId() + " is already in " + columnFamily);
            }
        }
    }
}
