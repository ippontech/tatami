package fr.ippon.tatami.service.exception;

/**
 * This exception is thrown when an exception occurs while promoting/demoting an user as an admin.
 *
 * @author Theo LEBRUN
 */
public class ToggleAdminException extends Exception {

    public ToggleAdminException(String message) {
        super(message);
    }

}
