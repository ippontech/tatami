package fr.ippon.tatami.repository.cassandra;

import com.google.common.collect.Maps;
import fr.ippon.tatami.repository.RegistrationRepository;
import fr.ippon.tatami.service.util.RandomUtil;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import me.prettyprint.hector.api.query.SliceQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.List;
import java.util.Map;

import static fr.ippon.tatami.config.ColumnFamilyKeys.REGISTRATION_CF;

/**
 * Cassandra implementation of the Registration repository.
 * <p/>
 * Structure :
 * - Key = "registration_key"
 * - Name = key
 * - Value = login
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraRegistrationRepository implements RegistrationRepository {

    private final Log log = LogFactory.getLog(CassandraRegistrationRepository.class);

    private final static String ROW_KEY = "registration_key";

    private final static int COLUMN_TTL = 60 * 60 * 24 * 2; // The column is stored for 2 days.

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public String generateRegistrationKey(String login) {
        String key = RandomUtil.generateRegistrationKey();
        HColumn<String, String> column = HFactory.createColumn(key,
                login, COLUMN_TTL, StringSerializer.get(), StringSerializer.get());

        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(ROW_KEY, REGISTRATION_CF, column);
        return key;
    }

    @Override
    public String getLoginByRegistrationKey(String registrationKey) {
        ColumnQuery<String, String, String> query = HFactory.createStringColumnQuery(keyspaceOperator);
        HColumn<String, String> column =
                query.setColumnFamily(REGISTRATION_CF)
                        .setKey(ROW_KEY)
                        .setName(registrationKey)
                        .execute()
                        .get();

        if (column != null) {
            return column.getValue();
        } else {
            return null;
        }
    }

    /**
     * !! For testing purpose only !!
     * This method is not efficient and is limited to 10000 registrations.
     * Other limitation : if a login is associated to multiple registrationKey
     *
     * @return
     */
    public Map<String, String> _getAllRegistrationKeyByLogin() {
        Map<String, String> registrationKeyByLogin = Maps.newHashMap();
        SliceQuery<String, String, String> sliceQuery = HFactory.createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get());

        ColumnSlice<String, String> columnSlice =
                sliceQuery.setColumnFamily(REGISTRATION_CF)
                        .setKey(ROW_KEY)
                        .setRange(null, null, false, 10000)
                        .execute().get();

        List<HColumn<String, String>> columns = columnSlice.getColumns();

        for (HColumn<String, String> hColumn : columns) {
            // WARN : here we don't handle multiple registrationKey for one login
            registrationKeyByLogin.put(hColumn.getValue(), hColumn.getName());
        }
        return registrationKeyByLogin;
    }
}
