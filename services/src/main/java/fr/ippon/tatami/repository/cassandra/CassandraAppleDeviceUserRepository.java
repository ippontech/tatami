package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.AppleDeviceUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.APPLE_DEVICE_USER_CF;

/**
 * Cassandra implementation of the AppleDeviceUser repository.
 * <p/>
 * Maps Apple device ids to users.
 * <p/>
 * Structure :
 * - Key = apple device id
 * - Name = USER_LOGIN
 * - Value = user login
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraAppleDeviceUserRepository implements AppleDeviceUserRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraAppleDeviceUserRepository.class);

    private static final String USER_LOGIN = "USER_LOGIN";

    @Inject
    private Session session;

    @Override
    public void createAppleDeviceForUser(String deviceId, String login) {
        log.debug("Mapping Apple device id to user {} : {}", deviceId, login);
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.APPLE_DEVICE_USER_CF)
                .value("deviceId", deviceId)
                .value("login", login);
        session.execute(statement);
    }

    @Override
    public void removeAppleDeviceForUser(String deviceId) {
        log.debug("Removing mapping of Apple device id {}", deviceId);
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.APPLE_DEVICE_USER_CF)
                .where(eq("deviceId", deviceId));
        session.execute(statement);
    }

    @Override
    public String findLoginForDeviceId(String deviceId) {
        log.debug("Finding user of Apple device id {}", deviceId);
        Statement statement = QueryBuilder.select()
                .column("login")
                .from(ColumnFamilyKeys.APPLE_DEVICE_USER_CF)
                .where(eq("deviceId", deviceId));
        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            return results.one().getString("login");
        }
        return null;
    }
}
