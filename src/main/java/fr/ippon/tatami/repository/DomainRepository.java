package fr.ippon.tatami.repository;

/**
 * The Domain Respository.
 *
 * @author Julien Dubois
 */
public interface DomainRepository {

    void addUserInDomain(String domain, String login);

    void updateUserInDomain(String domain, String login);
}
