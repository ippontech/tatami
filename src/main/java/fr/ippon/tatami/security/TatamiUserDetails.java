package fr.ippon.tatami.security;

import fr.ippon.tatami.config.Constants;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class TatamiUserDetails extends User {

    private String theme = Constants.DEFAULT_THEME;

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
