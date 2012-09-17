package fr.ippon.tatami.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class TatamiUserDetails extends User {

    /**
     * 
     */
    private static final long serialVersionUID = -5254098987887378014L;

    private String theme;

    public TatamiUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    @Override
    public String toString() {
        return "TatamiUserDetails{" +
                "theme='" + theme + '\'' +
                "} " + super.toString();
    }
}
