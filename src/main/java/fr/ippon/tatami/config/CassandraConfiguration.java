package fr.ippon.tatami.config;

import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.cassandra.service.ThriftCfDef;
import me.prettyprint.cassandra.service.ThriftCluster;
import me.prettyprint.cassandra.service.ThriftKsDef;
import me.prettyprint.hector.api.HConsistencyLevel;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.ddl.ColumnFamilyDefinition;
import me.prettyprint.hector.api.ddl.ComparatorType;
import me.prettyprint.hector.api.ddl.KeyspaceDefinition;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hom.EntityManagerImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import static fr.ippon.tatami.config.ColumnFamilyKeys.*;

/**
 * Cassandra configuration file.
 *
 * @author Julien Dubois
 */
@Configuration
public class CassandraConfiguration {

    private final Log log = LogFactory.getLog(CassandraConfiguration.class);

    @Inject
    Environment env;

    @Bean
    public Keyspace keyspaceOperator() {

        String cassandraHost = this.env.getProperty("cassandra.host");
        String cassandraClusterName = this.env.getProperty("cassandra.clusterName");
        String cassandraKeyspace = this.env.getProperty("cassandra.keyspace");

        CassandraHostConfigurator cassandraHostConfigurator = new CassandraHostConfigurator(cassandraHost);
        ThriftCluster cluster = new ThriftCluster(cassandraClusterName, cassandraHostConfigurator);
        ConfigurableConsistencyLevel consistencyLevelPolicy = new ConfigurableConsistencyLevel();
        consistencyLevelPolicy.setDefaultReadConsistencyLevel(HConsistencyLevel.ONE);

        KeyspaceDefinition keyspaceDef = cluster.describeKeyspace(cassandraKeyspace);
        if (keyspaceDef == null) {
            this.log.warn("Keyspace \"" + cassandraKeyspace + "\" does not exist, creating it!");
            keyspaceDef = new ThriftKsDef(cassandraKeyspace);
            cluster.addKeyspace(keyspaceDef, true);

            addColumnFamilySortedbyUUID(cluster, TIMELINE_CF);
            addColumnFamily(cluster, USER_CF);
            addColumnFamily(cluster, FRIENDS_CF);
            addColumnFamily(cluster, FOLLOWERS_CF);
            addColumnFamily(cluster, TWEET_CF);
            addColumnFamilySortedbyUUID(cluster, DAYLINE_CF);
            addColumnFamilySortedbyUUID(cluster, FAVLINE_CF);
            addColumnFamilySortedbyUUID(cluster, TAGLINE_CF);
            addColumnFamilySortedbyUUID(cluster, USERLINE_CF);
            addColumnFamily(cluster, URLS_CF);

            ThriftCfDef cfDef =
                    new ThriftCfDef(cassandraKeyspace, COUNTER_CF, ComparatorType.UTF8TYPE);

            cfDef.setDefaultValidationClass(ComparatorType.COUNTERTYPE.getClassName());
            cluster.addColumnFamily(cfDef);
        }
        return HFactory.createKeyspace(cassandraKeyspace, cluster, consistencyLevelPolicy);
    }


    private void addColumnFamily(ThriftCluster cluster, String cfName) {

        String cassandraKeyspace = this.env.getProperty("cassandra.keyspace");

        ColumnFamilyDefinition cfd =
                HFactory.createColumnFamilyDefinition(cassandraKeyspace, cfName);

        cluster.addColumnFamily(cfd);
    }

    private void addColumnFamilySortedbyUUID(ThriftCluster cluster, String cfName) {

        String cassandraKeyspace = this.env.getProperty("cassandra.keyspace");

        ColumnFamilyDefinition cfd =
                HFactory.createColumnFamilyDefinition(cassandraKeyspace, cfName);

        cfd.setComparatorType(ComparatorType.UUIDTYPE);
        cluster.addColumnFamily(cfd);
    }

    @Bean
    public EntityManager entityManager(Keyspace keyspace) {
        return new EntityManagerImpl(keyspace, "fr.ippon.tatami.domain");
    }

}
