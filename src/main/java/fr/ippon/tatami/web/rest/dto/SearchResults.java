package fr.ippon.tatami.web.rest.dto;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;

import java.io.Serializable;
import java.util.Collection;

/**
 * Search result for the global search engine.
 */
public class SearchResults implements Serializable {

    private Collection<String> tags;

    private Collection<User> users;

    private Collection<Group> groups;

    public Collection<String> getTags() {
        return tags;
    }

    public void setTags(Collection<String> tags) {
        this.tags = tags;
    }

    public Collection<User> getUsers() {
        return users;
    }

    public void setUsers(Collection<User> users) {
        this.users = users;
    }

    public Collection<Group> getGroups() {
        return groups;
    }

    public void setGroups(Collection<Group> groups) {
        this.groups = groups;
    }
}
