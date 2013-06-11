package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.status.AbstractStatus;

import java.util.List;

/**
 * The Favoriteline Repository.
 *
 * @author Julien Dubois
 */
public interface FavoritelineRepository {

    void addStatusToFavoriteline(AbstractStatus status, String login);

    void removeStatusFromFavoriteline(AbstractStatus status, String login);

    void deleteFavoriteline(String login);

    /**
     * The favoriteline : the statuses fovorited by the user.
     * - The key is the statusId of the statuses
     * - The value is always null
     */
   List<String> getFavoriteline(String login);
}
