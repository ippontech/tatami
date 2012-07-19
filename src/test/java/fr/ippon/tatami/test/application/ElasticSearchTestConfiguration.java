package fr.ippon.tatami.test.application;

import fr.ippon.tatami.service.IndexService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author dmartin
 */
@Configuration
public class ElasticSearchTestConfiguration {

    @Bean
    public IndexService indexService() {
        IndexService is = new IndexService();
        return is;
    }
}
