package fr.ippon.tatami.web.rest.dto;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.service.dto.UserDTO;

import java.io.Serializable;
import java.util.Collection;

/**
 * Search result for the global search engine.
 */
public class SearchResults implements Serializable {

    private Collection<Tag> tags;

    private Collection<UserDTO> users;

    private Collection<Group> groups;

    public Collection<Tag> getTags() {
        return tags;
    }

    public void setTags(Collection<Tag> tags) {
        this.tags = tags;
    }

    public Collection<UserDTO> getUsers() {
        return users;
    }

    public void setUsers(Collection<UserDTO> users) {
        this.users = users;
    }

    public Collection<Group> getGroups() {
        return groups;
    }

    public void setGroups(Collection<Group> groups) {
        this.groups = groups;
    }
}
