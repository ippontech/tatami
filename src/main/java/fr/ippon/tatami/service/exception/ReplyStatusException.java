package fr.ippon.tatami.service.exception;

/**
 * This exception is thrown when a user tries to reply to a status that does not exist.
 *
 * @author Julien Dubois
 */
public class ReplyStatusException extends Exception {

    public ReplyStatusException() {
    }

    public ReplyStatusException(String s) {
        super(s);
    }

    public ReplyStatusException(String s, Throwable throwable) {
        super(s, throwable);
    }

    public ReplyStatusException(Throwable throwable) {
        super(throwable);
    }
}
