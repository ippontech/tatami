package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.security.TatamiUserDetails;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;

/**
 * @author Julien Dubois
 */
@Controller
public class AccountPreferencesController {

    private final Log log = LogFactory.getLog(AccountPreferencesController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @RequestMapping(value = "/account/preferences",
            method = RequestMethod.GET)
    public ModelAndView getPreferences(@RequestParam(required = false) boolean success) {
        ModelAndView mv = new ModelAndView("account_preferences");
        User currentUser = authenticationService.getCurrentUser();
        if (currentUser.getPreferencesMentionEmail() == null) {
            currentUser.setPreferencesMentionEmail(true);
        }
        mv.addObject("user", userService.getUserByLogin(currentUser.getLogin()));
        mv.addObject("success", success);
        return mv;
    }

    @RequestMapping(value = "/account/preferences/theme/update",
            method = RequestMethod.GET)
    public String updateTheme(@RequestParam String theme) {
        userService.updateThemePreferences(theme);
        TatamiUserDetails userDetails =
                (TatamiUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        userDetails.setTheme(theme);
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(userDetails,
                        userDetails.getPassword(),
                        userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return "redirect:/tatami/account/preferences?success=true";
    }

    @RequestMapping(value = "/account/preferences/notifications/update",
            method = RequestMethod.POST)
    public String updateNotificationsPreferences(@RequestParam(required = false) String preferencesMentionEmail,
                                                 @RequestParam(required = false) String preferencesRssTimeline) {
        boolean booleanPreferencesMentionEmail = false;
        if (preferencesMentionEmail != null && preferencesMentionEmail.equals("on")) {
            booleanPreferencesMentionEmail = true;
        }
        userService.updateEmailPreferences(booleanPreferencesMentionEmail);

        boolean booleanPreferencesRssTimeline = false;
        if (preferencesRssTimeline != null && preferencesRssTimeline.equals("on")) {
            booleanPreferencesRssTimeline = true;
        }
        userService.updateRssTimelinePreferences(booleanPreferencesRssTimeline);

        return "redirect:/tatami/account/preferences?success=true";
    }
}
