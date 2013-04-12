package fr.ippon.tatami.service.search.elasticsearch;

import org.elasticsearch.client.Client;
import org.elasticsearch.node.Node;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.Closeable;

/**
 * Elasticsearch engine.
 */
public interface ElasticsearchEngine {

    /**
     * @return Elasticsearch client.
     */
    Client client();
}
