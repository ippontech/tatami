/**
 * 
 */
package fr.ippon.tatami.repository.cassandra;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.ShortURLRepository;

/**
 * @author dmartin
 *
 */
@Repository
public class CassandraShortURLRepository implements ShortURLRepository {

    private final Log log = LogFactory.getLog(CassandraShortURLRepository.class);

    private static final String LONG_URL = "url";

    @Inject
    private Keyspace keyspaceOperator;

    private ColumnFamilyTemplate<String, String> urlTemplate;

    @PostConstruct
    public void init() {
        this.urlTemplate = new ThriftColumnFamilyTemplate<String, String>(this.keyspaceOperator,
                ColumnFamilyKeys.URLS_CF,
                StringSerializer.get(),
                StringSerializer.get());

    }

    @Override
    public void addURLPair(String shortURL, String longURL) {
        Mutator<String> mutator = HFactory.createMutator(this.keyspaceOperator, StringSerializer.get());
        mutator.insert(shortURL, ColumnFamilyKeys.URLS_CF, HFactory.createColumn(LONG_URL, longURL, StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public String getURL(String shortURL) {
        ColumnFamilyResult<String, String> result = this.urlTemplate.queryColumns(shortURL);
        return result.getString(LONG_URL);
    }

    @Override
    public void deleteURLPair(String shortURL) {
        Mutator<String> mutator = HFactory.createMutator(this.keyspaceOperator, StringSerializer.get());
        mutator.delete(shortURL, ColumnFamilyKeys.URLS_CF, LONG_URL, StringSerializer.get());
    }

}
