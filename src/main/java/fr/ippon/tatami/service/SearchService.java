package fr.ippon.tatami.service;

import java.util.Collection;
import java.util.Map;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;

/**
 * Service used to search statuses and users.
 */
public interface SearchService {

    public static final int DEFAULT_PAGE_SIZE = 20;

    /**
     * Reset the search engine.
     * <p/>
     * This is used to do a full reindexation of all the data.
     *
     * @return if the reset was completed OK
     */
    boolean reset();

    /**
     * Add a status to the index.
     *
     * @param status the status to add : can't be null
     * @return the response's Id
     */
    void addStatus(Status status);

    void addStatuses(Collection<Status> statuses);

    /**
     * Delete a status from the index.
     *
     * @param status the status to delete
     */
    void removeStatus(Status status);

    /**
     * Search an item in the index.
     *
     * @param query the query : mandatory
     * @param page  the page to return
     * @param size  the size of a page
     */
    Map<String, SharedStatusInfo> searchStatus(String domain,
            String query,
            int page,
            int size);


    /**
     * Add a user to the index.
     *
     * @param user the user to add : can't be null
     * @return the response's Id
     */
    void addUser(User user);

    void addUsers(Collection<User> users);

    void removeUser(User user);

    Collection<String> searchUserByPrefix(String domain,
            String prefix);
}
