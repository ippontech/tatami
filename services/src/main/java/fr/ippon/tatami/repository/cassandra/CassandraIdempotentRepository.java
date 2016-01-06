package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import fr.ippon.tatami.repository.IdempotentRepository;

import javax.inject.Inject;
import java.text.CollationKey;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

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
    private Session session;

    @Override
    public boolean add(String key) {
        if (contains(key)) {
            log.debug("Duplicate message detected!");
            return false;
        } else {
            log.debug("Adding new message to the idempotent repository");
            Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.TATAMIBOT_DUPLICATE_CF)
                    .value(KEY, key)
                    .using(QueryBuilder.ttl(COLUMN_TTL));
            session.execute(statement);
            return true;
        }
    }

    @Override
    public boolean contains(String key) {

        log.debug("Test message duplication with key : {}", key);
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.TATAMIBOT_DUPLICATE_CF)
                .where(eq(KEY, key));

        ResultSet results = session.execute(statement);
        return !results.isExhausted();
    }

    @Override
    public boolean remove(String key) {
        Statement statement = QueryBuilder.delete().from(TATAMIBOT_DUPLICATE_CF)
                .where(eq(KEY, key));
        session.execute(statement);
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
