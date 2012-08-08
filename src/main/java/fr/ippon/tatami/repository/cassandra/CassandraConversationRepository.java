package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.ConversationRepository;
import me.prettyprint.hector.api.Keyspace;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;

/**
 * Cassandra implementation of the conversation repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraConversationRepository implements ConversationRepository {

    private final Log log = LogFactory.getLog(CassandraConversationRepository.class);

    @Inject
    private Keyspace keyspaceOperator;


    @Override
    public void addStatusToConversation(String conversationId, String statusId) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public Collection<String> getStatusIdsInConversation(String conversationId) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
