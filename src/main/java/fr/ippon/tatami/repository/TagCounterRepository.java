package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;

/**
 * Cassandra implementation of the Tag Counter repository.
 * <p/>
 * Structure :
 * - Key = tag + domain
 * - Name = TAG_COUNTER
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class TagCounterRepository {

    private static final String TAG_COUNTER = "TAG_COUNTER";

    @Inject
    private Session session;


    public long getTagCounter(String domain, String tag) {
        Statement statement = QueryBuilder.select()
                .column(TAG_COUNTER)
                .from(ColumnFamilyKeys.TAG_COUNTER_CF)
                .where(eq("key", getKey(domain,tag)));
        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            return results.one().getLong(TAG_COUNTER);
        } else {
            return 0;
        }
    }


    public void incrementTagCounter(String domain, String tag) {
        Statement statement = QueryBuilder.update(ColumnFamilyKeys.TAG_COUNTER_CF)
                .with(incr(TAG_COUNTER,1))
                .where(eq("key",getKey(domain,tag)));
        session.execute(statement);
    }


    public void decrementTagCounter(String domain, String tag) {
        Statement statement = QueryBuilder.update(ColumnFamilyKeys.TAG_COUNTER_CF)
                .with(decr(TAG_COUNTER,1))
                .where(eq("key",getKey(domain,tag)));
        session.execute(statement);
    }


    public void deleteTagCounter(String domain, String tag) {
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.TAG_COUNTER_CF)
                .where(eq("key", getKey(domain,tag)));
        session.execute(statement);
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }
}
