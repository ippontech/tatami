package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.StatusRepository;
import fr.ippon.tatami.repository.UserlineRepository;
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

import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERLINE_SHARES_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the Userline repository.
 * <p/>
 * Structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserlineRepository extends AbstractLineRepository implements UserlineRepository {

    @Override
    public void addStatusToUserline(Status status) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(status.getLogin(), USERLINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void shareStatusToUserline(String currentLogin, Status status) {
        shareStatus(currentLogin, status, currentLogin, USERLINE_CF, USERLINE_SHARES_CF);
    }

    @Override
    public Map<String, String> getUserline(String login, int size, String since_id, String max_id) {
        return getLineFromCF(USERLINE_CF, login, size, since_id, max_id);
    }

    @Override
    public void deleteUserline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, USERLINE_CF);
        mutator.execute();
    }
}
