package fr.ippon.tatami.config;

//import com.netflix.astyanax.AstyanaxContext;
//import com.netflix.astyanax.Cluster;
//import com.netflix.astyanax.Keyspace;
//import com.netflix.astyanax.connectionpool.NodeDiscoveryType;
//import com.netflix.astyanax.connectionpool.impl.ConnectionPoolConfigurationImpl;
//import com.netflix.astyanax.connectionpool.impl.CountingConnectionPoolMonitor;
//import com.netflix.astyanax.impl.AstyanaxConfigurationImpl;
//import com.netflix.astyanax.thrift.ThriftFamilyFactory;
import me.prettyprint.hector.api.Keyspace;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.PreDestroy;
import javax.inject.Inject;

/**
 * Cassandra configuration file.
 *
 * @author Julien Dubois
 */
public class CassandraDConfiguration {

    private final Logger log = LoggerFactory.getLogger(CassandraDConfiguration.class);

    @Inject
    private Environment env;

//    private Cluster myCluster;

    @PreDestroy
    public void destroy() {
        log.info("Closing Hector connection pool");
//        HFactory.shutdownCluster(myCluster);
    }

//    @Bean
    public Keyspace keyspaceOperator() {
        log.info("Configuring Cassandra keyspace");
//        String cassandraHost = env.getProperty("cassandra.host");
//        String cassandraClusterName = env.getProperty("cassandra.clusterName");
//        String cassandraKeyspace = env.getProperty("cassandra.keyspace");
//        AstyanaxContext<Keyspace> context = new AstyanaxContext.Builder()
//                .forCluster(cassandraClusterName)
//                .forKeyspace(cassandraKeyspace)
//                .withAstyanaxConfiguration(new AstyanaxConfigurationImpl()
//                        .setDiscoveryType(NodeDiscoveryType.RING_DESCRIBE)
//                        .setCqlVersion("3.3.0")
//                        .setTargetCassandraVersion("2.2")
//                )
//                .withConnectionPoolConfiguration(new ConnectionPoolConfigurationImpl("MyConnectionPool")
//                        .setPort(9142)
//                        .setMaxConnsPerHost(1)
//                        .setSeeds(cassandraHost)
//                )
//                .withConnectionPoolMonitor(new CountingConnectionPoolMonitor())
//                .buildKeyspace(ThriftFamilyFactory.getInstance());
//        context.start();
//        Keyspace keyspace = context.getClient();

        return null;
    }
//
//        CassandraHostConfigurator cassandraHostConfigurator = new CassandraHostConfigurator(cassandraHost);
//        cassandraHostConfigurator.setMaxActive(100);
//        if (env.acceptsProfiles(Constants.SPRING_PROFILE_METRICS)) {
//            log.debug("Cassandra Metrics monitoring enabled");
//            HOpTimer hOpTimer = new MetricsOpTimer(cassandraClusterName);
//            cassandraHostConfigurator.setOpTimer(hOpTimer);
//        }
//        ThriftCluster cluster = new ThriftCluster(cassandraClusterName, cassandraHostConfigurator);
//        this.myCluster = cluster; // Keep a pointer to the cluster, as Hector is buggy and can't find it again...
//        ConfigurableConsistencyLevel consistencyLevelPolicy = new ConfigurableConsistencyLevel();
//        consistencyLevelPolicy.setDefaultReadConsistencyLevel(HConsistencyLevel.ONE);
//
//        KeyspaceDefinition keyspaceDef = cluster.describeKeyspace(cassandraKeyspace);
//        if (keyspaceDef == null) {
//            log.warn("Keyspace \" {} \" does not exist, creating it!", cassandraKeyspace);
//            keyspaceDef = new ThriftKsDef(cassandraKeyspace);
//            cluster.addKeyspace(keyspaceDef, true);
//
//            addColumnFamily(cluster, ColumnFamilyKeys.USER_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.FRIENDS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.FOLLOWERS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.STATUS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.DOMAIN_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.REGISTRATION_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.RSS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.MAILDIGEST_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.SHARES_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.DISCUSSION_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.USER_TAGS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.TAG_FOLLOWERS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.GROUP_MEMBERS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.USER_GROUPS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.GROUP_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.GROUP_DETAILS_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.ATTACHMENT_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.AVATAR_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.DOMAIN_CONFIGURATION_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.TATAMIBOT_CONFIGURATION_CF, 0);
//            addColumnFamily(cluster, ColumnFamilyKeys.APPLE_DEVICE_CF, 0);
//
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.TIMELINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.TIMELINE_SHARES_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.MENTIONLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USERLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USERLINE_SHARES_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.FAVLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.TAGLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.TRENDS_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USER_TRENDS_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.GROUPLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USER_ATTACHMENT_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.STATUS_ATTACHMENT_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.DOMAINLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.DOMAIN_TATAMIBOT_CF, 0);
//
//            addColumnFamilyCounter(cluster, ColumnFamilyKeys.COUNTER_CF, 0);
//            addColumnFamilyCounter(cluster, ColumnFamilyKeys.TAG_COUNTER_CF, 0);
//            addColumnFamilyCounter(cluster, ColumnFamilyKeys.GROUP_COUNTER_CF, 0);
//            addColumnFamilyCounter(cluster, ColumnFamilyKeys.DAYLINE_CF, 0);
//
//            //Tatami Bot CF
//            addColumnFamily(cluster, ColumnFamilyKeys.TATAMIBOT_DUPLICATE_CF, 0);
//        }
//        return HFactory.createKeyspace(cassandraKeyspace, cluster, consistencyLevelPolicy);
//    }
//
//    @Bean
//    public EntityManagerImpl entityManager(Keyspace keyspace) {
//        String[] packagesToScan = {"fr.ippon.tatami.domain", "fr.ippon.tatami.bot.config"};
//        return new EntityManagerImpl(keyspace, packagesToScan);
//    }
//
//    private void addColumnFamily(ThriftCluster cluster, String cfName, int rowCacheKeysToSave) {
//
//        String cassandraKeyspace = this.env.getProperty("cassandra.keyspace");
//
//        ColumnFamilyDefinition cfd =
//                HFactory.createColumnFamilyDefinition(cassandraKeyspace, cfName);
//
//        cfd.setRowCacheKeysToSave(rowCacheKeysToSave);
//        cluster.addColumnFamily(cfd);
//    }
//
//    private void addColumnFamilySortedbyUUID(ThriftCluster cluster, String cfName, int rowCacheKeysToSave) {
//
//        String cassandraKeyspace = this.env.getProperty("cassandra.keyspace");
//
//        ColumnFamilyDefinition cfd =
//                HFactory.createColumnFamilyDefinition(cassandraKeyspace, cfName);
//
//        cfd.setRowCacheKeysToSave(rowCacheKeysToSave);
//        cfd.setComparatorType(ComparatorType.UUIDTYPE);
//        cluster.addColumnFamily(cfd);
//    }
//
//
//    private void addColumnFamilyCounter(ThriftCluster cluster, String cfName, int rowCacheKeysToSave) {
//        String cassandraKeyspace = this.env.getProperty("cassandra.keyspace");
//
//        ThriftCfDef cfd =
//                new ThriftCfDef(cassandraKeyspace, cfName, ComparatorType.UTF8TYPE);
//
//        cfd.setRowCacheKeysToSave(rowCacheKeysToSave);
//        cfd.setDefaultValidationClass(ComparatorType.COUNTERTYPE.getClassName());
//        cluster.addColumnFamily(cfd);
//    }
}
