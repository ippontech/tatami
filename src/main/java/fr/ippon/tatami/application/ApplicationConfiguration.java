package fr.ippon.tatami.application;

import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.cassandra.service.ThriftCluster;
import me.prettyprint.cassandra.service.ThriftKsDef;
import me.prettyprint.hector.api.HConsistencyLevel;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.ddl.ColumnFamilyDefinition;
import me.prettyprint.hector.api.ddl.KeyspaceDefinition;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hom.EntityManagerImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.thrift.transport.TTransportException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import java.io.IOException;

import static fr.ippon.tatami.application.ColumnFamilyKeys.*;

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

            ColumnFamilyDefinition userCf =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, USER_CF);
            cluster.addColumnFamily(userCf);

            ColumnFamilyDefinition openidCf =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, OPENID_CF);
            cluster.addColumnFamily(openidCf);

            ColumnFamilyDefinition friendsCf =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, FRIENDS_CF);
            cluster.addColumnFamily(friendsCf);

            ColumnFamilyDefinition followersCf =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, FOLLOWERS_CF);
            cluster.addColumnFamily(followersCf);

            ColumnFamilyDefinition tweetCf =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, TWEET_CF);
            cluster.addColumnFamily(tweetCf);

            ColumnFamilyDefinition timelineCf =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, TIMELINE_CF);
            cluster.addColumnFamily(timelineCf);

            ColumnFamilyDefinition userlineCF =
                    HFactory.createColumnFamilyDefinition(cassandraKeyspace, USERLINE_CF);
            cluster.addColumnFamily(userlineCF);
        }
        return HFactory.createKeyspace(cassandraKeyspace, cluster, consistencyLevelPolicy);
    }

    @Bean
    public EntityManager entityManager(Keyspace keyspace) {
        return new EntityManagerImpl(keyspace, "fr.ippon.tatami.domain");
    }

    @PostConstruct
    public void initTatami() throws IOException, TTransportException {
        log.info("Tatami started!");
    }
}
