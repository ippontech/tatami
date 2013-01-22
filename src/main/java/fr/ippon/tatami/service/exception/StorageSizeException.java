package fr.ippon.tatami.service.exception;

/**
 * This exception is thrown when a user tries to exceed his storage size.
 *
 * @author Julien Dubois
 */
public class StorageSizeException extends Exception {

    public StorageSizeException() {
    }

    public StorageSizeException(String s) {
        super(s);
    }

    public StorageSizeException(String s, Throwable throwable) {
        super(s, throwable);
    }

    public StorageSizeException(Throwable throwable) {
        super(throwable);
    }
}
