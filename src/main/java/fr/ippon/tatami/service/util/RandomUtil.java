package fr.ippon.tatami.service.util;

import org.apache.commons.lang.RandomStringUtils;

/**
 * Utility class for generating random Strings.
 *
 * @author Julien Dubois
 */
public class RandomUtil {

    private RandomUtil() {
    }

    public static String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(20);
    }

    public static String generateRegistrationKey() {
        return RandomStringUtils.randomNumeric(20);
    }
}
