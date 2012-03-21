package fr.ippon.tatami.repository.cassandra;

import java.util.Set;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;

/**
 * Cassandra implementation of the user repository.
 * 
 * @author Julien Dubois
 */
@Repository
@Slf4j
public class CassandraUserRepository implements UserRepository {

    @Inject
    private EntityManager em;

    @Inject
    private Validator validator;

    @Override
    public void createUser(User user) {
        log.debug("Creating user : {}", user);
        checkUser(user);
        em.persist(user);
    }

    @Override
    public void updateUser(User user) {
        log.debug("Updating user : {}", user);
        checkUser(user);
        em.persist(user);
    }

    @Override
    public User findUserByLogin(String login) {
        try {
            return em.find(User.class, login);
        } catch (Exception e) {
            log.debug("Exception while looking for user {} : {}", login, e.getMessage());
            return null;
        }
    }

    private void checkUser(User user) {
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new RuntimeException("Found " + violations.size() + " violations while validating " + user);
        }
    }
}
