package fr.ippon.tatami.service.exception;

/**
 * This exception is thrown when a user tries to exceed his storage size.
 *
 * @author Julien Dubois
 */
public class StorageSizeException extends Exception {

    public StorageSizeException(String s) {
        super(s);
    }

    public StorageSizeException(Throwable throwable) {
        super(throwable);
    }
}
