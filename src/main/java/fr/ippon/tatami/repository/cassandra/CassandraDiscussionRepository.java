package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.StatusDetails;
import fr.ippon.tatami.repository.DiscussionRepository;
import fr.ippon.tatami.repository.SharesRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
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

import static fr.ippon.tatami.config.ColumnFamilyKeys.DISCUSSION_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.SHARES_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the StatusDetails repository.
 *
 * Structure :
 * - Key = originial status Id
 * - Name = time
 * - Value = reply status Id
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraDiscussionRepository implements DiscussionRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addReplyToDiscussion(String originalStatusId, String replyStatusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(originalStatusId, DISCUSSION_CF,
                HFactory.createColumn(
                        Calendar.getInstance().getTimeInMillis(),
                        replyStatusId,
                        LongSerializer.get(),
                        StringSerializer.get()));
    }

    @Override
    public Collection<String> findStatusIdsInDiscussion(String originalStatusId) {
        ColumnSlice<Long, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), LongSerializer.get(), StringSerializer.get())
                .setColumnFamily(DISCUSSION_CF)
                .setKey(originalStatusId)
                .setRange(null, null, false, 100) // Limit to 100 replies
                .execute()
                .get();

        Collection<String> statusIds = new LinkedHashSet<String>();
        for (HColumn<Long, String> column : result.getColumns()) {
            statusIds.add(column.getValue());
        }
        return statusIds;
    }
}
