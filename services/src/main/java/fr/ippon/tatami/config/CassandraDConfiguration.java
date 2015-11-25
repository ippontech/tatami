package fr.ippon.tatami.config;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;

import javax.annotation.PreDestroy;
import javax.inject.Inject;

/**
 * Cassandra configuration file.
 *
 * @author Lars Nørregaard
 */
@Configuration
@PropertySource(value = { "classpath:cassandra.properties" })
public class CassandraDConfiguration {

    private static final Logger LOG = LoggerFactory.getLogger(CassandraDConfiguration.class);

    @Autowired
    private Environment env;




}
