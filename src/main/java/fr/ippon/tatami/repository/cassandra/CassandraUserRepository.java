package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import me.prettyprint.cassandra.model.IndexedSlicesQuery;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.OrderedRows;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.query.QueryResult;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.persistence.EntityManager;

/**
 * Cassandra implementation of the user repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserRepository implements UserRepository {

    private final Log log = LogFactory.getLog(CassandraUserRepository.class);

    @Inject
    private EntityManager em;

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void createUser(User user) {
        if (log.isDebugEnabled()) {
            log.debug("Creating user : " + user);
        }
        em.persist(user);
    }

    @Override
    public void updateUser(User user) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void deleteUser(String email) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public User findUserByEmail(String email) {
        try {
            return em.find(User.class, email);
        } catch (Exception e) {
            if (log.isDebugEnabled()) {
                log.debug("Exception while looking for user " + email + " : " + e.getMessage());
            }
            return null;
        }
    }

    @Override
    public User findUserByOpenIdToken(String openIdToken) {
        StringSerializer ss = StringSerializer.get();
        IndexedSlicesQuery<String, String, String> indexedSlicesQuery = HFactory
                .createIndexedSlicesQuery(keyspaceOperator, ss, ss, ss);

        indexedSlicesQuery.setColumnNames("email", "firstName", "lastName", "openIdToken");
        indexedSlicesQuery.addEqualsExpression("openIdToken", openIdToken);
        indexedSlicesQuery.setColumnFamily("User");
        indexedSlicesQuery.setStartKey("");
        QueryResult<OrderedRows<String, String, String>> result = indexedSlicesQuery.execute();
        User user = new User();
        for (Row row : result.get().getList()) {

        }
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
