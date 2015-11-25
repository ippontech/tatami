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

import javax.inject.Inject;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.datastax.driver.core.ProtocolOptions.*;
import static com.datastax.driver.core.ProtocolOptions.Compression.*;
import static com.datastax.driver.core.ProtocolVersion.*;

@Configuration
public class CassandraDataAutoConfiguration {

    private final Logger log = LoggerFactory.getLogger(CassandraConfiguration.class);

//    @Inject
//    BeanFactory beanFactory;
//
//    @Inject
//    private Environment env;
//
//
//    Cluster cluster;
//
//    @Bean
//    public Cluster cluster() {
//        this.cluster = createCluster();
//        return cluster;
//    }
//
//    /**
//     * Parse the load balancing policy.
//     */
//    public  LoadBalancingPolicy parseLbPolicy(String loadBalancingPolicyString) throws InstantiationException,
//            IllegalAccessException, ClassNotFoundException, NoSuchMethodException, SecurityException,
//            IllegalArgumentException, InvocationTargetException {
//        String lb_regex = "([a-zA-Z]*Policy)(\\()(.*)(\\))";
//        Pattern lb_pattern = Pattern.compile(lb_regex);
//        if (!loadBalancingPolicyString.contains("(")) {
//            loadBalancingPolicyString += "()";
//        }
//        Matcher lb_matcher = lb_pattern.matcher(loadBalancingPolicyString);
//
//        if (lb_matcher.matches()) {
//            if (lb_matcher.groupCount() > 0) {
//                // Primary LB policy has been specified
//                String primaryLoadBalancingPolicy = lb_matcher.group(1);
//                String loadBalancingPolicyParams = lb_matcher.group(3);
//                return getLbPolicy(primaryLoadBalancingPolicy, loadBalancingPolicyParams);
//            }
//        }
//        return null;
//    }
//
//    /**
//     * Get the load balancing policy.
//     */
//    public LoadBalancingPolicy getLbPolicy(String lbString, String parameters) throws ClassNotFoundException,
//            NoSuchMethodException, SecurityException, InstantiationException, IllegalAccessException,
//            IllegalArgumentException, InvocationTargetException {
//        LoadBalancingPolicy policy = null;
//        if (!lbString.contains(".")) {
//            lbString = "com.datastax.driver.core.policies." + lbString;
//        }
//
//        if (parameters.length() > 0) {
//            // Child policy or parameters have been specified
//            String paramsRegex = "([^,]+\\(.+?\\))|([^,]+)";
//            Pattern param_pattern = Pattern.compile(paramsRegex);
//            Matcher lb_matcher = param_pattern.matcher(parameters);
//
//            ArrayList<Object> paramList = Lists.newArrayList();
//            ArrayList<Class> primaryParametersClasses = Lists.newArrayList();
//            int nb = 0;
//            while (lb_matcher.find()) {
//                if (lb_matcher.groupCount() > 0) {
//                    try {
//                        if (lb_matcher.group().contains("(") && !lb_matcher.group().trim().startsWith("(")) {
//                            // We are dealing with child policies here
//                            primaryParametersClasses.add(LoadBalancingPolicy.class);
//                            // Parse and add child policy to the parameter list
//                            paramList.add(parseLbPolicy(lb_matcher.group()));
//                            nb++;
//                        } else {
//                            // We are dealing with parameters that are not policies here
//                            String param = lb_matcher.group();
//                            if (param.contains("'") || param.contains("\"")) {
//                                primaryParametersClasses.add(String.class);
//                                paramList.add(new String(param.trim().replace("'", "").replace("\"", "")));
//                            } else if (param.contains(".") || param.toLowerCase().contains("(double)") || param
//                                    .toLowerCase().contains("(float)")) {
//                                // gotta allow using float or double
//                                if (param.toLowerCase().contains("(double)")) {
//                                    primaryParametersClasses.add(double.class);
//                                    paramList.add(Double.parseDouble(param.replace("(double)", "").trim()));
//                                } else {
//                                    primaryParametersClasses.add(float.class);
//                                    paramList.add(Float.parseFloat(param.replace("(float)", "").trim()));
//                                }
//                            } else {
//                                if (param.toLowerCase().contains("(long)")) {
//                                    primaryParametersClasses.add(long.class);
//                                    paramList.add(Long.parseLong(param.toLowerCase().replace("(long)", "").trim()));
//                                } else {
//                                    primaryParametersClasses.add(int.class);
//                                    paramList.add(Integer.parseInt(param.toLowerCase().replace("(int)", "").trim()));
//                                }
//                            }
//                            nb++;
//                        }
//                    } catch (Exception e) {
//                        log.error("Could not parse the Cassandra load balancing policy! " + e.getMessage());
//                    }
//                }
//            }
//            if (nb > 0) {
//                // Instantiate load balancing policy with parameters
//                if (lbString.toLowerCase().contains("latencyawarepolicy")) {
//                    //special sauce for the latency aware policy which uses a builder subclass to instantiate
//                    LatencyAwarePolicy.Builder builder = LatencyAwarePolicy.builder((LoadBalancingPolicy) paramList.get(0));
//
//                    builder.withExclusionThreshold((Double) paramList.get(1));
//                    builder.withScale((Long) paramList.get(2), TimeUnit.MILLISECONDS);
//                    builder.withRetryPeriod((Long) paramList.get(3), TimeUnit.MILLISECONDS);
//                    builder.withUpdateRate((Long) paramList.get(4), TimeUnit.MILLISECONDS);
//                    builder.withMininumMeasurements((Integer) paramList.get(5));
//
//                    return builder.build();
//
//                } else {
//                    Class<?> clazz = Class.forName(lbString);
//                    Constructor<?> constructor = clazz.getConstructor(primaryParametersClasses.toArray(new
//                            Class[primaryParametersClasses.size()]));
//
//                    return (LoadBalancingPolicy) constructor.newInstance(paramList.toArray(new Object[paramList.size
//                            ()]));
//                }
//            } else {
//                // Only one policy has been specified, with no parameter or child policy
//                Class<?> clazz = Class.forName(lbString);
//                policy = (LoadBalancingPolicy) clazz.newInstance();
//                return policy;
//            }
//        } else {
//            // Only one policy has been specified, with no parameter or child policy
//            Class<?> clazz = Class.forName(lbString);
//            policy = (LoadBalancingPolicy) clazz.newInstance();
//            return policy;
//        }
//    }
//
//    /**
//     * Parse the RetryPolicy policy.
//     */
//    public  RetryPolicy parseRetryPolicy(String retryPolicyString) throws InstantiationException,
//            IllegalAccessException, ClassNotFoundException, NoSuchMethodException, SecurityException,
//            IllegalArgumentException, InvocationTargetException, NoSuchFieldException {
//
//        if (!retryPolicyString.contains(".")) {
//            retryPolicyString = "com.datastax.driver.core.policies." + retryPolicyString;
//            Class<?> clazz = Class.forName(retryPolicyString);
//            Field field = clazz.getDeclaredField("INSTANCE");
//            RetryPolicy policy = (RetryPolicy) field.get(null);
//            return policy;
//        }
//        return null;
//    }
//
//    /**
//     * Parse the reconnection policy.
//     */
//    public  ReconnectionPolicy parseReconnectionPolicy(String reconnectionPolicyString) throws
//            InstantiationException, IllegalAccessException, ClassNotFoundException, NoSuchMethodException,
//            SecurityException, IllegalArgumentException, InvocationTargetException {
//        String lb_regex = "([a-zA-Z]*Policy)(\\()(.*)(\\))";
//        Pattern lb_pattern = Pattern.compile(lb_regex);
//        Matcher lb_matcher = lb_pattern.matcher(reconnectionPolicyString);
//        if (lb_matcher.matches()) {
//            if (lb_matcher.groupCount() > 0) {
//                // Primary LB policy has been specified
//                String primaryReconnectionPolicy = lb_matcher.group(1);
//                String reconnectionPolicyParams = lb_matcher.group(3);
//                return getReconnectionPolicy(primaryReconnectionPolicy, reconnectionPolicyParams);
//            }
//        }
//        return null;
//    }
//
//    /**
//     * Get the reconnection policy.
//     */
//    public  ReconnectionPolicy getReconnectionPolicy(String rcString, String parameters) throws
//            ClassNotFoundException, NoSuchMethodException, SecurityException, InstantiationException,
//            IllegalAccessException, IllegalArgumentException, InvocationTargetException {
//        ReconnectionPolicy policy = null;
//        //ReconnectionPolicy childPolicy = null;
//        if (!rcString.contains(".")) {
//            rcString = "com.datastax.driver.core.policies." + rcString;
//        }
//
//        if (parameters.length() > 0) {
//            // Child policy or parameters have been specified
//            String paramsRegex = "([^,]+\\(.+?\\))|([^,]+)";
//            Pattern param_pattern = Pattern.compile(paramsRegex);
//            Matcher lb_matcher = param_pattern.matcher(parameters);
//
//            ArrayList<Object> paramList = Lists.newArrayList();
//            ArrayList<Class> primaryParametersClasses = Lists.newArrayList();
//            int nb = 0;
//            while (lb_matcher.find()) {
//                if (lb_matcher.groupCount() > 0) {
//                    try {
//                        if (lb_matcher.group().contains("(") && !lb_matcher.group().trim().startsWith("(")) {
//                            // We are dealing with child policies here
//                            primaryParametersClasses.add(LoadBalancingPolicy.class);
//                            // Parse and add child policy to the parameter list
//                            paramList.add(parseReconnectionPolicy(lb_matcher.group()));
//                            nb++;
//                        } else {
//                            // We are dealing with parameters that are not policies here
//                            String param = lb_matcher.group();
//                            if (param.contains("'") || param.contains("\"")) {
//                                primaryParametersClasses.add(String.class);
//                                paramList.add(new String(param.trim().replace("'", "").replace("\"", "")));
//                            } else if (param.contains(".") || param.toLowerCase().contains("(double)") || param
//                                    .toLowerCase().contains("(float)")) {
//                                // gotta allow using float or double
//                                if (param.toLowerCase().contains("(double)")) {
//                                    primaryParametersClasses.add(double.class);
//                                    paramList.add(Double.parseDouble(param.replace("(double)", "").trim()));
//                                } else {
//                                    primaryParametersClasses.add(float.class);
//                                    paramList.add(Float.parseFloat(param.replace("(float)", "").trim()));
//                                }
//                            } else {
//                                if (param.toLowerCase().contains("(long)")) {
//                                    primaryParametersClasses.add(long.class);
//                                    paramList.add(Long.parseLong(param.toLowerCase().replace("(long)", "").trim()));
//                                } else {
//                                    primaryParametersClasses.add(int.class);
//                                    paramList.add(Integer.parseInt(param.toLowerCase().replace("(int)", "").trim()));
//                                }
//                            }
//                            nb++;
//                        }
//                    } catch (Exception e) {
//                        log.error("Could not parse the Cassandra reconnection policy! " + e.getMessage());
//                    }
//                }
//            }
//
//            if (nb > 0) {
//                // Instantiate load balancing policy with parameters
//                Class<?> clazz = Class.forName(rcString);
//                Constructor<?> constructor = clazz.getConstructor(primaryParametersClasses.toArray(new
//                        Class[primaryParametersClasses.size()]));
//
//                return (ReconnectionPolicy) constructor.newInstance(paramList.toArray(new Object[paramList.size()]));
//            }
//            // Only one policy has been specified, with no parameter or child policy
//            Class<?> clazz = Class.forName(rcString);
//            policy = (ReconnectionPolicy) clazz.newInstance();
//            return policy;
//        }
//        Class<?> clazz = Class.forName(rcString);
//        policy = (ReconnectionPolicy) clazz.newInstance();
//        return policy;
//    }
//
//    public Cluster createCluster() {
//        Cluster.Builder builder = Cluster.builder()
//                .withClusterName(env.getProperty("cassandra.clusterName"))
//                .withPort(Integer.parseInt(env.getProperty("cassandra.port")));
//
//        String protocolVersion = env.getProperty("cassandra.protocolVersion");
//        if (V1.name().equals(protocolVersion)) {
//            builder.withProtocolVersion(V1);
//        } else if (V2.name().equals(protocolVersion)) {
//            builder.withProtocolVersion(V2);
//        } else if (V3.name().equals(protocolVersion)) {
//            builder.withProtocolVersion(V3);
//        }
//
//        // Manage compression protocol
//        if (SNAPPY.name().equals(env.getProperty("cassandra.compression"))) {
//            builder.withCompression(SNAPPY);
//        } else if (LZ4.name().equals(env.getProperty("cassandra.compression"))) {
//            builder.withCompression(LZ4);
//        } else {
//            builder.withCompression(NONE);
//        }
//
//        // Manage the load balancing policy
//        String loadBalancingPolicy = env.getProperty("cassandra.loadBalancingPolicy");
//        if (!StringUtils.isEmpty(loadBalancingPolicy)) {
//            try {
//                builder.withLoadBalancingPolicy(parseLbPolicy(loadBalancingPolicy));
//            } catch (ClassNotFoundException e) {
//                log.warn("The load balancing policy could not be loaded, falling back to the default policy", e);
//            } catch (InstantiationException e) {
//                log.warn("The load balancing policy could not be instanced, falling back to the default policy", e);
//            } catch (IllegalAccessException e) {
//                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
//            } catch (ClassCastException e) {
//                log.warn("The load balancing policy does not implement the correct interface, falling back to the " +
//                        "default policy", e);
//            } catch (NoSuchMethodException e) {
//                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
//            } catch (SecurityException e) {
//                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
//            } catch (IllegalArgumentException e) {
//                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
//            } catch (InvocationTargetException e) {
//                log.warn("The load balancing policy could not be created, falling back to the default policy", e);
//            }
//        }
//
//        // Manage query options
//        QueryOptions queryOptions = new QueryOptions();
//        if (env.getProperty("cassandra.consistency") != null) {
//            ConsistencyLevel consistencyLevel = ConsistencyLevel.valueOf(env.getProperty("cassandra.consistency"));
//            queryOptions.setConsistencyLevel(consistencyLevel);
//        }
//        if (env.getProperty("cassandra.serialConsistency") != null) {
//            ConsistencyLevel serialConsistencyLevel = ConsistencyLevel.valueOf(env.getProperty("cassandra.serialConsistency"));
//            queryOptions.setSerialConsistencyLevel(serialConsistencyLevel);
//        }
//        queryOptions.setFetchSize(Integer.parseInt(env.getProperty("cassandra.fetchSize")));
//        builder.withQueryOptions(queryOptions);
//
//        // Manage the reconnection policy
//        if (!StringUtils.isEmpty(env.getProperty("cassandra.reconnectionPolicy"))) {
//            try {
//                builder.withReconnectionPolicy(parseReconnectionPolicy(env.getProperty("cassandra.reconnectionPolicy")));
//            } catch (ClassNotFoundException e) {
//                log.warn("The reconnection policy could not be loaded, falling back to the default policy", e);
//            } catch (InstantiationException e) {
//                log.warn("The reconnection policy could not be instanced, falling back to the default policy", e);
//            } catch (IllegalAccessException e) {
//                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
//            } catch (ClassCastException e) {
//                log.warn("The reconnection policy does not implement the correct interface, falling back to the " +
//                        "default policy", e);
//            } catch (NoSuchMethodException e) {
//                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
//            } catch (SecurityException e) {
//                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
//            } catch (IllegalArgumentException e) {
//                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
//            } catch (InvocationTargetException e) {
//                log.warn("The reconnection policy could not be created, falling back to the default policy", e);
//            }
//        }
//
//        // Manage the retry policy
//        if (!StringUtils.isEmpty(env.getProperty("cassandra.retryPolicy"))) {
//            try {
//                builder.withRetryPolicy(parseRetryPolicy(env.getProperty("cassandra.retryPolicy")));
//            } catch (ClassNotFoundException e) {
//                log.warn("The retry policy could not be loaded, falling back to the default policy", e);
//            } catch (InstantiationException e) {
//                log.warn("The retry policy could not be instanced, falling back to the default policy", e);
//            } catch (IllegalAccessException e) {
//                log.warn("The retry policy could not be created, falling back to the default policy", e);
//            } catch (ClassCastException e) {
//                log.warn("The retry policy does not implement the correct interface, falling back to the default " +
//                        "policy", e);
//            } catch (NoSuchMethodException e) {
//                log.warn("The retry policy could not be created, falling back to the default policy", e);
//            } catch (SecurityException e) {
//                log.warn("The retry policy could not be created, falling back to the default policy", e);
//            } catch (IllegalArgumentException e) {
//                log.warn("The retry policy could not be created, falling back to the default policy", e);
//            } catch (InvocationTargetException e) {
//                log.warn("The retry policy could not be created, falling back to the default policy", e);
//            } catch (NoSuchFieldException e) {
//                log.warn("The retry policy could not be created, falling back to the default policy", e);
//            }
//        }
//
//        if (!StringUtils.isEmpty(env.getProperty("cassandra.user")) &&
//                !StringUtils.isEmpty(env.getProperty("cassandra.password"))) {
//            builder.withCredentials(env.getProperty("cassandra.user"), env.getProperty("cassandra.password"));
//        }
//
//        // Manage socket options
//        SocketOptions socketOptions = new SocketOptions();
//        socketOptions.setConnectTimeoutMillis(Integer.parseInt(env.getProperty("cassandra.connectTimeoutMillis")));
//        socketOptions.setReadTimeoutMillis(Integer.parseInt(env.getProperty("cassandra.readTimeoutMillis")));
//        builder.withSocketOptions(socketOptions);
//
//        // Manage SSL
//        if (Boolean.valueOf(env.getProperty("cassandra.sslEnabled"))) {
//            builder.withSSL();
//        }
//
//        // Manage the contact points
//        builder.addContactPoints(StringUtils.commaDelimitedListToStringArray(env.getProperty("cassandra.contactPoints")));
//
//        return builder.build();
//    }
//
//    @Bean
//    public CassandraSessionFactoryBean session() throws Exception {
//        CassandraSessionFactoryBean session = new CassandraSessionFactoryBean();
//        session.setCluster(this.cluster);
//        session.setConverter(cassandraConverter());
//        session.setKeyspaceName(env.getProperty("cassandra.keyspace"));
//        return session;
//    }
//
//    @Bean
//    public CassandraAdminOperations cassandraTemplate() throws Exception {
//        return new CassandraAdminTemplate(session().getObject(), cassandraConverter());
//    }
//
//    @Bean
//    public CassandraMappingContext cassandraMapping() throws ClassNotFoundException {
//        return new BasicCassandraMappingContext();
//    }
//
//    @Bean
//    public CassandraConverter cassandraConverter() throws Exception {
//        return new MappingCassandraConverter(cassandraMapping());
//    }
}
