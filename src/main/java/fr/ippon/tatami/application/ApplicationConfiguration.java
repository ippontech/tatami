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

import lombok.extern.slf4j.Slf4j;
import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.cassandra.service.ThriftCfDef;
import me.prettyprint.cassandra.service.ThriftCluster;
import me.prettyprint.cassandra.service.ThriftKsDef;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hom.EntityManagerImpl;

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
@Slf4j
public class ApplicationConfiguration {

    @Value("${cassandra.host}")
    private String cassandraHost;

    @Value("${cassandra.clusterName}")
    private String cassandraClusterName;

    @Value("${cassandra.keyspace}")
    private String cassandraKeyspace;

    @Bean
    public Keyspace keyspaceOperator() {
        return createKeyspace(cassandraKeyspace, buildCluster(), buildConsistencyLevelPolicy());
    }

    private ThriftCluster initCluster(ThriftCluster cluster) {
        if (hasKeyspace(cluster)) {
            return cluster;
        }
        log.warn("Keyspace \"{}\" does not exist, creating it!", cassandraKeyspace);
        addKeyspace(cluster, cassandraKeyspace);
        addColumnFamilies(cluster, cassandraKeyspace, USER_CF, FRIENDS_CF, FOLLOWERS_CF, TWEET_CF, TIMELINE_CF, USERLINE_CF);
        addCounterColumnFamily(cluster, cassandraKeyspace, COUNTER_CF);
        return cluster;
    }

    private void addKeyspace(ThriftCluster cluster, String keyspace) {
        boolean waitForSchemaAgreement = true;
        cluster.addKeyspace(new ThriftKsDef(keyspace), waitForSchemaAgreement);
    }

    private void addColumnFamilies(ThriftCluster cluster, String keyspace, String... cfNames) {
        for (String cfName : cfNames) {
            addColumnFamily(cluster, keyspace, cfName);
        }
    }

    private void addColumnFamily(ThriftCluster cluster, String keyspace, String cfName) {
        cluster.addColumnFamily(createColumnFamilyDefinition(keyspace, cfName));
    }

    private void addCounterColumnFamily(ThriftCluster cluster, String keyspace, String cfName) {
        ThriftCfDef cfDef = new ThriftCfDef(keyspace, cfName, UTF8TYPE);
        cfDef.setDefaultValidationClass(COUNTERTYPE.getClassName());
        cluster.addColumnFamily(cfDef);
    }

    private boolean hasKeyspace(ThriftCluster cluster) {
        return cluster.describeKeyspace(cassandraKeyspace) != null;
    }

    private ConfigurableConsistencyLevel buildConsistencyLevelPolicy() {
        ConfigurableConsistencyLevel consistencyLevelPolicy = new ConfigurableConsistencyLevel();
        consistencyLevelPolicy.setDefaultReadConsistencyLevel(ONE);
        return consistencyLevelPolicy;
    }

    private ThriftCluster buildCluster() {
        return initCluster(new ThriftCluster(cassandraClusterName, new CassandraHostConfigurator(cassandraHost)));
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
