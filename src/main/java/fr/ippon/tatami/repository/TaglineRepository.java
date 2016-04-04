package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.TaglineRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.TAGLINE;

/**
 * Cassandra implementation of the Tag line repository.
 * <p/>
 * Structure :
 * - Key = tag + domain
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class TaglineRepository extends AbstractLineRepository {

    private PreparedStatement findByUsernameStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        findByUsernameStmt = session.prepare(
                "SELECT * " +
                        "FROM " + TAGLINE+
                        " WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM " + TAGLINE +
                " WHERE key = :key " +
                "AND status = :statusId");

    }

    public void addStatusToTagline(String tag, Status status) {
        addStatus(getKey(status.getDomain(), tag), TAGLINE, status.getStatusId().toString());
    }

    public void removeStatusesFromTagline(String tag, String domain, Collection<String> statusIdsToDelete) {
        removeStatuses(getKey(domain, tag), ColumnFamilyKeys.TAGLINE, statusIdsToDelete);
    }

    public List<String> getTagline(String domain, String tag, int size, String start, String finish) {
        return getLineFromTable(TAGLINE, getKey(domain, tag), size, start, finish);
    }

    /**
     * Generates the key for this column family.
     */
    private String getKey(String domain, String tag) {
        return tag.toLowerCase() + "-" + domain;
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
