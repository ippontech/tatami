package fr.ippon.tatami.security;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserDetailsService.class);

    @Inject
    private UserRepository userRepository;

    @Override
    @Transactional
    /*
    We can't change the name of this method because it is Spring Security, but the parameter being passed in is
    actually the user's email address.
    */
    public UserDetails loadUserByUsername(final String email) {
        log.debug("Authenticating {}", email);
        String lowerCaseEmail = email.toLowerCase();
        Optional<User> userFromDatabase = userRepository.findOneByEmail(lowerCaseEmail);

        if (!userFromDatabase.isPresent()) {
            throw new UsernameNotFoundException("User " + email + " not in the database.");
        }

        return userFromDatabase.map(user -> {
            if (!user.getActivated()) {
                throw new UserNotActivatedException("User " + lowerCaseEmail + " was not activated");
            }
            List<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
            return new org.springframework.security.core.userdetails.User(lowerCaseEmail,
                user.getPassword(),
                grantedAuthorities);
        }).orElseThrow(() -> new UsernameNotFoundException("User " + lowerCaseEmail + " was not found in the " +
            "database"));
    }

}
