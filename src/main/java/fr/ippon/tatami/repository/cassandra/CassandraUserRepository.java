package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.config.ColumnFamilyKeys.USER_CF;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.OrderedRows;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.beans.Rows;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.query.QueryResult;
import me.prettyprint.hector.api.query.RangeSlicesQuery;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

/**
 * Cassandra implementation of the user repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserRepository implements UserRepository {

    private final Log log = LogFactory.getLog(CassandraUserRepository.class);
    
    private final StringSerializer stringSerializer = StringSerializer.get();
    
    @Inject
    private Keyspace keyspaceOperator;
    
    @Inject
    private EntityManager em;
    
    private static ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static Validator validator = factory.getValidator();

    @Override
    public void createUser(User user){
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
    public void updateUser(User user) {
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

	@Override
	public List<String> getSimilarUsers(String login) {

		RangeSlicesQuery<String, String, String> query = buildQueryForFindingSimilarLogins();
		
		QueryResult<OrderedRows<String, String, String>> result = query.execute();
		
		return buildResult(result, login);
	}

	private List<String> buildResult(QueryResult<OrderedRows<String, String, String>> result, String login) {
		
		List<String> logins = null;
		
		if(null!=result){
			Rows<String, String, String> orderedRows = result.get();
			if(null!=orderedRows && orderedRows.getCount()>0){
				String key = null;
				logins = new ArrayList<String>();
				for (Row<String, String, String> row : orderedRows) {
					key = row.getKey();
					if(key.startsWith(login)){
						log.debug("A possibility with key=" + key);
						logins.add(key);	
					}
				}
			}
		}
		
		return logins;
	}

	private RangeSlicesQuery<String, String, String> buildQueryForFindingSimilarLogins() {
		
		// TODO : Get a better request, after some searching hours nothing in order to do a sql query like with the keys
		// ie : SELECT key FROM User WHERE key LIKE 'login%'
		
		RangeSlicesQuery<String, String, String> query = 
				HFactory.createRangeSlicesQuery(keyspaceOperator, stringSerializer, stringSerializer, stringSerializer);
		
		query.setColumnFamily(USER_CF);
		query.setReturnKeysOnly();
		query.setKeys(null, null);
		
		return query;
	}
}
