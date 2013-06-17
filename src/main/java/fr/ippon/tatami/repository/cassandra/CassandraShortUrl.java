package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.ShortUrl;
import fr.ippon.tatami.repository.ShortUrlRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.SHORT_URL_CF;

@Repository
public class CassandraShortUrl implements ShortUrlRepository {

    private final Log log = LogFactory.getLog(CassandraShortUrl.class);

    private ColumnFamilyTemplate<String, String> shortUrlTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        shortUrlTemplate = new ThriftColumnFamilyTemplate<String, String>(keyspaceOperator,
                SHORT_URL_CF,
                StringSerializer.get(),
                StringSerializer.get());

        shortUrlTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void createShortUrl(ShortUrl shortUrl) {
            Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
            mutator.insert(shortUrl.getShortUrl(), SHORT_URL_CF, HFactory.createColumn(shortUrl.getLongUrl(),
                    "", StringSerializer.get(), StringSerializer.get()));

    }

    @Override
    public ShortUrl findUrlFromKey(String key) {
        if(key == null){
            return null;
        }

        if (log.isDebugEnabled()) {
            log.debug("Finding from short url : " + key);
        }

        ShortUrl shortUrl = new ShortUrl();

        ColumnFamilyResult<String, String> result = shortUrlTemplate.queryColumns(key);

        for (String columnName : result.getColumnNames()) {
            shortUrl.setLongUrl(columnName.toString());
        }

        return shortUrl;
    }
}
