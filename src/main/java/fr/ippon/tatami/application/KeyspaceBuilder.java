package fr.ippon.tatami.application;

import static com.google.common.base.Preconditions.checkNotNull;
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
import static org.apache.commons.lang.StringUtils.trimToNull;
import lombok.extern.slf4j.Slf4j;
import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.cassandra.service.ThriftCfDef;
import me.prettyprint.cassandra.service.ThriftCluster;
import me.prettyprint.cassandra.service.ThriftKsDef;
import me.prettyprint.hector.api.Keyspace;

@Slf4j
public class KeyspaceBuilder {

    private String host;
    private String clusterName;
    private String keyspaceName;

    private KeyspaceBuilder() {

    }

    public static KeyspaceBuilder newKeyspace() {
        return new KeyspaceBuilder();
    }

    public KeyspaceBuilder host(String host) {
        this.host = checkNotNull(trimToNull(host), "cassandra host should not be null or empty");
        return this;
    }

    public KeyspaceBuilder clusterName(String clusterName) {
        this.clusterName = checkNotNull(trimToNull(clusterName), "cassandra clusterName should not be null or empty");
        return this;
    }

    public KeyspaceBuilder keyspaceName(String keyspaceName) {
        this.keyspaceName = checkNotNull(trimToNull(keyspaceName), "cassandra keyspaceName should not be null or empty");
        return this;
    }

    public Keyspace build() {
        return createKeyspace(keyspaceName, buildCluster(), buildConsistencyLevelPolicy());
    }

    private ThriftCluster buildCluster() {
        ThriftCluster cluster = new ThriftCluster(clusterName, new CassandraHostConfigurator(host));
        return hasKeyspace(cluster) ? cluster : initCluster(cluster);
    }

    private ThriftCluster initCluster(ThriftCluster cluster) {
        if (hasKeyspace(cluster)) {
            return cluster;
        }
        log.warn("Keyspace \"{}\" does not exist, creating it", keyspaceName);
        addKeyspace(cluster);
        addColumnFamilies(cluster, USER_CF, FRIENDS_CF, FOLLOWERS_CF, TWEET_CF, TIMELINE_CF, USERLINE_CF);
        addCounterColumnFamily(cluster, COUNTER_CF);
        return cluster;
    }

    private void addKeyspace(ThriftCluster cluster) {
        boolean waitForSchemaAgreement = true;
        cluster.addKeyspace(new ThriftKsDef(keyspaceName), waitForSchemaAgreement);
    }

    private void addColumnFamilies(ThriftCluster cluster, String... cfNames) {
        for (String cfName : cfNames) {
            addColumnFamily(cluster, cfName);
        }
    }

    private void addColumnFamily(ThriftCluster cluster, String cfName) {
        cluster.addColumnFamily(createColumnFamilyDefinition(keyspaceName, cfName));
    }

    private void addCounterColumnFamily(ThriftCluster cluster, String cfName) {
        ThriftCfDef cfDef = new ThriftCfDef(keyspaceName, cfName, UTF8TYPE);
        cfDef.setDefaultValidationClass(COUNTERTYPE.getClassName());
        cluster.addColumnFamily(cfDef);
    }

    private boolean hasKeyspace(ThriftCluster cluster) {
        return cluster.describeKeyspace(keyspaceName) != null;
    }

    private ConfigurableConsistencyLevel buildConsistencyLevelPolicy() {
        ConfigurableConsistencyLevel consistencyLevelPolicy = new ConfigurableConsistencyLevel();
        consistencyLevelPolicy.setDefaultReadConsistencyLevel(ONE);
        return consistencyLevelPolicy;
    }
}