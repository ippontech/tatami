package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.repository.AppleDeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;


/**
 * Cassandra implementation of the AppleDevice repository.
 * <p/>
 * Maps users to Apple device ids.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = apple device id
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraAppleDeviceRepository implements AppleDeviceRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraAppleDeviceRepository.class);

    @Inject
    private Session session;

    @Override
    public void createAppleDevice(String login, String deviceId) {
        log.debug("Creating Apple Device for user {} : {}", login, deviceId);
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.APPLE_DEVICE_CF)
                .value("login", login)
                .value("deviceId", deviceId);
        session.execute(statement);
    }

    @Override
    public void removeAppleDevice(String login, String deviceId) {
        log.debug("Deleting Apple Device for user {} : {}", login, deviceId);
        Statement statement = QueryBuilder.delete().from(ColumnFamilyKeys.APPLE_DEVICE_CF)
                .where(eq("login", login))
                .and(eq("deviceId", deviceId));
        session.execute(statement);
    }

    @Override
    public Collection<String> findAppleDevices(String login) {
        Statement statement = QueryBuilder.select()
                .column("deviceId")
                .from(ColumnFamilyKeys.APPLE_DEVICE_CF)
                .where(eq("login", login));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("deviceId"))
                .collect(Collectors.toList());
    }

}
