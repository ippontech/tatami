package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.DaylineRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.TreeSet;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.incr;
import static fr.ippon.tatami.config.ColumnFamilyKeys.DAYLINE_CF;

/**
 * Cassandra implementation of the user repository.
 * <p/>
 * Structure :
 * - Key = day + domain
 * - Name = username
 * - Value = count
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraDaylineRepository implements DaylineRepository {

    @Inject
    Session session;



    @Override
    public void addStatusToDayline(Status status, String day) {
        String key = getKey(status.getDomain(), day);
        Statement query = QueryBuilder.update("dayline")
                .with(incr("statusCount", 1))
                // Use incr for counters
                .where(eq("domainDay", key)).and(eq("username",status.getUsername()));
        session.execute(query);
    }

    @Override
    @Cacheable("dayline-cache")
    public Collection<UserStatusStat> getDayline(String domain, String day) {
        String key = getKey(domain, day);
        Statement statement = QueryBuilder.select()
                .all()
                .from("dayline")
                .where(eq("domainDay", key));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> new UserStatusStat(e.getString("username"),e.getLong("statusCount")))
                .collect(Collectors.toCollection(TreeSet::new));
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String day) {
        return day + "-" + domain;
    }
}
