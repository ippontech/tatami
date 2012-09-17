package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Domain;

import java.util.List;
import java.util.Set;

/**
 * The Domain Repository.
 *
 * @author Julien Dubois
 */
public interface DomainRepository {

    void addUserInDomain(String domain, String login);

    void updateUserInDomain(String domain, String login);

    void deleteUserInDomain(String domain, String login);

    List<String> getLoginsInDomain(String domain, int pagination);

    Set<Domain> getAllDomains();
}
