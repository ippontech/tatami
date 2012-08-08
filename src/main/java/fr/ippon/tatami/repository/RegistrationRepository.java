package fr.ippon.tatami.repository;

/**
 * The Registration Repository.
 *
 * @author Julien Dubois
 */
public interface RegistrationRepository {

    String generateRegistrationKey(String login);

    String getLoginByRegistrationKey(String registrationKey);
}
