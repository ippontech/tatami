package fr.ippon.tatami.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Pac4j uses the ClientAuthenticationToken, where the principal is a string, but
 * our AuthenticationService expects a UsersDetails object for the principal. This
 * class handles this, it takes the ClientAuthenticationToken, and makes it fix what
 * we expect.
 */
public class GoogleAuthenticationToken extends AbstractAuthenticationToken {
    private final Object principal;
    private Object credentials;

    public GoogleAuthenticationToken(Object principal) {
        this(principal, null);
    }

    public GoogleAuthenticationToken(Object principal, Object credentials) {
        super((Collection)null);
        this.principal = principal;
        this.credentials = credentials;
        this.setAuthenticated(false);
    }

    public GoogleAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return this.credentials;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if(isAuthenticated) {
            throw new IllegalArgumentException("Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        } else {
            super.setAuthenticated(false);
        }
    }

}
