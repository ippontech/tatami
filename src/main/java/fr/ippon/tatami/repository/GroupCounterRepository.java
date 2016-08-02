package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;

/**
 * Cassandra implementation of the Group Counter repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = groupId
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class GroupCounterRepository {

    @Inject
    private Session session;

    public long getGroupCounter(UUID groupId, String domain) {
        Statement statement = QueryBuilder.select()
            .column("counter")
            .from(ColumnFamilyKeys.GROUP_COUNTER_CF)
            .where(eq("groupId", groupId))
            .and(eq("domain", domain));
        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            return results.one().getLong("counter");
        } else {
            return 0;
        }
    }

    public void incrementGroupCounter(UUID groupId, String domain) {
        Statement statement = QueryBuilder.update(ColumnFamilyKeys.GROUP_COUNTER_CF)
            .with(incr("counter", 1))
            .where(eq("groupId", groupId))
            .and(eq("domain", domain));
        session.execute(statement);
    }

    public void decrementGroupCounter(UUID groupId, String domain) {
        Statement statement = QueryBuilder.update(ColumnFamilyKeys.GROUP_COUNTER_CF)
            .with(decr("counter", 1))
            .where(eq("groupId", groupId))
            .and(eq("domain", domain));
        session.execute(statement);
    }

    public void deleteGroupCounter(String groupId, String domain) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.GROUP_COUNTER_CF)
            .where(eq("groupId", groupId))
            .and(eq("domain", domain));
        session.execute(statement);
    }
}
