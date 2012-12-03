package fr.ippon.tatami.web.rest.dto;

import fr.ippon.tatami.domain.User;

import java.io.Serializable;
import java.util.Collection;

/**
 * Search result for the global search engine.
 */
public class SearchResults implements Serializable {

    private Collection<String> tags;

    private Collection<User> users;

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
}
