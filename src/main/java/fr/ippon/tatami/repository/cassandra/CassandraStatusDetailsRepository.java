package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.StatusDetails;
import fr.ippon.tatami.repository.StatusDetailsRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Collection;
import java.util.LinkedHashSet;

import static fr.ippon.tatami.config.ColumnFamilyKeys.STATUS_DETAILS_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the StatusDetails repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraStatusDetailsRepository implements StatusDetailsRepository {

    private final Log log = LogFactory.getLog(CassandraStatusDetailsRepository.class);

    private static final String DISCUSSION_PREFIX = "discussion-";

    private static final String SHARED_PREFIX = "shared-";

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addDiscussionStatusId(String statusId, String replyStatusId) {
        addInformation(statusId, replyStatusId, DISCUSSION_PREFIX);
    }

    @Override
    public void addSharedByLogin(String statusId, String sharedByLogin) {
        addInformation(statusId, sharedByLogin, SHARED_PREFIX);
    }

    private void addInformation(String statusId, String information, String prefix) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(statusId, STATUS_DETAILS_CF,
                HFactory.createColumn(
                        prefix + Calendar.getInstance().getTimeInMillis(),
                        information,
                        StringSerializer.get(),
                        StringSerializer.get()));
    }

    @Override
    public StatusDetails findStatusDetails(String statusId) {
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(STATUS_DETAILS_CF)
                .setKey(statusId)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        // LinkedHashSet are used instead of ArrayList, as there might be duplicate entries
        Collection<String> discussionStatusIds = new LinkedHashSet<String>();
        Collection<String> sharedByLogins = new LinkedHashSet<String>();
        Collection<String> favoritedByLogins = new LinkedHashSet<String>();
        for (HColumn<String, String> column : result.getColumns()) {
            String name = column.getName();
            String value = column.getValue();
            if (name.startsWith(SHARED_PREFIX)) {
                sharedByLogins.add(value);
            } else { // DISCUSSION_PREFIX
                discussionStatusIds.add(value);
            }
        }
        StatusDetails statusDetails = new StatusDetails();
        statusDetails.setStatusId(statusId);
        statusDetails.setDiscussionStatusIds(discussionStatusIds);
        statusDetails.setSharedByLogins(sharedByLogins);
        return statusDetails;
    }
}
