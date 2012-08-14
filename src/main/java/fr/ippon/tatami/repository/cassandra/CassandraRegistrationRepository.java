package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.RegistrationRepository;
import fr.ippon.tatami.service.util.RandomUtil;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static fr.ippon.tatami.config.ColumnFamilyKeys.REGISTRATION_CF;

/**
 * Cassandra implementation of the Registration repository.
 *
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
}
