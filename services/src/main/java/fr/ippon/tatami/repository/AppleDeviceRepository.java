package fr.ippon.tatami.repository;

import java.util.Collection;

public interface AppleDeviceRepository {

    void createAppleDevice(String login, String deviceId);

    void removeAppleDevice(String login, String deviceId);

    Collection<String> findAppleDevices(String login);

}
