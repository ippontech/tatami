package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;

import java.util.Map;

/**
 * The Favoriteline Repository.
 *
 * @author Julien Dubois
 */
public interface FavoritelineRepository {

    void addStatusToFavoritesline(Status status, String login);

    void removeStatusFromFavoritesline(Status status, String login);

    void deleteFavoritesline(String login);

    /**
     * The favoriteline : the statuses fovorited by the user.
     * - The key is the statusId of the statuses
     * - The value is who shared the statuses (or null if it wasn't shared)
     */
    Map<String, String> getFavoritesline(String login);
}
