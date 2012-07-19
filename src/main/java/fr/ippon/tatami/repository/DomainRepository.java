package fr.ippon.tatami.repository;

import java.util.List;

/**
 * The Domain Respository.
 *
 * @author Julien Dubois
 */
public interface DomainRepository {

    void addUserInDomain(String domain, String login);

    void updateUserInDomain(String domain, String login);

    void deleteUserInDomain(String domain, String login);

    List<String> getLoginsInDomain(String domain, int pagination);
}
