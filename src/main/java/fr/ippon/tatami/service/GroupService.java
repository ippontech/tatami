package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.dto.UserGroupDTO;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;
import java.util.Map;
import java.util.TreeSet;

/**
 * Service bean for managing groups.
 */
@Service
public class GroupService {

    private final Log log = LogFactory.getLog(GroupService.class);

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private GroupRepository groupRepository;

    @Inject
    private GroupMembersRepository groupMembersRepository;

    @Inject
    private GroupCounterRepository groupCounterRepository;

    @Inject
    private UserGroupRepository userGroupRepository;

    @Inject
    private UserRepository userRepository;

    public void createGroup(String groupName) {
        if (log.isDebugEnabled()) {
            log.debug("Creating group : " + groupName);
        }
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String groupId = groupRepository.createGroup(domain, groupName);
        groupMembersRepository.addAdmin(groupId, currentUser.getLogin());
        groupCounterRepository.incrementGroupCounter(domain, groupId);
        userGroupRepository.addGroupAsAdmin(currentUser.getLogin(), groupId);
    }

    public Collection<UserGroupDTO> getMembersForGroup(String groupId) {
        Map<String, String> membersMap = groupMembersRepository.findMembers(groupId);
        Collection<UserGroupDTO> userGroupDTOs = new TreeSet<UserGroupDTO>();
        for (Map.Entry<String, String> member : membersMap.entrySet()) {
            UserGroupDTO dto = new UserGroupDTO();
            User user = userRepository.findUserByLogin(member.getKey());
            dto.setLogin(user.getLogin());
            dto.setUsername(user.getUsername());
            dto.setGravatar(user.getGravatar());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setRole(member.getValue());
            userGroupDTOs.add(dto);
        }
        return userGroupDTOs;
    }

    public Collection<Group> getGroupsForCurrentUser() {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        Collection<String> groupIds = userGroupRepository.findGroups(currentUser.getLogin());
        Collection<Group> groups = new TreeSet<Group>();
        for (String groupId : groupIds) {
            Group group = groupRepository.getGroupById(domain, groupId);
            long counter = groupCounterRepository.getGroupCounter(domain, groupId);
            group.setCounter(counter);
            groups.add(group);
        }
        return groups;
    }
}
