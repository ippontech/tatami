package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.SharesRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.SHARES_CF;

/**
 * Cassandra implementation of the Shares repository.
 * Lists the shares for a given status.
 * <p/>
 * Structure :
 * - Key = status Id
 * - Name = time
 * - Value = login who shared this status
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraSharesRepository implements SharesRepository {

    @Inject
    private Session session;

    @Override
    @CacheEvict(value = "shared-cache", key = "#statusId")
    public void newShareByLogin(String statusId, String sharedByLogin) {
        Statement statement = QueryBuilder.insertInto(SHARES_CF)
                .value("status", UUID.fromString(statusId))
                .value("login",sharedByLogin);
        session.execute(statement);
    }

   @Override
   @Cacheable("shared-cache")
    public Collection<String> findLoginsWhoSharedAStatus(String statusId) {
       Statement statement = QueryBuilder.select()
               .column("login")
               .from(SHARES_CF)
               .where(eq("status", statusId))
               .limit(100);
       ResultSet results = session.execute(statement);
       return results
               .all()
               .stream()
               .map(e -> e.getString("login"))
               .collect(Collectors.toList());
    }

    @Override
    public boolean hasBeenShared(String statusId) {
        Statement statement = QueryBuilder.select()
                .column("login")
                .from(SHARES_CF)
                .where(eq("status", statusId))
                .limit(1);
        ResultSet results = session.execute(statement);
        return !results.isExhausted();
    }
}
