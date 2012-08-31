package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.config.ColumnFamilyKeys.STATUS_CF;
import static fr.ippon.tatami.repository.cassandra.util.CassandraConstants.COLUMN_TAG_PREFIX;
import static fr.ippon.tatami.repository.cassandra.util.CassandraConstants.TAG_COLUMN_MAX_NAME;
import static fr.ippon.tatami.repository.cassandra.util.CassandraConstants.TAG_COLUMN_MIN_NAME;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.QueryResult;
import me.prettyprint.hector.api.query.SliceQuery;
import me.prettyprint.hom.EntityManagerImpl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.StatusRepository;

/**
 * Cassandra implementation of the status repository.
 * <p/>
 * Timeline and Userline have the same structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraStatusRepository implements StatusRepository {

    private final Log log = LogFactory.getLog(CassandraStatusRepository.class);

    @Inject
    private EntityManagerImpl em;
    
    @Inject
    private Keyspace keyspaceOperator;

    private static ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static Validator validator = factory.getValidator();

    @Override
    public Status createStatus(String login,
                               String username,
                               String domain,
                               String content,
                               String replyTo,
                               String replyToUsername,
                               List<String> tags)
            throws ConstraintViolationException {

        Status status = new Status();
        String statusId = TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString();
		status.setStatusId(statusId);
        status.setLogin(login);
        status.setUsername(username);
        status.setDomain(domain);
        status.setContent(content);
        status.setStatusDate(Calendar.getInstance().getTime());
        status.setReplyTo(replyTo);
        status.setReplyToUsername(replyToUsername);
        status.setRemoved(false);
        status.setTags(tags);
        if (log.isDebugEnabled()) {
            log.debug("Persisting Status : " + status);
        }
        Set<ConstraintViolation<Status>> constraintViolations = validator.validate(status);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(status);
        
        // Persist tags
        addTags(keyspaceOperator, STATUS_CF, statusId, tags);
        
        return status;
    }

    @Override
    @Cacheable("status-cache")
    public Status findStatusById(String statusId) {
        if (statusId == null || statusId.equals("")) {
            return null;
        }
        if (log.isDebugEnabled()) {
            log.debug("Finding status : " + statusId);
        }
        Status status = em.find(Status.class, statusId);
        
        if (status != null) {
	        // Find status's tags
        	List<String> tags = getTags(keyspaceOperator, STATUS_CF, statusId, TAG_COLUMN_MIN_NAME, TAG_COLUMN_MAX_NAME);
        	
	        status.setTags(tags);
	        
	        status = Boolean.TRUE.equals(status.getRemoved()) ? null : status;
        }

        return status;
    }

	@Override
    @CacheEvict(value = "status-cache", key = "#status.statusId")
    public void removeStatus(Status status) {
        status.setRemoved(true);
        if (log.isDebugEnabled()) {
            log.debug("Updating Status : " + status);
        }
        em.persist(status);
    }
	
	/**
	 * Check if the tags exists and add them if they don't exist.
	 * 
	 * @param keyspaceOperator
	 * @param columnfamily
	 * @param columnfamilyId
	 * @param tags
	 * @return
	 */
	private int addTags(Keyspace keyspaceOperator, String columnfamily, String columnfamilyId, List<String> tags) {
		
		// Get current user tags
		List<String> currentTags = getTags(keyspaceOperator, columnfamily, columnfamilyId, TAG_COLUMN_MIN_NAME, TAG_COLUMN_MAX_NAME);

		// Get the number of tags of the user
		int nbColumns = currentTags.size();
		int nbAddedTags = 0;
		
		Mutator<String> mutator = HFactory.createMutator(keyspaceOperator,
				StringSerializer.get());
		
		for (String tag : tags) {
			String tagLowerCase = tag.toLowerCase();

			// Check if the tag already exists
			if (currentTags.contains(tagLowerCase)) {
				// This tag already exists => we don't add it!
				continue;
			}

			// Add the new tag
			nbColumns++;
			String columnName = COLUMN_TAG_PREFIX + nbColumns;
			
			mutator.insert(columnfamilyId, columnfamily, HFactory.createColumn(columnName,
					tagLowerCase, StringSerializer.get(),
					StringSerializer.get()));
			nbAddedTags++;
		}
		
		return nbAddedTags;

	}
	
	private List<String> getTags(Keyspace keyspaceOperator, String columnfamily, String cfId, String startRange, String endRange) {
		SliceQuery<String, String, String> query = HFactory
				.createSliceQuery(keyspaceOperator, StringSerializer.get(),
						StringSerializer.get(), StringSerializer.get())
				.setColumnFamily(columnfamily)
				.setKey(cfId)
				.setRange(TAG_COLUMN_MIN_NAME, TAG_COLUMN_MAX_NAME, false,
						Integer.MAX_VALUE);

		QueryResult<ColumnSlice<String, String>> queryResult = query.execute();

		ColumnSlice<String, String> columnSlice = queryResult.get();
		
		SortedSet<String> tags = new TreeSet<String>();
		for (HColumn<String, String> hColumn : columnSlice.getColumns()) {
			tags.add(hColumn.getValue());
		}

		return new ArrayList<String>(tags);
	}
}
