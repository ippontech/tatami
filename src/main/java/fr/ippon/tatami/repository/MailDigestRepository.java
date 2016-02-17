package fr.ippon.tatami.repository;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.DigestType;
import fr.ippon.tatami.domain.User;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Revision of Cassandra implementation of the MailDigestRepository for CCM (Cassandra Cluster Manager).
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
 * @author Derek Zuk
 */
@Repository
public class MailDigestRepository {

    @Inject
    private Session session;

    private Mapper<User> mapper;

    private PreparedStatement subscribeToDigest;

    private PreparedStatement unsubscribeFromDigest;

    private PreparedStatement getLoginsRegisteredToDigest;


    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(User.class);

        subscribeToDigest = session.prepare(
            "INSERT INTO mail_digest (digest_id, login, created) " +
                "VALUES (:digest_id, :login, :created)");

        unsubscribeFromDigest = session.prepare(
            "DELETE FROM mail_digest " +
                "WHERE digest_id = :digest_id " +
                "AND login = :login");

        getLoginsRegisteredToDigest = session.prepare(
            "SELECT login FROM mail_digest " +
                "WHERE digest_id = :digest_id " +
                "LIMIT :pageLimit");
    }

    public void subscribeToDigest(DigestType digestType, String login, String domain, String day) {
        BoundStatement stmt = subscribeToDigest.bind();
        Calendar cal = Calendar.getInstance();
        Timestamp timestamp = new Timestamp(cal.getTimeInMillis());
        stmt.setString("digest_id", buildKey(digestType, domain, day));
        stmt.setString("login", login);
        stmt.setDate("created", timestamp);
        session.execute(stmt);
    }

    public void unsubscribeFromDigest(DigestType digestType, String login, String domain, String day) {
        BoundStatement stmt = unsubscribeFromDigest.bind();
        stmt.setString("digest_id", buildKey(digestType, domain, day));
        stmt.setString("login", login);
        session.execute(stmt);
    }

    public List<String> getLoginsRegisteredToDigest(DigestType digestType, String domain,
                                                    String day, int pagination) {
        int maxColumns = pagination + Constants.PAGINATION_SIZE;
        BoundStatement stmt = getLoginsRegisteredToDigest.bind();
        stmt.setString("digest_id", buildKey(digestType, domain, day));
        stmt.setInt("pageLimit", maxColumns+1);

        ResultSet results = session.execute(stmt);
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
