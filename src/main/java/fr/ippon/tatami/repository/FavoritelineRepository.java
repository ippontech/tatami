package fr.ippon.tatami.repository;

import java.util.List;

/**
 * The Favoriteline Repository.
 *
 * @author Julien Dubois
 */
public interface FavoritelineRepository {

    void addStatusToFavoriteline(String login, String statusId);

    void removeStatusFromFavoriteline(String login, String statusId);

    void deleteFavoriteline(String login);

    /**
     * The favoriteline : the statuses fovorited by the user.
     * - The key is the statusId of the statuses
     * - The value is always null
     */
    List<String> getFavoriteline(String login);
}
