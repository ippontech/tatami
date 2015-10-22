package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hom.EntityManagerImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of CassandraTatamibotConfigurationRepository.
 * <p/>
 * <p/>
 * This uses two CF
 * <p/>
 * DomainTatamibot :
 * - Key : domain
 * - Name : TatamibotConfiguration Id
 * - Value : ""
 * <p/>
 * TatamibotConfiguration, managed by Hector Object Mapper
 * - Key : Tatamibot Id
 * - Name : Key
 * - Value : Value
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTatamibotConfigurationRepository implements TatamibotConfigurationRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraTatamibotConfigurationRepository.class);

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private EntityManagerImpl em;

    @Override
    public void insertTatamibotConfiguration(TatamibotConfiguration tatamibotConfiguration) {
        UUID tatamibotConfigurationId = TimeUUIDUtils.getUniqueTimeUUIDinMillis();
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(
                tatamibotConfiguration.getDomain(),
                ColumnFamilyKeys.DOMAIN_TATAMIBOT_CF,
                HFactory.createColumn(
                        tatamibotConfigurationId,
                        "",
                        UUIDSerializer.get(),
                        StringSerializer.get()));

        tatamibotConfiguration.setTatamibotConfigurationId(tatamibotConfigurationId.toString());
        em.persist(tatamibotConfiguration);
    }

    @Override
    public void updateTatamibotConfiguration(TatamibotConfiguration tatamibotConfiguration) {
        em.persist(tatamibotConfiguration);
    }

    @Override
    public TatamibotConfiguration findTatamibotConfigurationById(String tatamibotConfigurationId) {
        return em.find(TatamibotConfiguration.class, tatamibotConfigurationId);
    }

    @Override
    public Collection<TatamibotConfiguration> findTatamibotConfigurationsByDomain(String domain) {

        Set<TatamibotConfiguration> configurations = new HashSet<TatamibotConfiguration>();

        ColumnSlice<UUID, String> results = HFactory.createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(ColumnFamilyKeys.DOMAIN_TATAMIBOT_CF)
                .setKey(domain)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        for (HColumn<UUID, String> column : results.getColumns()) {
            String tatamibotConfigurationId = column.getName().toString();
            TatamibotConfiguration configuration = em.find(TatamibotConfiguration.class, tatamibotConfigurationId);
            configurations.add(configuration);
        }
        return configurations;
    }
}
