package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.DiscussionRepository;
import me.prettyprint.hector.api.Keyspace;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;

/**
 * Cassandra implementation of the discussion repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraDiscussionRepository implements DiscussionRepository {

    private final Log log = LogFactory.getLog(CassandraDiscussionRepository.class);

    @Inject
    private Keyspace keyspaceOperator;


    @Override
    public void addStatusToDiscussion(String discussionId, String statusId) {
        //TODO
    }

    @Override
    public Collection<String> getStatusIdsInDiscussion(String discussionId) {
        return null;  //TODO
    }
}
