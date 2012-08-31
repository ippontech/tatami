package fr.ippon.tatami.test.application;

import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.search.elasticsearch.ElasticsearchSearchService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author dmartin
 */
@Configuration
public class ElasticSearchTestConfiguration {

    @Bean
    public SearchService searchService() {
        SearchService is = new ElasticsearchSearchService();
        return is;
    }
}
