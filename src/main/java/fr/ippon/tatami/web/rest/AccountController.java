package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;

/**
 * REST controller for managing accounts.
 *
 * @author Julien Dubois
 */
@Controller
public class AccountController {

    private final Log log = LogFactory.getLog(AccountController.class);

    @Inject
    private UserService userService;

    /**
     * POST /account/update_profile -> update the current user
     */
    @RequestMapping(value = "/rest/account/update_profile",
            method = RequestMethod.POST,
            consumes = "application/json")
    @ResponseBody
    public void updateProfile(@RequestBody User user) {
        if (log.isDebugEnabled()) {
            log.debug("Update profile request received for user: " + user.getLogin());
        }
        user.setFirstName(StringEscapeUtils.escapeHtml(user.getFirstName()));
        user.setLastName(StringEscapeUtils.escapeHtml(user.getLastName()));
        userService.updateUser(user);
    }
}
