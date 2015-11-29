package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.DigestType;
import fr.ippon.tatami.repository.MailDigestRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;


/**
 * MailDigestRepository implementation for cassandra
 * <p/>
 * Structure :
 * - Key = digestType_[day]_domain
 * - Name = login
 * - Value = time
 * <p/>
 * Note : in the key, the [day] part is only used for weekly digest and
 * represents the day the user subscribed to the digest.
 *
 * @author Pierre Rust
 */
@Repository
public class CassandraMailDigestRepository implements MailDigestRepository {

    @Inject
    private Session session;

    @Override
    public void subscribeToDigest(DigestType digestType, String login, String domain, String day) {
        Calendar cal = Calendar.getInstance();
        Statement statement = QueryBuilder.insertInto("mailDigest")
                .value("digestId", buildKey(digestType, domain, day))
                .value("login", login)
                .value("created", cal.getTimeInMillis());
        session.execute(statement);
    }

    @Override
    public void unsubscribeFromDigest(DigestType digestType, String login, String domain, String day) {
        Statement statement = QueryBuilder.delete()
                .from("mailDigest")
                .where(eq("digestId",buildKey(digestType, domain, day)))
                .and(eq("login",login));
        session.execute(statement);
    }

    @Override
    public List<String> getLoginsRegisteredToDigest(DigestType digestType, String domain,
                                                    String day, int pagination) {
        int maxColumns = pagination + Constants.PAGINATION_SIZE;
        Statement statement = QueryBuilder.select()
                .column("login")
                .from("mailDigest")
                .where(eq("digestId", buildKey(digestType, domain, day)))
                .limit(maxColumns+1);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .skip(pagination)
                .map(e -> e.getString("login"))
                .collect(Collectors.toList());
    }

    /**
     * @return the row key
     */
    private String buildKey(DigestType digestType, String domain, String day) {
        String key;
        if (DigestType.WEEKLY_DIGEST == digestType) {
            key = digestType.toString() + "_" + day + "_" + domain;
        } else {
            key = digestType + "_" + domain;
        }
        return key;
    }

}
