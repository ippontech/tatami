package fr.ippon.tatami.web.controller;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.util.Collection;

/**
 * @author Julien Dubois
 */
@Controller
public class AccountGroupsController {

    private final Log log = LogFactory.getLog(AccountGroupsController.class);

    @Inject
    private UserService userService;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private GroupService groupService;

    @RequestMapping(value = "/account/groups",
            method = RequestMethod.GET)
    public ModelAndView getGroups(@RequestParam(required = false) boolean success) {

        ModelAndView mv = basicModelAndView(success);
        Collection<Group> groups = groupService.getGroupsForCurrentUser();
        mv.addObject("groups", groups);
        mv.setViewName("account_groups");
        return mv;
    }

    @RequestMapping(value = "/account/groups",
            method = RequestMethod.POST)
    public ModelAndView getGroups(@ModelAttribute("group")
                                      Group group) {

        if (group.getName() != null && !group.getName().equals("")) {
            groupService.createGroup(group.getName());
            return new ModelAndView("redirect:/tatami/account/groups?success=true");
        }
        return new ModelAndView("redirect:/tatami/account/groups?success=false");
    }

    /**
     * Common code for all "GET" requests.
     */
    private ModelAndView basicModelAndView(boolean success) {
        ModelAndView mv = new ModelAndView();
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());
        mv.addObject("user", user);
        mv.addObject("group", new Group());
        mv.addObject("success", success);
        return mv;
    }
}
