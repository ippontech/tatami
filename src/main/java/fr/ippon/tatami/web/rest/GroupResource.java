package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.security.AuthoritiesConstants;
import fr.ippon.tatami.service.GroupService;
import fr.ippon.tatami.web.rest.dto.GroupDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tatami")
public class GroupResource {

    private final Logger log = LoggerFactory.getLogger(GroupResource.class);

    @Inject
    private GroupService groupService;

    /**
     * GET /groups -> Get groups of the current user.
     */
    @Timed
    @ResponseBody
    @Secured(AuthoritiesConstants.USER)
    @RequestMapping(value = "/rest/groups",
        method = RequestMethod.GET,
        produces = "application/json")
    public Collection<GroupDTO> getGroups() {
        return groupService.getGroupsOfCurrentUser().stream().map(group -> {
            GroupDTO groupDTO = new GroupDTO();
            BeanUtils.copyProperties(group, groupDTO);
            groupDTO.setMember(true);
            groupDTO.setAdministrator(groupService.isAdministrator(group.getId()));
            return groupDTO;
        }).collect(Collectors.toList());
    }

    /**
     * POST  /groups -> Creates a new group.
     */
    @Timed
    @ResponseBody
    @Secured(AuthoritiesConstants.USER)
    @RequestMapping(value = "/groups",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public Group createGroup(@RequestBody GroupDTO groupDTO) throws URISyntaxException {
        log.debug("REST request to save Group : {}", groupDTO);
        return groupService.createGroup(groupDTO);
    }
}
