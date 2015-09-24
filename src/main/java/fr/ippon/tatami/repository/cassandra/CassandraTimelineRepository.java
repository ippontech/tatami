package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.status.Announcement;
import fr.ippon.tatami.domain.status.Share;
import fr.ippon.tatami.repository.TimelineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.QueryResult;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
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
        QueryResult<HColumn<UUID, String>> isStatusAlreadyinTimeline =
                findByLoginAndStatusId(TIMELINE_CF, login, UUID.fromString(statusId));

        return isStatusAlreadyinTimeline.get() != null;
    }

    @Override
    public void addStatusToTimeline(String login, String statusId) {
        addStatus(login, TIMELINE_CF, statusId);
    }

    @Override
    public void removeStatusesFromTimeline(String login, Collection<String> statusIdsToDelete) {
        removeStatuses(login, TIMELINE_CF, statusIdsToDelete);
    }

    @Override
    public void shareStatusToTimeline(String sharedByLogin, String timelineLogin, Share share) {
        shareStatus(timelineLogin, share, TIMELINE_CF, TIMELINE_SHARES_CF);
    }

    @Override
    public void announceStatusToTimeline(String announcedByLogin, List<String> logins, Announcement announcement) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

        for (String login : logins) {
            mutator.addInsertion(login, TIMELINE_CF, HFactory.createColumn(UUID.fromString(announcement.getStatusId()),
                    "", UUIDSerializer.get(), StringSerializer.get()));
        }
        mutator.execute();
    }

    @Override
    public List<String> getTimeline(String login, int size, String start, String finish) {
        return getLineFromCF(TIMELINE_CF, login, size, start, finish);
    }

    @Override
    public void deleteTimeline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, TIMELINE_CF);
        mutator.execute();
    }
}
