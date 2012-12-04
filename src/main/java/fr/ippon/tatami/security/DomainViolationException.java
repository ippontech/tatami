package fr.ippon.tatami.security;

/**
 * This exception is thrown when a user tries to see a status from another domain.
 *
 * @author Julien Dubois
 */
public class DomainViolationException extends RuntimeException {

    public DomainViolationException() {
    }

    public DomainViolationException(String s) {
        super(s);
    }

    public DomainViolationException(String s, Throwable throwable) {
        super(s, throwable);
    }

    public DomainViolationException(Throwable throwable) {
        super(throwable);
    }
}
