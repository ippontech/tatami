package fr.ippon.tatami.repository;

import java.util.Collection;
import java.util.List;

/**
 * The Domainline Repository.
 *
 * @author Julien Dubois
 */
public interface DomainlineRepository {

    /**
     * Add a status to the Domain line.
     */
    void addStatusToDomainline(String domain, String statusId);

    /**
     * Remove a collection of statuses from the Domain line.
     */
    void removeStatusFromDomainline(String domain, Collection<String> statusIdsToDelete);

    /**
     * The Domainline : the public status for a domain.
     * - The name is the statusId of the statuses
     * - Value is always null
     */
    List<String> getDomainline(String domain, int size, String start, String finish);
}
