package fr.ippon.tatami.repository;

import java.util.Collection;

public interface AppleDeviceUserRepository {

    void createAppleDeviceForUser(String deviceId, String login);

    void removeAppleDeviceForUser(String deviceId);

    String findLoginForDeviceId(String deviceId);

}
