package fr.ippon.tatami.application;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import fr.ippon.tatami.service.IndexService;

/**
 * @author dmartin
 *
 */
@Configuration
public class ElasticSearchTestConfiguration {

    @Bean
    public IndexService indexService() {
        IndexService is = new IndexService();
        return is;
    }
}
