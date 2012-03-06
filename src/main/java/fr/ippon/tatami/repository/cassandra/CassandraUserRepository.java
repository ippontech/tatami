package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
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
}
