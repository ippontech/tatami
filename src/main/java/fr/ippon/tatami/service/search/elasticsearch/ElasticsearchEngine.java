package fr.ippon.tatami.service.search.elasticsearch;

import org.elasticsearch.client.Client;

/**
 * Elasticsearch engine.
 */
public interface ElasticsearchEngine {

    /**
     * @return Elasticsearch client.
     */
    Client client();
}
