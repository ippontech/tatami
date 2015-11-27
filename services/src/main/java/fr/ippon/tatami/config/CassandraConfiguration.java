package fr.ippon.tatami.config;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ConsistencyLevel;
import com.datastax.driver.core.QueryOptions;
import com.datastax.driver.core.SocketOptions;
import com.datastax.driver.core.policies.LatencyAwarePolicy;
import com.datastax.driver.core.policies.LoadBalancingPolicy;
import com.datastax.driver.core.policies.ReconnectionPolicy;
import com.datastax.driver.core.policies.RetryPolicy;
import com.google.common.collect.Lists;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.cassandra.config.CassandraEntityClassScanner;
import org.springframework.data.cassandra.config.CassandraSessionFactoryBean;
import org.springframework.data.cassandra.convert.CassandraConverter;
import org.springframework.data.cassandra.convert.MappingCassandraConverter;
import org.springframework.data.cassandra.core.CassandraAdminOperations;
import org.springframework.data.cassandra.core.CassandraAdminTemplate;
import org.springframework.data.cassandra.mapping.BasicCassandraMappingContext;
import org.springframework.data.cassandra.mapping.CassandraMappingContext;
import org.springframework.util.StringUtils;

import javax.annotation.PreDestroy;
import javax.inject.Inject;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.datastax.driver.core.ProtocolOptions.Compression.LZ4;
import static com.datastax.driver.core.ProtocolOptions.Compression.NONE;
import static com.datastax.driver.core.ProtocolOptions.Compression.SNAPPY;
import static com.datastax.driver.core.ProtocolVersion.V1;
import static com.datastax.driver.core.ProtocolVersion.V2;
import static com.datastax.driver.core.ProtocolVersion.V3;

/**
 * Cassandra configuration file.
 *
 * @author Julien Dubois
 */
@Configuration
public class CassandraConfiguration {

    public static final String CASSANDRA_CLUSTER_NAME = "cassandra.cluster";
    public static final String CASSANDRA_PORT = "cassandra.port";
    public static final String CASSANDRA_PROTOCOL_VERSION = "cassandra.protocolVersion";
    public static final String CASSANDRA_COMPRESSION = "cassandra.compression";
    public static final String CASSANDRA_LOAD_BALANCING_POLICY = "cassandra.loadBalancingPolicy";
    public static final String CASSANDRA_CONSISTENCY = "cassandra.consistency";
    public static final String CASSANDRA_SERIAL_CONSISTENCY = "cassandra.serialConsistency";
    public static final String CASSANDRA_FETCH_SIZE = "cassandra.fetchSize";
    public static final String CASSANDRA_RECONNECTION_POLICY = "cassandra.reconnectionPolicy";
    public static final String CASSANDRA_RETRY_POLICY = "cassandra.retryPolicy";
    public static final String CASSANDRA_USER = "cassandra.user";
    public static final String CASSANDRA_PASSWORD = "cassandra.password";
    public static final String CASSANDRA_CONNECT_TIMEOUT_MILLIS = "cassandra.connectTimeoutMillis";
    public static final String CASSANDRA_READ_TIMEOUT_MILLIS = "cassandra.readTimeoutMillis";
    public static final String CASSANDRA_SSL_ENABLED = "cassandra.sslEnabled";
    public static final String CASSANDRA_CONTACT_POINTS = "cassandra.contactPoints";
    private final Logger log = LoggerFactory.getLogger(CassandraConfiguration.class);

    @Inject
    private Environment env;

    private Cluster myCluster;

    @PreDestroy
    public void destroy() {
        log.info("Closing Hector connection pool");
//        myCluster.getConnectionManager().shutdown();
//        HFactory.shutdownCluster(myCluster);
    }

//    @Bean
//    public Keyspace keyspaceOperator() {
//        log.info("Configuring Cassandra keyspace");
//        String cassandraHost = env.getProperty("cassandra.hostName");
//        String cassandraClusterName = env.getProperty("cassandra.cluster");
//        String cassandraKeyspace = env.getProperty("cassandra.keyspace");
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
//            addColumnFamily(cluster, ColumnFamilyKeys.FRIENDS, 0);
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
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.MENTIONLINE, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USERLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USERLINE_SHARES_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.FAVLINE_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.TAGLINE, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.TRENDS_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USER_TRENDS_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.GROUPLINE, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.USER_ATTACHMENT_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.STATUS_ATTACHMENT_CF, 0);
//            addColumnFamilySortedbyUUID(cluster, ColumnFamilyKeys.DOMAINLINE, 0);
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
//        return null;
//    }

//    @Bean
//    public EntityManagerImpl entityManager(Keyspace keyspace) {
//        return null;
////        String[] packagesToScan = {"fr.ippon.tatami.domain", "fr.ippon.tatami.bot.config"};
////        return new EntityManagerImpl(keyspace, packagesToScan);
//    }

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




    @Inject
    BeanFactory beanFactory;


    com.datastax.driver.core.Cluster cluster;

    @Bean
    public com.datastax.driver.core.Cluster cluster() {
//        if (this.cluster == null) {
//            this.cluster = createCluster();
//        }
//        return cluster;
        return null;
    }

    /**
     * Parse the load balancing policy.
     */
    public LoadBalancingPolicy parseLbPolicy(String loadBalancingPolicyString) throws InstantiationException,
            IllegalAccessException, ClassNotFoundException, NoSuchMethodException, SecurityException,
            IllegalArgumentException, InvocationTargetException {
        String lb_regex = "([a-zA-Z]*Policy)(\\()(.*)(\\))";
        Pattern lb_pattern = Pattern.compile(lb_regex);
        if (!loadBalancingPolicyString.contains("(")) {
            loadBalancingPolicyString += "()";
        }
        Matcher lb_matcher = lb_pattern.matcher(loadBalancingPolicyString);

        if (lb_matcher.matches()) {
            if (lb_matcher.groupCount() > 0) {
                // Primary LB policy has been specified
                String primaryLoadBalancingPolicy = lb_matcher.group(1);
                String loadBalancingPolicyParams = lb_matcher.group(3);
                return getLbPolicy(primaryLoadBalancingPolicy, loadBalancingPolicyParams);
            }
        }
        return null;
    }

    /**
     * Get the load balancing policy.
     */
    public LoadBalancingPolicy getLbPolicy(String lbString, String parameters) throws ClassNotFoundException,
            NoSuchMethodException, SecurityException, InstantiationException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException {
        LoadBalancingPolicy policy = null;
        if (!lbString.contains(".")) {
            lbString = "com.datastax.driver.core.policies." + lbString;
        }

        if (parameters.length() > 0) {
            // Child policy or parameters have been specified
            String paramsRegex = "([^,]+\\(.+?\\))|([^,]+)";
            Pattern param_pattern = Pattern.compile(paramsRegex);
            Matcher lb_matcher = param_pattern.matcher(parameters);

            ArrayList<Object> paramList = Lists.newArrayList();
            ArrayList<Class> primaryParametersClasses = Lists.newArrayList();
            int nb = 0;
            while (lb_matcher.find()) {
                if (lb_matcher.groupCount() > 0) {
                    try {
                        if (lb_matcher.group().contains("(") && !lb_matcher.group().trim().startsWith("(")) {
                            // We are dealing with child policies here
                            primaryParametersClasses.add(LoadBalancingPolicy.class);
                            // Parse and add child policy to the parameter list
                            paramList.add(parseLbPolicy(lb_matcher.group()));
                            nb++;
                        } else {
                            // We are dealing with parameters that are not policies here
                            String param = lb_matcher.group();
                            if (param.contains("'") || param.contains("\"")) {
                                primaryParametersClasses.add(String.class);
                                paramList.add(new String(param.trim().replace("'", "").replace("\"", "")));
                            } else if (param.contains(".") || param.toLowerCase().contains("(double)") || param
                                    .toLowerCase().contains("(float)")) {
                                // gotta allow using float or double
                                if (param.toLowerCase().contains("(double)")) {
                                    primaryParametersClasses.add(double.class);
                                    paramList.add(Double.parseDouble(param.replace("(double)", "").trim()));
                                } else {
                                    primaryParametersClasses.add(float.class);
                                    paramList.add(Float.parseFloat(param.replace("(float)", "").trim()));
                                }
                            } else {
                                if (param.toLowerCase().contains("(long)")) {
                                    primaryParametersClasses.add(long.class);
                                    paramList.add(Long.parseLong(param.toLowerCase().replace("(long)", "").trim()));
                                } else {
                                    primaryParametersClasses.add(int.class);
                                    paramList.add(Integer.parseInt(param.toLowerCase().replace("(int)", "").trim()));
                                }
                            }
                            nb++;
                        }
                    } catch (Exception e) {
                        log.error("Could not parse the Cassandra load balancing policy! " + e.getMessage());
                    }
                }
            }
            if (nb > 0) {
                // Instantiate load balancing policy with parameters
                if (lbString.toLowerCase().contains("latencyawarepolicy")) {
                    //special sauce for the latency aware policy which uses a builder subclass to instantiate
                    LatencyAwarePolicy.Builder builder = LatencyAwarePolicy.builder((LoadBalancingPolicy) paramList.get(0));

                    builder.withExclusionThreshold((Double) paramList.get(1));
                    builder.withScale((Long) paramList.get(2), TimeUnit.MILLISECONDS);
                    builder.withRetryPeriod((Long) paramList.get(3), TimeUnit.MILLISECONDS);
                    builder.withUpdateRate((Long) paramList.get(4), TimeUnit.MILLISECONDS);
                    builder.withMininumMeasurements((Integer) paramList.get(5));

                    return builder.build();

                } else {
                    Class<?> clazz = Class.forName(lbString);
                    Constructor<?> constructor = clazz.getConstructor(primaryParametersClasses.toArray(new
                            Class[primaryParametersClasses.size()]));

                    return (LoadBalancingPolicy) constructor.newInstance(paramList.toArray(new Object[paramList.size
                            ()]));
                }
            } else {
                // Only one policy has been specified, with no parameter or child policy
                Class<?> clazz = Class.forName(lbString);
                policy = (LoadBalancingPolicy) clazz.newInstance();
                return policy;
            }
        } else {
            // Only one policy has been specified, with no parameter or child policy
            Class<?> clazz = Class.forName(lbString);
            policy = (LoadBalancingPolicy) clazz.newInstance();
            return policy;
        }
    }

    /**
     * Parse the RetryPolicy policy.
     */
    public RetryPolicy parseRetryPolicy(String retryPolicyString) throws InstantiationException,
            IllegalAccessException, ClassNotFoundException, NoSuchMethodException, SecurityException,
            IllegalArgumentException, InvocationTargetException, NoSuchFieldException {

        if (!retryPolicyString.contains(".")) {
            retryPolicyString = "com.datastax.driver.core.policies." + retryPolicyString;
            Class<?> clazz = Class.forName(retryPolicyString);
            Field field = clazz.getDeclaredField("INSTANCE");
            RetryPolicy policy = (RetryPolicy) field.get(null);
            return policy;
        }
        return null;
    }

    /**
     * Parse the reconnection policy.
     */
    public ReconnectionPolicy parseReconnectionPolicy(String reconnectionPolicyString) throws
            InstantiationException, IllegalAccessException, ClassNotFoundException, NoSuchMethodException,
            SecurityException, IllegalArgumentException, InvocationTargetException {
        String lb_regex = "([a-zA-Z]*Policy)(\\()(.*)(\\))";
        Pattern lb_pattern = Pattern.compile(lb_regex);
        Matcher lb_matcher = lb_pattern.matcher(reconnectionPolicyString);
        if (lb_matcher.matches()) {
            if (lb_matcher.groupCount() > 0) {
                // Primary LB policy has been specified
                String primaryReconnectionPolicy = lb_matcher.group(1);
                String reconnectionPolicyParams = lb_matcher.group(3);
                return getReconnectionPolicy(primaryReconnectionPolicy, reconnectionPolicyParams);
            }
        }
        return null;
    }

    /**
     * Get the reconnection policy.
     */
    public  ReconnectionPolicy getReconnectionPolicy(String rcString, String parameters) throws
            ClassNotFoundException, NoSuchMethodException, SecurityException, InstantiationException,
            IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        ReconnectionPolicy policy = null;
        //ReconnectionPolicy childPolicy = null;
        if (!rcString.contains(".")) {
            rcString = "com.datastax.driver.core.policies." + rcString;
        }

        if (parameters.length() > 0) {
            // Child policy or parameters have been specified
            String paramsRegex = "([^,]+\\(.+?\\))|([^,]+)";
            Pattern param_pattern = Pattern.compile(paramsRegex);
            Matcher lb_matcher = param_pattern.matcher(parameters);

            ArrayList<Object> paramList = Lists.newArrayList();
            ArrayList<Class> primaryParametersClasses = Lists.newArrayList();
            int nb = 0;
            while (lb_matcher.find()) {
                if (lb_matcher.groupCount() > 0) {
                    try {
                        if (lb_matcher.group().contains("(") && !lb_matcher.group().trim().startsWith("(")) {
                            // We are dealing with child policies here
                            primaryParametersClasses.add(LoadBalancingPolicy.class);
                            // Parse and add child policy to the parameter list
                            paramList.add(parseReconnectionPolicy(lb_matcher.group()));
                            nb++;
                        } else {
                            // We are dealing with parameters that are not policies here
                            String param = lb_matcher.group();
                            if (param.contains("'") || param.contains("\"")) {
                                primaryParametersClasses.add(String.class);
                                paramList.add(new String(param.trim().replace("'", "").replace("\"", "")));
                            } else if (param.contains(".") || param.toLowerCase().contains("(double)") || param
                                    .toLowerCase().contains("(float)")) {
                                // gotta allow using float or double
                                if (param.toLowerCase().contains("(double)")) {
                                    primaryParametersClasses.add(double.class);
                                    paramList.add(Double.parseDouble(param.replace("(double)", "").trim()));
                                } else {
                                    primaryParametersClasses.add(float.class);
                                    paramList.add(Float.parseFloat(param.replace("(float)", "").trim()));
                                }
                            } else {
                                if (param.toLowerCase().contains("(long)")) {
                                    primaryParametersClasses.add(long.class);
                                    paramList.add(Long.parseLong(param.toLowerCase().replace("(long)", "").trim()));
                                } else {
                                    primaryParametersClasses.add(int.class);
                                    paramList.add(Integer.parseInt(param.toLowerCase().replace("(int)", "").trim()));
                                }
                            }
                            nb++;
                        }
                    } catch (Exception e) {
                        log.error("Could not parse the Cassandra reconnection policy! " + e.getMessage());
                    }
                }
            }

            if (nb > 0) {
                // Instantiate load balancing policy with parameters
                Class<?> clazz = Class.forName(rcString);
                Constructor<?> constructor = clazz.getConstructor(primaryParametersClasses.toArray(new
                        Class[primaryParametersClasses.size()]));

                return (ReconnectionPolicy) constructor.newInstance(paramList.toArray(new Object[paramList.size()]));
            }
            // Only one policy has been specified, with no parameter or child policy
            Class<?> clazz = Class.forName(rcString);
            policy = (ReconnectionPolicy) clazz.newInstance();
            return policy;
        }
        Class<?> clazz = Class.forName(rcString);
        policy = (ReconnectionPolicy) clazz.newInstance();
        return policy;
    }

    public com.datastax.driver.core.Cluster createCluster() {
        com.datastax.driver.core.Cluster.Builder builder = com.datastax.driver.core.Cluster.builder()
                .withClusterName(env.getProperty(CASSANDRA_CLUSTER_NAME));
        if (env.getProperty(CASSANDRA_PORT) != null) {
            builder.withPort(Integer.parseInt(env.getProperty(CASSANDRA_PORT)));
        }

        String protocolVersion = env.getProperty(CASSANDRA_PROTOCOL_VERSION);
        if (V1.name().equals(protocolVersion)) {
            builder.withProtocolVersion(V1);
        } else if (V2.name().equals(protocolVersion)) {
            builder.withProtocolVersion(V2);
        } else if (V3.name().equals(protocolVersion)) {
            builder.withProtocolVersion(V3);
        }

        // Manage compression protocol
        if (SNAPPY.name().equals(env.getProperty(CASSANDRA_COMPRESSION))) {
            builder.withCompression(SNAPPY);
        } else if (LZ4.name().equals(env.getProperty(CASSANDRA_COMPRESSION))) {
            builder.withCompression(LZ4);
        } else {
            builder.withCompression(NONE);
        }

        // Manage the load balancing policy
        String loadBalancingPolicy = env.getProperty(CASSANDRA_LOAD_BALANCING_POLICY);
        if (!StringUtils.isEmpty(loadBalancingPolicy)) {
            try {
                builder.withLoadBalancingPolicy(parseLbPolicy(loadBalancingPolicy));
            } catch (ClassNotFoundException e) {
                log.warn("The load balancing policy could not be loaded, falling back to the default policy", e);
            } catch (InstantiationException e) {
                log.warn("The load balancing policy could not be instanced, falling back to the default policy", e);
            } catch (IllegalAccessException e) {
                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
            } catch (ClassCastException e) {
                log.warn("The load balancing policy does not implement the correct interface, falling back to the " +
                        "default policy", e);
            } catch (NoSuchMethodException e) {
                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
            } catch (SecurityException e) {
                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
            } catch (IllegalArgumentException e) {
                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
            } catch (InvocationTargetException e) {
                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
            }
        }

        // Manage query options
        QueryOptions queryOptions = new QueryOptions();
        if (env.getProperty(CASSANDRA_CONSISTENCY) != null) {
            ConsistencyLevel consistencyLevel = ConsistencyLevel.valueOf(env.getProperty(CASSANDRA_CONSISTENCY));
            queryOptions.setConsistencyLevel(consistencyLevel);
        }
        if (env.getProperty(CASSANDRA_SERIAL_CONSISTENCY) != null) {
            ConsistencyLevel serialConsistencyLevel = ConsistencyLevel.valueOf(env.getProperty(CASSANDRA_SERIAL_CONSISTENCY));
            queryOptions.setSerialConsistencyLevel(serialConsistencyLevel);
        }
        if (env.getProperty(CASSANDRA_FETCH_SIZE) != null) {
            queryOptions.setFetchSize(Integer.parseInt(env.getProperty(CASSANDRA_FETCH_SIZE)));
        }
        builder.withQueryOptions(queryOptions);

        // Manage the reconnection policy
        if (!StringUtils.isEmpty(env.getProperty(CASSANDRA_RECONNECTION_POLICY))) {
            try {
                builder.withReconnectionPolicy(parseReconnectionPolicy(env.getProperty(CASSANDRA_RECONNECTION_POLICY)));
            } catch (ClassNotFoundException e) {
                log.warn("The reconnection policy could not be loaded, falling back to the default policy", e);
            } catch (InstantiationException e) {
                log.warn("The reconnection policy could not be instanced, falling back to the default policy", e);
            } catch (IllegalAccessException e) {
                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
            } catch (ClassCastException e) {
                log.warn("The reconnection policy does not implement the correct interface, falling back to the " +
                        "default policy", e);
            } catch (NoSuchMethodException e) {
                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
            } catch (SecurityException e) {
                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
            } catch (IllegalArgumentException e) {
                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
            } catch (InvocationTargetException e) {
                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
            }
        }

        // Manage the retry policy
        if (!StringUtils.isEmpty(env.getProperty(CASSANDRA_RETRY_POLICY))) {
            try {
                builder.withRetryPolicy(parseRetryPolicy(env.getProperty(CASSANDRA_RETRY_POLICY)));
            } catch (ClassNotFoundException e) {
                log.warn("The retry policy could not be loaded, falling back to the default policy", e);
            } catch (InstantiationException e) {
                log.warn("The retry policy could not be instanced, falling back to the default policy", e);
            } catch (IllegalAccessException e) {
                log.warn("The retry policy could not be created, falling back to the default policy", e);
            } catch (ClassCastException e) {
                log.warn("The retry policy does not implement the correct interface, falling back to the default " +
                        "policy", e);
            } catch (NoSuchMethodException e) {
                log.warn("The retry policy could not be created, falling back to the default policy", e);
            } catch (SecurityException e) {
                log.warn("The retry policy could not be created, falling back to the default policy", e);
            } catch (IllegalArgumentException e) {
                log.warn("The retry policy could not be created, falling back to the default policy", e);
            } catch (InvocationTargetException e) {
                log.warn("The retry policy could not be created, falling back to the default policy", e);
            } catch (NoSuchFieldException e) {
                log.warn("The retry policy could not be created, falling back to the default policy", e);
            }
        }

        if (!StringUtils.isEmpty(env.getProperty(CASSANDRA_USER)) &&
                !StringUtils.isEmpty(env.getProperty(CASSANDRA_PASSWORD))) {
            builder.withCredentials(env.getProperty(CASSANDRA_USER), env.getProperty(CASSANDRA_PASSWORD));
        }

        // Manage socket options

        SocketOptions socketOptions = new SocketOptions();
        if (env.getProperty(CASSANDRA_CONNECT_TIMEOUT_MILLIS) != null) {
            socketOptions.setConnectTimeoutMillis(Integer.parseInt(env.getProperty(CASSANDRA_CONNECT_TIMEOUT_MILLIS)));
        }
        if (env.getProperty(CASSANDRA_READ_TIMEOUT_MILLIS) != null) {
            socketOptions.setReadTimeoutMillis(Integer.parseInt(env.getProperty(CASSANDRA_READ_TIMEOUT_MILLIS)));
        }
        builder.withSocketOptions(socketOptions);

        // Manage SSL
        if (Boolean.valueOf(env.getProperty(CASSANDRA_SSL_ENABLED))) {
            builder.withSSL();
        }

        // Manage the contact points
        builder.addContactPoints(StringUtils.commaDelimitedListToStringArray(env.getProperty(CASSANDRA_CONTACT_POINTS)));

        return builder.build();
    }

    @Bean
    public CassandraMappingContext cassandraMapping() throws ClassNotFoundException {
        BasicCassandraMappingContext bean = new BasicCassandraMappingContext();
        bean.setInitialEntitySet(CassandraEntityClassScanner.scan("fr.ippon.tatami"));
        bean.setBeanClassLoader(beanFactory.getClass().getClassLoader());
        return bean;
    }


    @Bean
    public CassandraConverter cassandraConverter() throws Exception {
        return new MappingCassandraConverter(cassandraMapping());
    }

    @Bean
    public CassandraSessionFactoryBean session() throws Exception {
        CassandraSessionFactoryBean session = new CassandraSessionFactoryBean();
        session.setCluster(createCluster());
        session.setConverter(cassandraConverter());
        session.setKeyspaceName(env.getProperty("cassandra.keyspace"));
        return session;

    }


}
