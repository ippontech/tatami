package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.RssUidRepository;
import fr.ippon.tatami.service.util.RandomUtil;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.RSS_CF;

/**
 * Cassandra implementation of the RssUid repository.
 * <p/>
 * Structure : - Key = "rss_uid" - Name = key - Value = login
 *
 * @author Pierre Rust
 */
@Repository
public class CassandraRssUidRepository implements RssUidRepository {

    private final static String ROW_KEY = "rss_uid";

    @Inject
    private Session session;

    @Override
    public String generateRssUid(String login) {
        String key = RandomUtil.generateRegistrationKey();
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.RSS_CF)
                .value(ROW_KEY, key)
                .value("login",login);
        session.execute(statement);
        return key;
    }

    @Override
    public String getLoginByRssUid(String rssUid) {
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.RSS_CF)
                .where(eq(ROW_KEY, rssUid));
        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            return results.one().getString("login");
        }
        return null;
    }

    @Override
    public void removeRssUid(String rssUid) {
        Statement statement = QueryBuilder.delete().from(RSS_CF)
                .where(eq(ROW_KEY, rssUid));
        session.execute(statement);
    }
}
