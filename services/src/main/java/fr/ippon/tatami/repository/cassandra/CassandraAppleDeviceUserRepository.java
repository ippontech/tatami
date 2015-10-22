package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.AppleDeviceUserRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

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
    private Keyspace keyspaceOperator;

    @Override
    public void createAppleDeviceForUser(String deviceId, String login) {
        log.debug("Mapping Apple device id to user {} : {}", deviceId, login);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(deviceId, APPLE_DEVICE_USER_CF, HFactory.createColumn(USER_LOGIN,
                login, StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void removeAppleDeviceForUser(String deviceId) {
        log.debug("Removing mapping of Apple device id {}", deviceId);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(deviceId, APPLE_DEVICE_USER_CF);
        mutator.execute();
    }

    @Override
    public String findLoginForDeviceId(String deviceId) {
        log.debug("Finding user of Apple device id {}", deviceId);
        ColumnQuery<String, String, String> query = HFactory.createStringColumnQuery(keyspaceOperator);
        HColumn<String, String> column =
                query.setColumnFamily(APPLE_DEVICE_USER_CF)
                        .setKey(deviceId)
                        .setName(USER_LOGIN)
                        .execute()
                        .get();

        if (column != null) {
            return column.getValue();
        } else {
            return null;
        }
    }
}
