package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.DigestType;

import java.util.List;

/**
 * Provide access to digest subscription info.
 *
 * Subscription are organized by digest type and domain (in order to allow
 * domain-level configuration).
 *
 * @author Pierre Rust
 */
public interface MailDigestRepository {

    /**
     * Subscribe an user to email digest.
     *
     * @param digestType
     * @param login
     * @param domain
     */
    void subscribeToDigest(DigestType digestType, String login, String domain);

    /**
     * Un-subscribe an user from a domain.
     *
     * @param digestType
     * @param login
     * @param domain
     */
    void unsubscribeFromDigest(DigestType digestType, String login, String domain);

    /**
     * Retrieves the list of logins in a domain subscribed to a given digest type.
     *
     * @param digestType
     * @param domain
     * @param pagination
     * @return
     */
    List<String> getLoginsRegisteredToDigest(DigestType digestType, String domain, int pagination);

}
