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
    public Collection<String> getTimeline(String login, int size, String since_id, String max_id) {
        return getLineFromCF(TIMELINE_CF, login, size, since_id, max_id);
    }

    @Override
    public void addStatusToUserline(Status status) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(status.getLogin(), USERLINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    public Collection<String> getUserline(String login, int size, String since_id, String max_id) {
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
    public Collection<String> getFavoritesline(String login) {
        ColumnSlice<UUID, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(FAVLINE_CF)
                .setKey(login)
                .setRange(null, null, true, 50)
                .execute()
                .get();

        Collection<String> statusIds = new ArrayList<String>();
        for (HColumn<UUID, String> column : result.getColumns()) {
            statusIds.add(column.getName().toString());
        }
        return statusIds;
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

    private Collection<String> getLineFromCF(String cf, String login, int size, String since_id, String max_id) {
        Collection<String> statusIds = new ArrayList<String>();
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
                statusIds.add(column.getName().toString());
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
                statusIds.add(column.getName().toString());
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
                statusIds.add(column.getName().toString());
            }
        }
        return statusIds;
    }
}
