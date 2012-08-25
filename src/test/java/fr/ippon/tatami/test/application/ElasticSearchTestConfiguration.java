package fr.ippon.tatami.test.application;

import fr.ippon.tatami.service.elasticsearch.ElasticsearchSearchService;
import fr.ippon.tatami.service.SearchService;
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
