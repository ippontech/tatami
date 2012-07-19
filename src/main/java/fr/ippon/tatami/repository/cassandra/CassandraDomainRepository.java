package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.DomainRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DOMAIN_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the Follower repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraDomainRepository implements DomainRepository {

    private final Log log = LogFactory.getLog(CassandraDomainRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addUserInDomain(String domain, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(domain, DOMAIN_CF, HFactory.createColumn(login,
                Calendar.getInstance().getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void updateUserInDomain(String domain, String login) {
        this.addUserInDomain(domain, login);
    }

    @Override
    public void deleteUserInDomain(String domain, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(domain, DOMAIN_CF, login, StringSerializer.get());
    }

    @Override
    public List<String> getLoginsInDomain(String domain, int pagination) {
        List<String> logins = new ArrayList<String>();
        ColumnSlice<String, String> result;
        result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(DOMAIN_CF)
                .setKey(domain)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        int index = 0;
        for (HColumn<String, String> column : result.getColumns()) {
            // We take one more item, to display (or not) the "next" button if there is an item after the displayed list.
            if (index > pagination + Constants.PAGINATION_SIZE) {
                break;
            }
            if (index >= pagination) {
                logins.add(column.getName());
            }
            index++;
        }
        return logins;
    }
}
