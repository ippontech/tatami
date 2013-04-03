package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Avatar;

public interface AvatarRepository {

    void createAvatar(Avatar avatar);

    void deleteAvatar(String avatarId);

    Avatar findAvatarById(String avatarId);

}
