package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.*;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.validation.ContraintsUserCreation;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.validation.*;
import java.util.HashSet;
import java.util.Optional;
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
    private Session session;

    private Mapper<User> mapper;


    @Inject
    private CounterRepository counterRepository;

    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();

    private PreparedStatement findOneByLoginStmt;


    private PreparedStatement deleteByLoginStmt;



    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(User.class);
        findOneByLoginStmt = session.prepare(
                "SELECT * " +
                        "FROM user " +
                        "WHERE login = :login");
        deleteByLoginStmt = session.prepare("DELETE FROM user " +
                "WHERE login = :login");
    }


    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void createUser(User user) {
        log.debug("Creating user : {}", user);
        Set<ConstraintViolation<User>> constraintViolations = validator.validate(user, ContraintsUserCreation.class);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<>(constraintViolations));
        }
        BatchStatement batch = new BatchStatement();
        batch.add(mapper.saveQuery(user));
        session.execute(batch);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login", beforeInvocation = true)
    public void updateUser(User user) throws ConstraintViolationException, IllegalArgumentException {
        log.debug("Updating user : {}", user);
        Set<ConstraintViolation<User>> constraintViolations = validator.validate(user);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<>(constraintViolations));
        }
        BatchStatement batch = new BatchStatement();
        batch.add(mapper.saveQuery(user));
        session.execute(batch);

    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void deleteUser(User user) {
        log.debug("Deleting user : {}", user);
        BatchStatement batch = new BatchStatement();
        batch.add(mapper.deleteQuery(user));
        batch.add(deleteByLoginStmt.bind().setString("login", user.getLogin()));
        session.execute(batch);
    }

    @Override
    @Cacheable("user-cache")
    public User findUserByLogin(String login) {
        User user = null;
        BoundStatement stmt = findOneByLoginStmt.bind();
        stmt.setString("login", login);
        Optional<User> optionalUser = findOneFromIndex(stmt);
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            user.setStatusCount(counterRepository.getStatusCounter(login));
            user.setFollowersCount(counterRepository.getFollowersCounter(login));
            user.setFriendsCount(counterRepository.getFriendsCounter(login));
        }
        return user;
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void desactivateUser( User user ) {
        updateActivated(user,false);

    }

    private void updateActivated(User user, boolean activated) {
        Statement update = QueryBuilder.update("user")
                .with(QueryBuilder.set("activated", activated))
                .where((QueryBuilder.eq("login", user.getLogin())));
        session.execute(update);
    }

    @Override
    @CacheEvict(value = "user-cache", key = "#user.login")
    public void reactivateUser( User user ) {
        updateActivated(user,true);
    }

    private Optional<User> findOneFromIndex(BoundStatement stmt) {
        ResultSet rs = session.execute(stmt);
        if (rs.isExhausted()) {
            return Optional.empty();
        }
        return Optional.ofNullable(rs.one().getString("login"))
                .map(id -> Optional.ofNullable(mapper.get(id)))
                .get();
    }

}
