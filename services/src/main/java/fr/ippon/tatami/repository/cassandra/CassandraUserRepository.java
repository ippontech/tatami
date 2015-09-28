package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.validation.ContraintsUserCreation;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.UserRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hom.EntityManagerImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
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

    private final Logger log = LoggerFactory.getLogger(CassandraUserRepository.class);

    @Inject
    private EntityManagerImpl em;

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private CounterRepository counterRepository;

    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void createUser(User user) {

        log.debug("Creating user : {}", user);

        Set<ConstraintViolation<User>> constraintViolations = validator.validate(user, ContraintsUserCreation.class);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(user);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login", beforeInvocation = true)
    public void updateUser(User user) throws ConstraintViolationException, IllegalArgumentException {
        log.debug("Updating user : {}", user);
        Set<ConstraintViolation<User>> constraintViolations = validator.validate(user);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(user);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void deleteUser(User user) {
        log.debug("Deleting user : {}", user);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(user.getLogin(), ColumnFamilyKeys.USER_CF);
        mutator.execute();
    }

    @Override
    @Cacheable("user-cache")
    public User findUserByLogin(String login) {
        User user;
        try {
            user = em.find(User.class, login);
        } catch (Exception e) {
            log.debug("Exception while looking for user {} : {}", login, e.toString());
            return null;
        }
        if (user != null) {
            user.setStatusCount(counterRepository.getStatusCounter(login));
            user.setFollowersCount(counterRepository.getFollowersCounter(login));
            user.setFriendsCount(counterRepository.getFriendsCounter(login));
        }
        return user;
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void desactivateUser( User user ) {
        user.setActivated(false);
        em.persist(user);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void reactivateUser( User user ) {
        user.setActivated(true);
        em.persist(user);
    }
}
