package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * The Domain Respository.
 *
 * @author Julien Dubois
 */
public interface DomainRepository {

    void addUserInDomain(String domain, String login);

    void updateUserInDomain(String domain, String login);

    void deleteUserInDomain(String domain, String login);

    Collection<String> getLoginsInDomain(String domain, int size, String since_id, String max_id);
}
