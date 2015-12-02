package fr.ippon.tatami.config;

import com.datastax.driver.core.*;
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
    }





    @Inject
    BeanFactory beanFactory;



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
        com.datastax.driver.core.Cluster cluster = builder.build();

        try {
            validateKeyspace(cluster);
        } catch (Exception e) {
            log.error("Could not validate keyspace",e);
        }

        return cluster;
    }

    private void validateKeyspace(Cluster cluster) throws Exception {
        Session session = cluster.newSession();
        String keyspace = env.getProperty("cassandra.keyspace");
        ResultSet results = session.execute("SELECT * FROM system.schema_keyspaces " +
                "WHERE keyspace_name = '"+keyspace+"';");
        if (results.isExhausted()) {
            session.execute("CREATE KEYSPACE IF NOT EXISTS "+keyspace+" WITH replication " +
                    "= {'class':'SimpleStrategy', 'replication_factor':3};");
            createTables(session, keyspace);
            session.close();
        }

    }

    private void createTables(Session session, String keyspace) {
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".user (\n" +
                "    login varchar,\n" +
                "    password varchar,\n" +
                "    username varchar,\n" +
                "    firstname varchar,\n" +
                "    lastname varchar,\n" +
                "    domain varchar,\n" +
                "    activated boolean,\n" +
                "    avatar varchar,\n" +
                "    jobTitle varchar,\n" +
                "    activation_key varchar,\n" +
                "    reset_key varchar,\n" +
                "    phoneNumber varchar,\n" +
                "    openIdUrl varchar,\n" +
                "    preferences_mention_email boolean,\n" +
                "    rssUid varchar,\n" +
                "    weekly_digest_subscription boolean,\n" +
                "    daily_digest_subscription boolean,\n" +
                "    attachmentsSize bigint,\n" +
                "    PRIMARY KEY(login)\n" +
                ");");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".status (\n" +
                "    statusId timeuuid,\n" +
                "    type varchar,\n" +
                "    login varchar,\n" +
                "    username varchar,\n" +
                "    domain varchar,\n" +
                "    statusDate timestamp,\n" +
                "    geoLocalization varchar,\n" +
                "    removed boolean,\n" +
                "    groupId varchar,\n" +
                "    statusPrivate boolean,\n" +
                "    hasAttachments boolean,\n" +
                "    content varchar,\n" +
                "    discussionId varchar,\n" +
                "    replyTo varchar,\n" +
                "    replyToUsername varchar,\n" +
                "    detailsAvailable boolean,\n" +
                "    originalStatusId timeuuid,\n" +
                "    followerLogin varchar,\n" +
                "    PRIMARY KEY(statusId)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".timeline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key,status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".domain (\n" +
                "    domainId varchar,\n" +
                "    login varchar,\n" +
                "    created timeuuid,\n" +
                "    PRIMARY KEY(domainId, login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".counter (\n" +
                "    login varchar,\n" +
                "    STATUS_COUNTER counter,\n" +
                "    FOLLOWERS_COUNTER counter,\n" +
                "    FRIENDS_COUNTER counter,\n" +
                "    PRIMARY KEY(login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".friends (\n" +
                "    login varchar,\n" +
                "    friendLogin varchar,\n" +
                "    PRIMARY KEY(login,friendLogin)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".followers (\n" +
                "    key varchar,\n" +
                "    login varchar,\n" +
                "    PRIMARY KEY(key,login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".dayline (\n" +
                "    domainDay varchar,\n" +
                "    username varchar,\n" +
                "    statusCount counter,\n" +
                "    PRIMARY KEY(domainDay, username)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".tagline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key, status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".userline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key, status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".shares (\n" +
                "    status timeuuid,\n" +
                "    login varchar,\n" +
                "    PRIMARY KEY(status, login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".tagFollowers (\n" +
                "    key varchar,\n" +
                "    login varchar,\n" +
                "    PRIMARY KEY(key, login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".favline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key, status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".domainline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key, status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".mentionline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key, status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".groupline (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key, status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".group (\n" +
                "    id timeuuid,\n" +
                "    domain varchar,\n" +
                "    name varchar,\n" +
                "    description varchar,\n" +
                "    publicGroup boolean,\n" +
                "    archivedGroup boolean,\n" +
                "    PRIMARY KEY(id, domain)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".userGroup (\n" +
                "    login varchar,\n" +
                "    groupId timeuuid,\n" +
                "    role varchar,\n" +
                "    PRIMARY KEY(login, groupId)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".groupMember (\n" +
                "    groupId timeuuid,\n" +
                "    login varchar,\n" +
                "    role varchar,\n" +
                "    PRIMARY KEY(groupId, login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".userTags (\n" +
                "    login varchar,\n" +
                "    friendLogin varchar,\n" +
                "    time timestamp,\n" +
                "    PRIMARY KEY(login, friendLogin)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".trends (\n" +
                "    domain varchar,\n" +
                "    id timeuuid,\n" +
                "    tag varchar,\n" +
                "    PRIMARY KEY(domain, id)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".userTrends (\n" +
                "    login varchar,\n" +
                "    id timeuuid,\n" +
                "    tag varchar,\n" +
                "    PRIMARY KEY(login, id)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".avatar (\n" +
                "    id timeuuid,\n" +
                "    filename varchar,\n" +
                "    content blob,\n" +
                "    size bigint,\n" +
                "    creation_date timestamp,\n" +
                "    PRIMARY KEY(id)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".mailDigest (\n" +
                "    digestId varchar,\n" +
                "    login varchar,\n" +
                "    created timestamp,\n" +
                "    PRIMARY KEY(digestId,login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".timelineShares (\n" +
                "    key varchar,\n" +
                "    status timeuuid,\n" +
                "    PRIMARY KEY(key,status)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".appleDevice (\n" +
                "    login varchar,\n" +
                "    deviceId varchar,\n" +
                "    PRIMARY KEY(login,deviceId)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".appleDeviceUser (\n" +
                "    deviceId varchar,\n" +
                "    login varchar,\n" +
                "    PRIMARY KEY(deviceId,login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".attachment (\n" +
                "    id timeuuid,\n" +
                "    filename varchar,\n" +
                "    content blob,\n" +
                "    thumbnail blob,\n" +
                "    size bigint,\n" +
                "    creation_date timestamp,\n" +
                "    PRIMARY KEY(id,filename)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".groupCounter (\n" +
                "    domain varchar,\n" +
                "    groupId timeuuid,\n" +
                "    counter counter,\n" +
                "    PRIMARY KEY(domain,groupId)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".TatamiBotDuplicate (\n" +
                "    Default varchar,\n" +
                "    PRIMARY KEY(Default)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".Registration (\n" +
                "    registration_key varchar,\n" +
                "    login varchar,\n" +
                "    PRIMARY KEY(registration_key,login)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".rss (\n" +
                "    rss_uid varchar,\n" +
                "    login varchar,\n" +
                "    PRIMARY KEY(rss_uid)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".statusAttachments (\n" +
                "    statusId timeuuid,\n" +
                "    attachmentId timeuuid,\n" +
                "    created timestamp,\n" +
                "    PRIMARY KEY(statusId,attachmentId)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".tagCounter (\n" +
                "    key varchar,\n" +
                "    TAG_COUNTER counter,\n" +
                "    PRIMARY KEY(key)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".userAttachments (\n" +
                "    login varchar,\n" +
                "    attachmentId timeuuid,\n" +
                "    PRIMARY KEY(login,attachmentId)\n" +
                ");\n");
        session.execute("CREATE TABLE IF NOT EXISTS "+keyspace+".domainConfiguration (\n" +
                "    domain varchar,\n" +
                "    subscriptionLevel varchar,\n" +
                "    storageSize varchar,\n" +
                "    adminLogin varchar,\n" +
                "    PRIMARY KEY(domain)\n" +
                ");\n");
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
