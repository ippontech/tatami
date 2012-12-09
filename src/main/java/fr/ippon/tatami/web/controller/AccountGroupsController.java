package fr.ippon.tatami.web.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.dto.UserGroupDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.controller.form.UserGroupMembership;

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

        ModelAndView mv = basicModelAndView();
        mv.addObject("success", success);
        User currentUser = authenticationService.getCurrentUser();
        Collection<Group> groups = groupService.getGroupsForUser(currentUser);
        mv.addObject("groups", groups);
        Collection<Group> groupsAdmin = groupService.getGroupsWhereCurrentUserIsAdmin();
        mv.addObject("groupsAdmin", groupsAdmin);
        mv.setViewName("account_groups");
        return mv;
    }

    @RequestMapping(value = "/account/groups",
            method = RequestMethod.POST)
    public ModelAndView addNewGroup(@ModelAttribute("group")
                                    Group group) {

        group.setName(group.getName().replace("<", " "));
        group.setDescription(group.getDescription().replace("<", " "));
        if (group.getName() != null && !group.getName().equals("")) {
            groupService.createGroup(group.getName(), group.getDescription(), group.isPublicGroup());
            return new ModelAndView("redirect:/tatami/account/groups?success=true");
        }
        return reinitializePage();
    }

    @RequestMapping(value = "/account/groups/edit",
            method = RequestMethod.GET)
    public ModelAndView editGroup(
            @RequestParam String groupId,
            @RequestParam(required = false) boolean editGroup,
            @RequestParam(required = false) boolean memberAdd,
            @RequestParam(required = false) boolean memberRemove,
            @RequestParam(required = false) boolean noUser,
            @RequestParam(required = false) boolean wrongUser) {

        ModelAndView mv = basicModelAndView();
        mv.addObject("editGroup", editGroup);
        mv.addObject("memberAdd", memberAdd);
        mv.addObject("memberRemove", memberRemove);
        mv.addObject("noUser", noUser);
        mv.addObject("wrongUser", wrongUser);
        Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
        Group group = null;
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(groupId)) {
                group = testGroup;
                break;
            }
        }
        if (group == null) {
            return new ModelAndView("redirect:/tatami/account/groups");
        }
        Collection<UserGroupDTO> users = groupService.getMembersForGroup(group.getGroupId());
        mv.addObject("users", users);
        mv.addObject("group", group);
        mv.setViewName("account_groups_edit");
        return mv;
    }

    @RequestMapping(value = "/account/groups/edit",
            method = RequestMethod.POST)
    public ModelAndView doEditGroup(@ModelAttribute("group")
                                    Group group) {

        if (group.getGroupId() == null) {
            return new ModelAndView("redirect:/tatami/account/groups");
        }
        Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
        boolean isGroupManagedByCurrentUser = false;
        for (Group testGroup : groups) {
            if (testGroup.getGroupId().equals(group.getGroupId())) {
                isGroupManagedByCurrentUser = true;
                break;
            }
        }
        if (!isGroupManagedByCurrentUser) {
            return new ModelAndView("redirect:/tatami/account/groups");
        }
        group.setDomain(authenticationService.getCurrentUser().getDomain());
        group.setName(group.getName().replace("<", " "));
        group.setDescription(group.getDescription().replace("<", " "));
        groupService.editGroup(group);
        return new ModelAndView(
                "redirect:/tatami/account/groups/edit?editGroup=true&groupId="
                        + group.getGroupId());
    }

    @RequestMapping(value = "/account/groups/edit/addMember",
            method = RequestMethod.POST)
    public ModelAndView addMembership(@ModelAttribute("userGroupMembership")
                                      UserGroupMembership userGroupMembership) {

        if (log.isDebugEnabled()) {
            log.debug("Managing group membership for : " + userGroupMembership);
        }
        String groupId = userGroupMembership.getGroupId();
        if (groupId == null || groupId.equals("")) {
            return reinitializePage();
        }
        Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
        Group currentGroup = null;
        for (Group group : groups) {
            if (group.getGroupId().equals(groupId)) {
                currentGroup = group;
                break;
            }
        }
        if (currentGroup == null) {
            return reinitializePage();
        }
        String username = userGroupMembership.getUsername();
        if (username == null || username.equals("")) {
            return new ModelAndView(
                    "redirect:/tatami/account/groups/edit?noUser=true&groupId="
                            + currentGroup.getGroupId());
        }
        User newMember = userService.getUserByUsername(username);
        if (newMember == null) {
            return new ModelAndView(
                    "redirect:/tatami/account/groups/edit?wrongUser=true&groupId="
                            + currentGroup.getGroupId());
        }
        groupService.addMemberToGroup(newMember, currentGroup);
        return new ModelAndView(
                "redirect:/tatami/account/groups/edit?memberAdd=true&groupId="
                        + currentGroup.getGroupId());
    }

    @RequestMapping(value = "/account/groups/edit/removeMember",
            method = RequestMethod.POST)
    public ModelAndView removeMembership(@RequestParam String groupId,
                                         @RequestParam String username) {

        Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin();
        Group currentGroup = null;
        for (Group group : groups) {
            if (group.getGroupId().equals(groupId)) {
                currentGroup = group;
                break;
            }
        }
        if (currentGroup == null) {
            return reinitializePage();
        }
        User memberToRemove = userService.getUserByUsername(username);
        if (memberToRemove == null) {
            return new ModelAndView(
                    "redirect:/tatami/account/groups/edit?wrongUser=true&groupId="
                            + currentGroup.getGroupId());
        }
        groupService.removeMemberFromGroup(memberToRemove, currentGroup);
        return new ModelAndView(
                "redirect:/tatami/account/groups/edit?memberRemove=true&groupId="
                        + currentGroup.getGroupId());
    }
    
    
    @RequestMapping(value = "/account/groups/directory",
            method = RequestMethod.GET)
    public ModelAndView getGroupsDirectory() { 	
        ModelAndView mv = new ModelAndView("account_groups_directory");
        User currentUser = authenticationService.getCurrentUser();
        Collection<Group> userList = new ArrayList<Group>();
        List<User> list = userService.getUsersForCurrentDomain(0);
        for(User usr : list){
        	Collection<Group> groups = groupService.getGroupsWhereCurrentUserIsAdmin(usr.getLogin());        	
        	if(currentUser.getLogin() != usr.getLogin()){
        		userList.addAll(groups);
        	}
        } 
        mv.addObject("groups", userList);
        mv.addObject("user", currentUser);
        return mv;
    }

    /**
     * Common code for all "GET" requests.
     */
    private ModelAndView basicModelAndView() {
        ModelAndView mv = new ModelAndView();
        User currentUser = authenticationService.getCurrentUser();
        User user = userService.getUserByLogin(currentUser.getLogin());
        Collection<Group> groupsAdmin = groupService.getGroupsWhereCurrentUserIsAdmin();
        mv.addObject("groupsAdmin", groupsAdmin);
        mv.addObject("user", user);
        mv.addObject("group", new Group());
        return mv;
    }

    /**
     * An error has occured, probably because the user tried to hack the system, so we reinitialize everything.
     */
    private ModelAndView reinitializePage() {
        return new ModelAndView("redirect:/tatami/account/groups?success=false");
    }
}
