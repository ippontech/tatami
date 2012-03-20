package fr.ippon.tatami.security;

import static fr.ippon.tatami.domain.User.user;

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
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException,
            ServletException {
        super.onAuthenticationSuccess(request, response, authentication);
        String login = authentication.getName();
        if (userService.getUserByLogin(login) == null) {
            User user = user() //
                    .login(login) //
                    .firstName(login) //
                    .lastName("") //
                    .email(login + "@ippon.fr") //
                    .build();
            userService.createUser(user);
        }
    }
}
