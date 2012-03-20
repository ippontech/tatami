package fr.ippon.tatami.application;

import static fr.ippon.tatami.application.KeyspaceBuilder.newKeyspace;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;

import lombok.extern.slf4j.Slf4j;
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
        return newKeyspace() //
                .host(cassandraHost) //
                .clusterName(cassandraClusterName) //
                .keyspaceName(cassandraKeyspace) //
                .build();
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
