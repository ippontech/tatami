package fr.ippon.tatami.service.exception;

/**
 * This exception is thrown when a user tries to post a message to an archived group.
 *
 * @author Julien Dubois
 */
public class ArchivedGroupException extends Exception {

    public ArchivedGroupException() {
    }

    public ArchivedGroupException(String s) {
        super(s);
    }

    public ArchivedGroupException(String s, Throwable throwable) {
        super(s, throwable);
    }

    public ArchivedGroupException(Throwable throwable) {
        super(throwable);
    }
}
