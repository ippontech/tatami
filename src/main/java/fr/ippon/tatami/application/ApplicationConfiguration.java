package fr.ippon.tatami.application;

import static fr.ippon.tatami.application.ColumnFamilyKeys.COUNTER_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.FOLLOWERS_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.FRIENDS_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.TWEET_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.USERLINE_CF;
import static fr.ippon.tatami.application.ColumnFamilyKeys.USER_CF;
import static me.prettyprint.hector.api.HConsistencyLevel.ONE;
import static me.prettyprint.hector.api.ddl.ComparatorType.COUNTERTYPE;
import static me.prettyprint.hector.api.ddl.ComparatorType.UTF8TYPE;
import static me.prettyprint.hector.api.factory.HFactory.createColumnFamilyDefinition;
import static me.prettyprint.hector.api.factory.HFactory.createKeyspace;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;

import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.cassandra.service.ThriftCfDef;
import me.prettyprint.cassandra.service.ThriftCluster;
import me.prettyprint.cassandra.service.ThriftKsDef;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.ddl.KeyspaceDefinition;
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
        ThriftCluster cluster = buildCluster();
        buildKeyspace(cluster);
        return createKeyspace(cassandraKeyspace, cluster, buildConsistencyLevelPolicy());
    }

    private void buildKeyspace(ThriftCluster cluster) {
        KeyspaceDefinition keyspaceDef = cluster.describeKeyspace(cassandraKeyspace);
        if (keyspaceDef != null) {
            return;
        }
        log.warn("Keyspace \"" + cassandraKeyspace + "\" does not exist, creating it!");
        keyspaceDef = new ThriftKsDef(cassandraKeyspace);
        cluster.addKeyspace(keyspaceDef, true);

        addColumnFamily(cluster, USER_CF);
        addColumnFamily(cluster, FRIENDS_CF);
        addColumnFamily(cluster, FOLLOWERS_CF);
        addColumnFamily(cluster, TWEET_CF);
        addColumnFamily(cluster, TIMELINE_CF);
        addColumnFamily(cluster, USERLINE_CF);

        ThriftCfDef cfDef = new ThriftCfDef(cassandraKeyspace, COUNTER_CF, UTF8TYPE);
        cfDef.setDefaultValidationClass(COUNTERTYPE.getClassName());
        cluster.addColumnFamily(cfDef);
    }

    private ConfigurableConsistencyLevel buildConsistencyLevelPolicy() {
        ConfigurableConsistencyLevel consistencyLevelPolicy = new ConfigurableConsistencyLevel();
        consistencyLevelPolicy.setDefaultReadConsistencyLevel(ONE);
        return consistencyLevelPolicy;
    }

    private ThriftCluster buildCluster() {
        CassandraHostConfigurator cassandraHostConfigurator = new CassandraHostConfigurator(cassandraHost);
        ThriftCluster cluster = new ThriftCluster(cassandraClusterName, cassandraHostConfigurator);
        return cluster;
    }

    private void addColumnFamily(ThriftCluster cluster, String cfName) {
        cluster.addColumnFamily(createColumnFamilyDefinition(cassandraKeyspace, cfName));
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
