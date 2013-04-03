package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: hellsingblack
 * Date: 26/03/13
 * Time: 15:14
 * To change this template use File | Settings | File Templates.
 */
public interface UserAvatarRepository {

    void addAvatarId(String login, String avatarId);

    void removeAvatarId(String login, String avatarId);

    Collection<String> findAvatarIds(String login);

}
