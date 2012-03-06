package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.OpenId;
import fr.ippon.tatami.repository.OpenIdRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.persistence.EntityManager;

/**
 * Cassandra implementation of the user repository.
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraOpenIdRepository implements OpenIdRepository {

    private final Log log = LogFactory.getLog(OpenIdRepository.class);

    @Inject
    private EntityManager em;

    @Override
    public void createOpenId(OpenId openId) {
        if (log.isDebugEnabled()) {
            log.debug("Creating OpenId : " + openId);
        }
        em.persist(openId);
    }

    @Override
    public OpenId findOpenIdByToken(String token) {
        try {
            return em.find(OpenId.class, token);
        } catch (Exception e) {
            if (log.isDebugEnabled()) {
                log.debug("Exception while looking for OpenId " + token + " : " + e.getMessage());
            }
            return null;
        }
    }

}
