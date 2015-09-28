package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.AppleDeviceRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

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
    private Keyspace keyspaceOperator;

    @Override
    public void createAppleDevice(String login, String deviceId) {
        log.debug("Creating Apple Device for user {} : {}", login, deviceId);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, ColumnFamilyKeys.APPLE_DEVICE_CF, HFactory.createColumn(deviceId,
                "", StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void removeAppleDevice(String login, String deviceId) {
        log.debug("Deleting Apple Device for user {} : {}", login, deviceId);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, ColumnFamilyKeys.APPLE_DEVICE_CF, deviceId, StringSerializer.get());
    }

    @Override
    public Collection<String> findAppleDevices(String login) {
        Collection<String> deviceIds = new ArrayList<String>();
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(ColumnFamilyKeys.APPLE_DEVICE_CF)
                .setKey(login)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        for (HColumn<String, String> column : result.getColumns()) {
            deviceIds.add(column.getName());
        }
        return deviceIds;
    }

}
