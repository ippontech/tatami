package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.domain.status.Status;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.TreeSet;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.incr;

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
public class DaylineRepository {

    @Inject
    Session session;




    public void addStatusToDayline(Status status, String day) {
        String key = getKey(status.getDomain(), day);
        Statement query = QueryBuilder.update("dayline")
                .with(incr("statusCount", 1))
                // Use incr for counters
                .where(eq("domainDay", key)).and(eq("username",status.getUsername()));
        session.execute(query);
    }


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
