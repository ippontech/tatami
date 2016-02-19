package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.GroupMember;
import fr.ippon.tatami.domain.enums.GroupRoles;
import fr.ippon.tatami.repository.GroupRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.web.rest.dto.GroupDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;
import java.util.UUID;

/**
 * Service class for managing groups.
 */
@Service
public class GroupService {

    private final Logger log = LoggerFactory.getLogger(GroupService.class);

    @Inject
    private GroupRepository groupRepository;

    public Group createGroup(GroupDTO groupDTO) {
        log.debug("Creating group : {}", groupDTO.getName());
        log.debug("Username : {}", SecurityUtils.getCurrentUser().getUsername());
        String username = SecurityUtils.getCurrentUser().getUsername();
        // TODO: Retrieve the domain
        String domain = "ippon.fr";

        // Create the group
        Group group = new Group();
        group.setArchivedGroup(false);
        group.setCounter(0);
        group.setDescription(groupDTO.getDescription());
        group.setDomain(domain);
        group.setName(groupDTO.getName());
        group.setPublicGroup(groupDTO.isPublicGroup());
        group = groupRepository.createGroup(group);

        // Add the user to it
        GroupMember member = new GroupMember();
        member.setGroupId(group.getId());
        member.setLogin(username);
        member.setRole(GroupRoles.ADMIN);
        member = addMember(member);

        log.debug("Group created : {}", group);
        log.debug("Member created : {}", member);
        return group;
    }

    public GroupMember addMember(GroupMember member) {
        member = groupRepository.addMember(member);
        groupRepository.incrementCounter(member.getGroupId());
        return member;
    }

    public void removeMember(GroupMember member) {
        groupRepository.removeMember(member);
        groupRepository.decrementCounter(member.getGroupId());
    }

    public List<Group> getGroupsOfCurrentUser() {
        return groupRepository.getGroupsFromIds(groupRepository.getGroupsFromUser(SecurityUtils.getCurrentUser().getUsername()));
    }

    public boolean isAdministrator(UUID id) {
        return groupRepository.isAdministrator(id, SecurityUtils.getCurrentUser().getUsername());
    }
}
