package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.google.common.collect.Maps;
import com.sun.org.glassfish.gmbal.IncludeSubclass;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.repository.RegistrationRepository;
import fr.ippon.tatami.service.util.RandomUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.REGISTRATION_CF;

/**
 * Cassandra implementation of the Registration repository.
 * <p/>
 * Structure :
 * - Key = "registration_key"
 * - Name = key
 * - Value = login
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraRegistrationRepository implements RegistrationRepository {

    private static final Logger log = LoggerFactory.getLogger(CassandraRegistrationRepository.class);

    private final static String ROW_KEY = "registration_key";

    private final static int COLUMN_TTL = 60 * 60 * 24 * 2; // The column is stored for 2 days.

    @Inject
    private Session session;

    @Override
    public String generateRegistrationKey(String login) {
        String key = RandomUtil.generateRegistrationKey();
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.REGISTRATION_CF)
                .value(ROW_KEY, key)
                .value("login",login)
                .using(QueryBuilder.ttl(COLUMN_TTL));
        session.execute(statement);
        return key;
    }

    @Override
    public String getLoginByRegistrationKey(String registrationKey) {
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.REGISTRATION_CF)
                .where(eq(ROW_KEY, registrationKey));
        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            return results.one().getString("login");
        }
        return null;
    }

    /**
     * !! For testing purpose only !!
     * This method is not efficient and is limited to 10000 registrations.
     * Other limitation : if a login is associated to multiple registrationKey
     */
    public Map<String, String> _getAllRegistrationKeyByLogin() {
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.REGISTRATION_CF)
                .limit(10000);
        ResultSet results = session.execute(statement);
        Map<String, String> registrationKeyByLogin = new HashMap<>();
        for (Row row : results.all()) {
            registrationKeyByLogin.put(row.getString("login"),row.getString(ROW_KEY));
        }
        return registrationKeyByLogin;
    }
}
