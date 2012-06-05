package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.DomainRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Calendar;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DOMAIN_CF;

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
}
