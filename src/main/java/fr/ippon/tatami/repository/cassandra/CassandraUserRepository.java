package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.*;
import java.util.HashSet;
import java.util.Set;

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

    private static ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static Validator validator = factory.getValidator();

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void createUser(User user) {
        if (log.isDebugEnabled()) {
            log.debug("Creating user : " + user);
        }
        Set<ConstraintViolation<User>> constraintViolations = validator.validate(user);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(user);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void updateUser(User user) throws ConstraintViolationException, IllegalArgumentException {
        if (log.isDebugEnabled()) {
            log.debug("Updating user : " + user);
        }
        Set<ConstraintViolation<User>> constraintViolations = validator.validate(user);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(user);
    }

    @Override
    @Cacheable("user-cache")
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
