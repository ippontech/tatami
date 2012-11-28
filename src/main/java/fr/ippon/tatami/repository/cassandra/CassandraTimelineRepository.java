package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.repository.TimelineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.QueryResult;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_CF;
import static fr.ippon.tatami.config.ColumnFamilyKeys.TIMELINE_SHARES_CF;

/**
 * Cassandra implementation of the Timeline repository.
 * <p/>
 * Structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraTimelineRepository extends AbstractCassandraLineRepository implements TimelineRepository {

    @Override
    public boolean isStatusInTimeline(String login, String statusId) {
        UUID name = UUID.fromString(statusId);
        QueryResult<HColumn<UUID, String>> isStatusAlreadyinTimeline =
                findByLoginAndName(TIMELINE_CF, login, name);

        if (isStatusAlreadyinTimeline.get() == null) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public void addStatusToTimeline(String login, Status status) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, TIMELINE_CF, HFactory.createColumn(UUID.fromString(status.getStatusId()),
                "", UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Status status) {
        shareStatus(timelineLogin, status, sharedByLogin, TIMELINE_CF, TIMELINE_SHARES_CF);
    }

    @Override
    public Map<String, SharedStatusInfo> getTimeline(String login, int size, String since_id, String max_id) {
        return getLineFromCF(TIMELINE_CF, login, size, since_id, max_id);
    }

    @Override
    public void deleteTimeline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, TIMELINE_CF);
        mutator.execute();
    }
}
