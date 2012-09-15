package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;

import java.util.Map;

/**
 * The Favoriteline Repository.
 *
 * @author Julien Dubois
 */
public interface FavoritelineRepository {

    void addStatusToFavoriteline(Status status, String login);

    void removeStatusFromFavoriteline(Status status, String login);

    void deleteFavoriteline(String login);

    /**
     * The favoriteline : the statuses fovorited by the user.
     * - The key is the statusId of the statuses
     * - The value is who shared the statuses (or null if it wasn't shared)
     */
    Map<String, SharedStatusInfo> getFavoriteline(String login);
}
