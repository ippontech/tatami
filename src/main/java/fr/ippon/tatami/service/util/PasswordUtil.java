package fr.ippon.tatami.service.util;

import org.apache.commons.lang.RandomStringUtils;

/**
 * Utility class for generating random passwords.
 *
 * @author Julien Dubois
 */
public class PasswordUtil {

    public static String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(20);
    }
}
