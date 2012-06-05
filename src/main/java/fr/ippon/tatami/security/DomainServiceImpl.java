package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

/**
 * This service stores the current domain.
 *
 * @author Julien Dubois
 */
public class DomainServiceImpl implements DomainService {

    private final Log log = LogFactory.getLog(DomainServiceImpl.class);

    private String domain;

    @Inject
    private AuthenticationService authenticationService;

    @PostConstruct
    public void init() {
        User user = authenticationService.getCurrentUser();
        this.domain = user.getDomain();
        if (log.isDebugEnabled()) {
            log.debug("Current domain is : " + domain);
        }
    }

    @Override
    public String getDomain() {
        return domain;
    }

    @Override
    public String getLoginFromUsername(String username) {
        return username + "@" + domain;
    }
}
