package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.MentionlineRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.MENTIONLINE_CF;

/**
 * Cassandra implementation of the Userline repository.
 * <p/>
 * Structure :
 * - Key : login
 * - Name : status Id
 * - Value : ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraMentionlineRepository extends AbstractCassandraLineRepository implements MentionlineRepository {

    @Override
    public void addStatusToMentionline(String mentionedLogin, String statusId) {
        addStatus(mentionedLogin, MENTIONLINE_CF, statusId);
    }

    @Override
    public void removeStatusesFromMentionline(String mentionedLogin, Collection<String> statusIdsToDelete) {
        removeStatuses(mentionedLogin, MENTIONLINE_CF, statusIdsToDelete);
    }

    @Override
    public List<String> getMentionline(String login, int size, String start, String finish) {
        return getLineFromCF(MENTIONLINE_CF, login, size, start, finish);
    }
}
