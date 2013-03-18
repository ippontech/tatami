package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;

import java.util.Map;

/**
 * The Domainline Repository.
 *
 * @author Julien Dubois
 */
public interface DomainlineRepository {

    /**
     * Add a status to the Domain line.
     */
    void addStatusToDomainline(Status status, String domain);

    /**
     * The Domainline : the public status for a domain.
     * - The name is the statusId of the statuses
     * - Value is always null : this is to be consistent with the Timeline & Userline API,
     * which returns Map<String, String>
     */
    Map<String, SharedStatusInfo> getDomainline(String domain, int size, String since_id, String max_id);
}
