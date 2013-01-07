package fr.ippon.tatami.service;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.*;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.service.util.GravatarUtil;
import fr.ippon.tatami.service.util.RandomUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Manages the application's users.
 *
 * @author Julien Dubois
 */
@Service
public class UserService {

    private final Log log = LogFactory.getLog(UserService.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private FriendshipService friendshipService;

    @Inject
    private CounterRepository counterRepository;

    @Inject
    private FavoritelineRepository favoritelineRepository;

    @Inject
    private AuthenticationService authenticationService;

    @Inject
    private MailService mailService;

    @Inject
    private TimelineRepository timelineRepository;

    @Inject
    private UserlineRepository userlineRepository;

    @Inject
    private RegistrationRepository registrationRepository;

    @Inject
    private RssUidRepository rssUidRepository;

    @Inject
    private SearchService searchService;

    public User getUserByLogin(String login) {
        return userRepository.findUserByLogin(login);
    }

    public String getLoginByRssUid(String rssUid) {
        return rssUidRepository.getLoginByRssUid(rssUid);
    }

    public User getUserByUsername(String username) {
        User currentUser = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        String login = DomainUtil.getLoginFromUsernameAndDomain(username, domain);
        return getUserByLogin(login);
    }

    /**
     * Return a collection of Users based on their username (ie : uid)
     *
     * @param logins the collection : must not be null
     * @return a Collection of User
     */
    public Collection<User> getUsersByLogin(Collection<String> logins) {
        final Collection<User> users = new ArrayList<User>();
        User user = null;
        for (String login : logins) {
            user = userRepository.findUserByLogin(login);
            if (user != null) {
                users.add(user);
            }
        }
        return users;
    }

    public List<User> getUsersForCurrentDomain(int pagination) {
        User currentUSer = authenticationService.getCurrentUser();
        String domain = DomainUtil.getDomainFromLogin(currentUSer.getLogin());
        List<String> logins = domainRepository.getLoginsInDomain(domain, pagination);
        List<User> users = new ArrayList<User>();
        for (String login : logins) {
            User user = getUserByLogin(login);
            users.add(user);
        }
        return users;
    }

    public void updateUser(User user) {
        User currentUser = authenticationService.getCurrentUser();
        user.setLogin(currentUser.getLogin());
        user.setUsername(currentUser.getUsername());
        user.setDomain(currentUser.getDomain());
        user.setGravatar(GravatarUtil.getHash(user.getLogin()));
        try {
            userRepository.updateUser(user);
            searchService.removeUser(user);
            searchService.addUser(user);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating user " + user + " : " + cve);
            throw cve;
        }
    }

    public void updatePassword(User user) {
        User currentUser = authenticationService.getCurrentUser();
        String password = user.getPassword();
        StandardPasswordEncoder encoder = new StandardPasswordEncoder();
        String encryptedPassword = encoder.encode(password);
        currentUser.setPassword(encryptedPassword);
        if (log.isDebugEnabled()) {
            log.debug("Password encrypted to : " + encryptedPassword);
        }
        try {
            userRepository.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating user " + user + " : " + cve);
            throw cve;
        }
    }

    public void updateThemePreferences(String theme) {
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setTheme(theme);
        if (log.isDebugEnabled()) {
            log.debug("Updating theme :" + theme);
        }
        try {
            userRepository.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating preferences : " + cve);
            throw cve;
        }
    }

    public void updateEmailPreferences(boolean preferencesMentionEmail) {
        User currentUser = authenticationService.getCurrentUser();
        currentUser.setPreferencesMentionEmail(preferencesMentionEmail);
        if (log.isDebugEnabled()) {
            log.debug("Updating e-mail preferences : preferencesMentionEmail=" + preferencesMentionEmail);
        }
        try {
            userRepository.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating preferences : " + cve);
            throw cve;
        }
    }

    public void createUser(User user) {
        String login = user.getLogin();

        String username = DomainUtil.getUsernameFromLogin(login);
        String domain = DomainUtil.getDomainFromLogin(login);
        domainRepository.addUserInDomain(domain, login);

        // If the user is using OpenID or LDAP, the password is not set.
        // In this case, we generate a random password as Spring Security requires the user
        // to have a non-null password (and it is of course a better security than no password)
        if (user.getPassword() == null) {
            String password = RandomUtil.generatePassword();
            StandardPasswordEncoder encoder = new StandardPasswordEncoder();
            String encryptedPassword = encoder.encode(password);
            user.setPassword(encryptedPassword);
        }

        user.setGravatar(GravatarUtil.getHash(login));
        user.setUsername(username);
        user.setDomain(domain);
        user.setTheme(Constants.DEFAULT_THEME);
        user.setFirstName(StringUtils.defaultString(user.getFirstName()));
        user.setLastName(StringUtils.defaultString(user.getLastName()));
        user.setJobTitle("");
        user.setPhoneNumber("");

        counterRepository.createStatusCounter(user.getLogin());
        counterRepository.createFriendsCounter(user.getLogin());
        counterRepository.createFollowersCounter(user.getLogin());
        userRepository.createUser(user);

        // Add to the searchStatus engine
        searchService.addUser(user);

        if (log.isDebugEnabled()) {
            log.debug("Created User : " + user.toString());
        }
    }

    public void deleteUser(User user) {
        // Unfollow this user
        Collection<String> followersIds = friendshipService.getFollowerIdsForUser(user.getLogin());
        for (String followerId : followersIds) {
            User follower = getUserByLogin(followerId);
            friendshipService.unfollowUser(follower, user);
        }
        log.debug("Delete user step 1 : Unfollowed user " + user.getLogin());

        // Unfollow friends
        Collection<String> friendsIds = friendshipService.getFriendIdsForUser(user.getLogin());
        for (String friendId : friendsIds) {
            User friend = getUserByLogin(friendId);
            friendshipService.unfollowUser(user, friend);
        }
        log.debug("Delete user step 2 : user " + user.getLogin() + " has no more friends.");

        // Delete userline, tagLine...
        favoritelineRepository.deleteFavoriteline(user.getLogin());
        timelineRepository.deleteTimeline(user.getLogin());
        userlineRepository.deleteUserline(user.getLogin());
        log.debug("Delete user step 3 : user " + user.getLogin() + " has no more lines.");

        // Remove from domain
        String domain = DomainUtil.getDomainFromLogin(user.getLogin());
        domainRepository.deleteUserInDomain(domain, user.getLogin());
        log.debug("Delete user step 4 : user " + user.getLogin() + " has no domain.");

        // Delete counters
        counterRepository.deleteCounters(user.getLogin());
        log.debug("Delete user step 5 : user " + user.getLogin() + " has no counter.");

        // Delete user
        userRepository.deleteUser(user);
        log.debug("Delete user step 6 : user " + user.getLogin() + " is deleted.");

        // Tweets are not deleted, but are not available to users anymore (unless the same user is created again)

        log.debug("User " + user.getLogin() + "has been successfully deleted !");
    }

    /**
     * Creates a User and sends a registration e-mail.
     */
    public void registerUser(User user) {
        String registrationKey = registrationRepository.generateRegistrationKey(user.getLogin());
        mailService.sendRegistrationEmail(registrationKey, user);
    }

    public void lostPassword(User user) {
        String registrationKey = registrationRepository.generateRegistrationKey(user.getLogin());
        mailService.sendLostPasswordEmail(registrationKey, user);
    }

    public String validateRegistration(String key) {
        if (log.isDebugEnabled()) {
            log.debug("Validating registration for key " + key);
        }
        String login = registrationRepository.getLoginByRegistrationKey(key);
        String password = RandomUtil.generatePassword();
        StandardPasswordEncoder encoder = new StandardPasswordEncoder();
        String encryptedPassword = encoder.encode(password);
        if (login != null) {
            User existingUser = getUserByLogin(login);
            if (existingUser != null) {
                if (log.isDebugEnabled()) {
                    log.debug("Reinitializing password for user " + login);
                }
                existingUser.setPassword(encryptedPassword);
                userRepository.updateUser(existingUser);
                mailService.sendPasswordReinitializedEmail(existingUser, password);
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("Validating user " + login);
                }
                User user = new User();
                user.setLogin(login);
                user.setPassword(encryptedPassword);
                createUser(user);
                mailService.sendValidationEmail(user, password);
            }
        }
        return login;
    }

    public void updateRssTimelinePreferences(boolean booleanPreferencesRssTimeline) {

        User currentUser = authenticationService.getCurrentUser();
        
        if (booleanPreferencesRssTimeline) {
            // Activate rss feed publication.
            String rssUid = rssUidRepository.generateRssUid(currentUser.getLogin());
            currentUser.setRssUid(rssUid);
            if (log.isDebugEnabled()) {
                log.debug("Updating rss timeline preferences : rssUid=" + rssUid);
            }

            try {
                userRepository.updateUser(currentUser);
            } catch (ConstraintViolationException cve) {
                log.info("Constraint violated while updating preferences : " + cve);
                throw cve;
            }

        } else {

            // Remove current rssUid from both CF!
            String rssUid = currentUser.getRssUid();
            if ((rssUid != null) && (!rssUid.isEmpty())) {
                rssUidRepository.removeRssUid(rssUid);
                currentUser.setRssUid("");
                if (log.isDebugEnabled()) {
                    log.debug("Updating rss timeline preferences : rssUid=" + rssUid);
                }

                try {
                    userRepository.updateUser(currentUser);
                } catch (ConstraintViolationException cve) {
                    log.info("Constraint violated while updating preferences : " + cve);
                    throw cve;
                }
            }
        }



    }
}
