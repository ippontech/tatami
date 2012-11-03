package fr.ippon.tatami.service.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Utility class for managing the user domain.
 *
 * @author Julien Dubois
 */
public class DomainUtil {

    private final Log log = LogFactory.getLog(DomainUtil.class);

    private DomainUtil() {
    }

    public static String getDomainFromLogin(String login) {
        return login.substring(login.indexOf("@") + 1, login.length());
    }

    public static String getLoginFromUsernameAndDomain(String username, String domain) {
        return username + "@" + domain;
    }

    public static String getUsernameFromLogin(String login) {
        if (login == null) {
            return null;
        }
        return login.substring(0, login.indexOf("@"));
    }
}
