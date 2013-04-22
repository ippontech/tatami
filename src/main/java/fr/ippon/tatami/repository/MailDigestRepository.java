package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.DigestType;

import java.util.List;

/**
 * Provide access to digest subscription info.
 * <p/>
 * Subscription are organized by digest type and domain (in order to allow
 * domain-level configuration).
 *
 * @author Pierre Rust
 */
public interface MailDigestRepository {

    /**
     * Subscribe an user to email digest.
     */
    void subscribeToDigest(DigestType digestType, String login, String domain, String day);

    /**
     * Un-subscribe an user from a domain.
     */
    void unsubscribeFromDigest(DigestType digestType, String login, String domain, String day);

    /**
     * Retrieves the list of logins in a domain subscribed to a given digest type.
     */
    List<String> getLoginsRegisteredToDigest(DigestType digestType, String domain, String day, int pagination);

}
