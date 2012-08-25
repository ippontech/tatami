package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;

import java.util.List;
import java.util.Map;

/**
 * Service used to searchStatus statuses and users.
 */
public interface SearchService {

    public static final int DEFAULT_PAGE_SIZE = 20;

    /**
     * Reset the searchStatus engine.
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

    /**
     * Delete a status from the index.
     *
     * @param status the status to delete
     * @return the response's Id
     */
    String removeStatus(Status status);

    /**
     * Search an item in the index.
     *
     *
     *
     *
     * @param query     the query : mandatory
     * @param sortField which field should be used to sort the results
     * @param sortOrder which order to apply, ASC if not provided
     * @param page      the page to return
     * @param size      the size of a page
     * @return a list of uid
     */
    Map<String, String> searchStatus(@SuppressWarnings("rawtypes")
                                     String domain,
                                     String query,
                                     String sortField, String sortOrder,
                                     int page,
                                     int size);

    /**
     * Search an item in the index.
     *
     * @param clazz       the item type
     * @param searchField a particular field to searchStatus into, if null, "_all" field is used
     * @param uidField    : the field to return in the results collection
     * @param query       the query
     * @param page        the page to return
     * @param size        the size of a page
     * @return a list of uid
     */
    <T> List<String> searchPrefix(String domain,
                                  Class<T> clazz,
                                  String searchField,
                                  String uidField,
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
}
