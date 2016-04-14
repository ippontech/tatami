package fr.ippon.tatami.repository;

import com.datastax.driver.core.PreparedStatement;
import fr.ippon.tatami.repository.DomainlineRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DOMAINLINE;

/**
 * Cassandra implementation of the Domain line repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class DomainlineRepository extends AbstractLineRepository {

    private final static int COLUMN_TTL = 60 * 60 * 24 * 30; // The column is stored for 30 days.

    private PreparedStatement findByEmailStmt;

    private PreparedStatement deleteByIdStmt;


    @PostConstruct
    public void init() {
        findByEmailStmt = session.prepare(
                "SELECT * " +
                        "FROM " + DOMAINLINE+
                        " WHERE key = :key");

        deleteByIdStmt = session.prepare("DELETE FROM " + DOMAINLINE +
                " WHERE key = :key " +
                "AND status = :statusId");

    }


    public void addStatusToDomainline(String domain, String statusId) {
        addStatus(domain, DOMAINLINE, statusId, COLUMN_TTL);
    }

    public void removeStatusFromDomainline(String domain, Collection<String> statusIdsToDelete) {
        removeStatuses(domain, DOMAINLINE, statusIdsToDelete);
    }

    public List<String> getDomainline(String domain, int size, String start, String finish) {
        return getLineFromTable(DOMAINLINE, domain, size, start, finish);
    }

    @Override
    public PreparedStatement getDeleteByIdStmt() {
        return deleteByIdStmt;
    }
}
