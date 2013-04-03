package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Avatar;


/**
 * Created with IntelliJ IDEA.
 * User: Gaby Hourlier
 * Date: 25/03/13
 * Time: 11:18
 * To change this template use File | Settings | File Templates.
 */
public interface AvatarRepository {

    void createAvatar(Avatar avatar);

    void deleteAvatar(Avatar avatar);

    Avatar findAvatarById(String avatarId);

}
