package fr.ippon.tatami.security;

/**
 * This service stores the current domain.
 *
 * @author Julien Dubois
 */
public interface DomainService {

    String getDomain();

    String getLoginFromUsername(String username);
}
