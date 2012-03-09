package fr.ippon.tatami.security;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.UserService;

/**
 * Manages a user's successful login.
 *
 * @author Julien Dubois
 */
@Component
public class TatamiAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Inject
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        super.onAuthenticationSuccess(request, response, authentication);
        String login = authentication.getName();
        if (userService.getUserByLogin(login) == null) {
            User user = new User();
            user.setLogin(login);
            user.setFirstName("First name");
            user.setLastName("Last name");
            user.setEmail("tatami@ippon.fr");
            userService.createUser(user);
        }
    }
}
