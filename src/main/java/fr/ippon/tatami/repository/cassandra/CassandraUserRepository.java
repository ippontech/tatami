package fr.ippon.tatami.repository.cassandra;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import lombok.extern.apachecommons.CommonsLog;

import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;

/**
 * Cassandra implementation of the user repository.
 * 
 * @author Julien Dubois
 */
@Repository
@CommonsLog
public class CassandraUserRepository implements UserRepository {

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
        if (log.isDebugEnabled()) {
            log.debug("Updating user : " + user);
        }
        em.persist(user);
    }

    @Override
    public User findUserByLogin(String login) {
        try {
            return em.find(User.class, login);
        } catch (Exception e) {
            if (log.isDebugEnabled()) {
                log.debug("Exception while looking for user " + login + " : " + e.getMessage());
            }
            return null;
        }
    }
}
