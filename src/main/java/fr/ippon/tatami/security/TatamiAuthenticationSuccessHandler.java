package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Manages a user's successful login.
 *
 * @author Julien Dubois
 */
@Component
public class TatamiAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Inject
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        String login = authentication.getName();
        if (userService.getUserByLogin(login) == null) {
            User user = new User();
            user.setLogin(login);
            user.setFirstName("");
            user.setLastName("");
            userService.createUser(user);
        }
    }
}
