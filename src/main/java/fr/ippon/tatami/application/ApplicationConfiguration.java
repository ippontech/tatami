package fr.ippon.tatami.application;

import static fr.ippon.tatami.application.ColumnFamilyKeys.COUNTER_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.FOLLOWERS_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.FRIENDS_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.TWEET_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.USERLINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.USER_CF;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;

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
import org.apache.thrift.transport.TTransportException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import fr.ippon.tatami.domain.Tweet;

/**
 * Main configuration file.
 * 
 * @author Julien Dubois
 */
@Configuration
public class ApplicationConfiguration {

    private final Log log = LogFactory.getLog(ApplicationConfiguration.class);

    @Value("${cassandra.host}")
    private String cassandraHost;

    @Value("${cassandra.clusterName}")
    private String cassandraClusterName;

    @Value("${cassandra.keyspace}")
    private String cassandraKeyspace;

    @Bean
    public Keyspace keyspaceOperator() {
        CassandraHostConfigurator cassandraHostConfigurator = new CassandraHostConfigurator(cassandraHost);
        ThriftCluster cluster = new ThriftCluster(cassandraClusterName, cassandraHostConfigurator);
        ConfigurableConsistencyLevel consistencyLevelPolicy = new ConfigurableConsistencyLevel();
        consistencyLevelPolicy.setDefaultReadConsistencyLevel(HConsistencyLevel.ONE);

        KeyspaceDefinition keyspaceDef = cluster.describeKeyspace(cassandraKeyspace);
        if (keyspaceDef == null) {
            log.warn("Keyspace \"" + cassandraKeyspace + "\" does not exist, creating it!");
            keyspaceDef = new ThriftKsDef(cassandraKeyspace);
            cluster.addKeyspace(keyspaceDef, true);

            addColumnFamily(cluster, USER_CF);
            addColumnFamily(cluster, FRIENDS_CF);
            addColumnFamily(cluster, FOLLOWERS_CF);
            addColumnFamily(cluster, TWEET_CF);
            addColumnFamily(cluster, TIMELINE_CF);
            addColumnFamily(cluster, USERLINE_CF);

            ThriftCfDef cfDef = new ThriftCfDef(cassandraKeyspace, COUNTER_CF, ComparatorType.UTF8TYPE);

            cfDef.setDefaultValidationClass(ComparatorType.COUNTERTYPE.getClassName());
            cluster.addColumnFamily(cfDef);
        }
        return HFactory.createKeyspace(cassandraKeyspace, cluster, consistencyLevelPolicy);
    }

    private void addColumnFamily(ThriftCluster cluster, String cfName) {
        ColumnFamilyDefinition cfd = HFactory.createColumnFamilyDefinition(cassandraKeyspace, cfName);
        cluster.addColumnFamily(cfd);
    }

    @Bean
    public EntityManager entityManager(Keyspace keyspace) {
        return new EntityManagerImpl(keyspace, Tweet.class.getPackage().getName());
    }

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami started!");
    }
}
