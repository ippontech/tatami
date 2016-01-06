package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.repository.TrendRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.desc;
import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.ttl;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TRENDS_CF;

/**
 * Cassandra implementation of the Trends repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = date
 * - Value = tag
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTrendRepository implements TrendRepository {

    private final static int COLUMN_TTL = 60 * 60 * 24 * 30; // The column is stored for 30 days.

    private final static int TRENDS_NUMBER_OF_TAGS = 100;

    @Inject
    Session session;


    @Override
    @CacheEvict(value = "domain-tags-cache", key = "#domain")
    public void addTag(String domain, String tag) {
        Statement statement = QueryBuilder.insertInto("trends")
                .value("domain", domain)
                .value("id", UUIDs.timeBased())
                .value("tag", tag)
                .using(ttl(COLUMN_TTL));
        session.execute(statement);
    }

    @Override
    public List<String> getRecentTags(String domain) {
        return getRecentTags(domain, TRENDS_NUMBER_OF_TAGS);
    }

    @Override
    public List<String> getRecentTags(String domain, int maxNumber) {
        Statement statement = QueryBuilder.select()
                .column("tag")
                .from("trends")
                .where(eq("domain", domain))
                .orderBy(desc("id"))
                .limit(maxNumber);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("tag"))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "domain-tags-cache", key = "#domain")
    public Collection<String> getDomainTags(String domain) {
        Statement statement = QueryBuilder.select()
                .column("tag")
                .from("trends")
                .where(eq("domain", domain))
                .orderBy(desc("id"))
                .limit(TRENDS_NUMBER_OF_TAGS);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("tag"))
                .collect(Collectors.toList());

    }

}
