package fr.ippon.tatami.repository.cassandra;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import fr.ippon.tatami.repository.IdempotentRepository;

import javax.inject.Inject;

/**
 * Used to de-deplucate Camel messages.
 */
@Component
public class CassandraIdempotentRepository implements IdempotentRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraIdempotentRepository.class);

    private final static String KEY = "Default";

    private final static String TATAMIBOT_DUPLICATE_CF = "TatamiBotDuplicate";

    private final static int COLUMN_TTL = 60 * 60 * 24 * 30; // The column is stored for 30 days.

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public boolean add(String key) {
        if (contains(key)) {
            log.debug("Duplicate message detected!");
            return false;
        } else {
            log.debug("Adding new message to the idempotent repository");
            HColumn<String, String> column =
                    HFactory.createColumn(
                            key,
                            "",
                            COLUMN_TTL,
                            StringSerializer.get(),
                            StringSerializer.get());

            Mutator<String> mutator =
                    HFactory.createMutator(keyspaceOperator, StringSerializer.get());

            mutator.insert(KEY, TATAMIBOT_DUPLICATE_CF, column);
            return true;
        }
    }

    @Override
    public boolean contains(String key) {

        log.debug("Test message duplication with key : {}", key);
        ColumnQuery<String, String, String> query = HFactory.createStringColumnQuery(keyspaceOperator);

        HColumn<String, String> column =
                query.setColumnFamily(TATAMIBOT_DUPLICATE_CF)
                        .setKey(KEY)
                        .setName(key)
                        .execute()
                        .get();

        return column != null;
    }

    @Override
    public boolean remove(String key) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(KEY, TATAMIBOT_DUPLICATE_CF, key, StringSerializer.get());
        return true;
    }

    @Override
    public boolean confirm(String key) {
        return true; // noop
    }

    @Override
    public void start() throws Exception {
    }

    @Override
    public void stop() throws Exception {
    }
}
