package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.repository.UserTrendRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;


/**
 * Cassandra implementation of the User Trends repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = date
 * - Value = tag
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserTrendRepository implements UserTrendRepository {

    private final static int COLUMN_TTL = 60 * 60 * 24 * 90; // The column is stored for 90 days.

    private final static int TRENDS_NUMBER_OF_TAGS = 50;

    @Inject
    private Session session;

    @Override
    public void addTag(String login, String tag) {
        Statement statement = QueryBuilder.insertInto("userTrends")
                .value("login", login)
                .value("id", UUIDs.timeBased())
                .value("tag", tag)
                .using(ttl(COLUMN_TTL));
        session.execute(statement);
    }

    @Override
    public List<String> getRecentTags(String login) {
        Statement statement = QueryBuilder.select()
                .column("tag")
                .from("userTrends")
                .where(eq("login", login))
                .orderBy(desc("id"))
                .limit(TRENDS_NUMBER_OF_TAGS);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("tag"))
                .collect(Collectors.toList());
    }

    @Override
    public Collection<String> getUserRecentTags(String login, Date endDate,
                                                int nbRecentTags) {
        Statement statement = QueryBuilder.select()
                .column("tag")
                .from("userTrends")
                .where(eq("login", login))
                .and(gt("id",UUIDs.endOf(endDate.getTime())))
                .orderBy(desc("id"))
                .limit(nbRecentTags);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("tag"))
                .collect(Collectors.toList());
    }
}
