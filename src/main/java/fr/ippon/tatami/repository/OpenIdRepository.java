package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.OpenId;

/**
 * The User Respository.
 *
 * @author Julien Dubois
 */
public interface OpenIdRepository {

    void createOpenId(OpenId openId);

    OpenId findOpenIdByToken(String token);
}
