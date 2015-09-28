package fr.ippon.tatami.repository;

import java.util.Map;

/**
 * The Registration Repository.
 *
 * @author Julien Dubois
 */
public interface RegistrationRepository {

    String generateRegistrationKey(String login);

    String getLoginByRegistrationKey(String registrationKey);

    /**
     * !! For testing purpose only !!
     */
    Map<String, String> _getAllRegistrationKeyByLogin();
}
