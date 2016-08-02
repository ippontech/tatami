package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthoritiesConstants;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.MailService;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.SuggestionService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.UserDTO;
import fr.ippon.tatami.web.rest.util.HeaderUtil;
import org.elasticsearch.common.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing users.
 * <p>
 * <p>This class accesses the User entity, and needs to fetch its collection of authorities.</p>
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * </p>
 * <p>
 * We use a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </p>
 * <p>Another option would be to have a specific JPA entity graph to handle this case.</p>
 */
@RestController
@RequestMapping("/tatami")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private SearchService searchService;

    @Inject
    private MailService mailService;

    @Inject
    private SuggestionService suggestionService;

    @Inject
    private UserService userService;

    /**
     * POST  /users -> Creates a new user.
     * <p>
     * Creates a new user if the username and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     * </p>
     */
    @RequestMapping(value = "/rest/users",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO, HttpServletRequest request) throws URISyntaxException {
        log.debug("rest request to save User : {}", userDTO);
        if (userRepository.findOneByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("user-management", "emailexists", "Email already in use"))
                .body(null);
        } else {
            String domain = DomainUtil.getDomainFromEmail(userDTO.getEmail());
            User currentUser = userService.getCurrentUser().get();
            if (!domain.equals(currentUser.getDomain())) {
                return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert("user-management", "domainbad", "Domain does not match."))
                    .body(null);
            }
            User newUser = userService.createUser(userDTO);
            String baseUrl = request.getScheme() + // "http"
                "://" +                                // "://"
                request.getServerName() +              // "myhost"
                ":" +                                  // ":"
                request.getServerPort() +              // "80"
                request.getContextPath();              // "/myContextPath" or "" if deployed in root context
            mailService.sendCreationEmail(newUser, baseUrl);
            return ResponseEntity.created(new URI("/tatami/users/" + newUser.getUsername()))
                .headers(HeaderUtil.createAlert("user-management.created", newUser.getUsername()))
                .body(newUser);
        }
    }

    /**
     * PUT  /users -> Updates an existing User.
     */
    @RequestMapping(value = "/rest/users",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO) throws URISyntaxException {
        log.debug("rest request to update User : {}", userDTO);
        Optional<User> existingUser = userRepository.findOneByEmail(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("user-management", "emailexists", "E-mail already in use")).body(null);
        }
        existingUser = userRepository.findOneByEmail(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("user-management", "userexists", "Login already in use")).body(null);
        }
        String domain = DomainUtil.getDomainFromEmail(userDTO.getEmail());
        String userDomain = SecurityUtils.getCurrentUserDomain();
        if (!domain.equals(userDomain)) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("user-management", "domainbad", "Domain does not match."))
                .body(null);
        }
        return userRepository
            .findOneById(userDTO.getId())
            .map(user -> {
                user.setUsername(userDTO.getEmail());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                user.setEmail(userDTO.getEmail());
                user.setActivated(userDTO.isActivated());
                user.setLangKey(userDTO.getLangKey());
                user.setAuthorities(userDTO.getAuthorities());
                userRepository.save(user);
                return ResponseEntity.ok()
                    .headers(HeaderUtil.createAlert("user-management.updated", userDTO.getEmail()))
                    .body(new UserDTO(userRepository
                        .findOne(userDTO.getId())));
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

    }

    /**
     * GET  /users -> get all users.
     */
    @RequestMapping(value = "/rest/users",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<UserDTO>> getAllUsers()
        throws URISyntaxException {
        User currentUser = userService.getCurrentUser().get();
        String domain = currentUser.getDomain();
        log.debug("attempting to list all users in domain: {}", domain);
        List<String> userList = domainRepository.getEmailsInDomain(domain);
        List<UserDTO> users = userList.stream().map(email -> userRepository.findOneByEmail(email))
            .filter(Optional::isPresent)
            .map(user -> new UserDTO(user.get()))
            .collect(Collectors.toList());
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    /**
     * GET  /users/:username -> get User with the corresponding "email"
     */
    @RequestMapping(value = "/rest/users/{email}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<UserDTO> getUser(@PathVariable String email) {
        /*
        In cases of posts where users are mentioned, we pass in a username instead of an email address when
        a user clicks the link. In these cases, we should append the current user's domain to the username
        before we proceed.

        See marked.js
        */
        if (!DomainUtil.isValidEmailAddress(email)) {
            email = DomainUtil.getEmailFromUsernameAndDomain(email, SecurityUtils.getCurrentUserDomain());
        }
        log.debug("rest request to get User : {}", email);
        return userService.getUser(email)
            .map(userService::buildUserDTO)
            .map(userDTO -> new ResponseEntity<>(userDTO, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  USER :username -> delete User with the corresponding "email".
     */
    @RequestMapping(value = "/rest/users/{email:[_'.@a-z0-9-]+}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        log.debug("rest request to delete User: {}", email);

        if (email.equals(SecurityUtils.getCurrentUserEmail())) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("user-management", "deleteself", "You cannot delete yourself."))
                .body(null);
        }
        String targetDomain = DomainUtil.getDomainFromEmail(email);
        String userDomain = SecurityUtils.getCurrentUserDomain();
        if (!targetDomain.equals(userDomain)) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("user-management", "domainbad", "Domain does not match."))
                .body(null);
        }
        userService.deleteUserInformation(email);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("user-management.deleted", email)).build();
    }

    /**
     * GET  /users/suggestions -> suggest users to follow
     */
    @RequestMapping(value = "/rest/users/suggestions",
        method = RequestMethod.GET,
        produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<User> suggestions() {
        return suggestionService.suggestUsers(SecurityUtils.getCurrentUserEmail());
    }
}
