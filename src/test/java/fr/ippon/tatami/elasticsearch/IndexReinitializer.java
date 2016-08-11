package fr.ippon.tatami.elasticsearch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import static java.lang.System.currentTimeMillis;

@Component
public class IndexReinitializer {

    private final Logger logger = LoggerFactory.getLogger(IndexReinitializer.class);

    @Inject
    private ElasticsearchTemplate elasticsearchTemplate;

    @PostConstruct
    public void resetIndex() {
        long t = currentTimeMillis();
        elasticsearchTemplate.deleteIndex("_all");
        t = currentTimeMillis() - t;
        logger.debug("ElasticSearch indexes reset in {} ms", t);
    }
}
