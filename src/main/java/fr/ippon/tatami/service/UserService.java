package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.DigestType;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.MailDigestRepository;
import fr.ippon.tatami.repository.RssUidRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.repository.search.UserSearchRepository;
import fr.ippon.tatami.security.AuthoritiesConstants;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.security.UserDetailsService;
import fr.ippon.tatami.service.util.RandomUtil;
import fr.ippon.tatami.web.rest.dto.ManagedUserDTO;

import java.lang.String;
import java.time.ZonedDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import java.util.*;

/**
 * Service class for managing users.
 */
@Service
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserSearchRepository userSearchRepository;

    @Inject
    private RssUidRepository rssUidRepository;

    @Inject
    private MailDigestRepository mailDigestRepository;

    @Inject
    private UserDetailsService userDetailsService;

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                userRepository.save(user);
                userSearchRepository.save(user);
                log.debug("Activated user: {}", user);
                return user;
            });
        return Optional.empty();
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
       log.debug("Reset user password for reset key {}", key);

       return userRepository.findOneByResetKey(key)
            .filter(user -> {
                ZonedDateTime oneDayAgo = ZonedDateTime.now().minusHours(24);
                return user.getResetDate().after(Date.from(oneDayAgo.toInstant()));
           })
           .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                userRepository.save(user);
                userSearchRepository.save(user);
                return user;
           });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmail(mail)
            .filter(User::getActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(new Date());
                userRepository.save(user);
                userSearchRepository.save(user);
                return user;
            });
    }

    public User createUserInformation(String username, String password, String firstName, String lastName, String email,
        String langKey, String jobTitle, String phoneNumber, boolean mentionEmail, String rssUid, boolean weeklyDigest, boolean dailyDigest, String domain) {

        User newUser = new User();
        newUser.setId(UUID.randomUUID().toString());
        Set<String> authorities = new HashSet<>();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setUsername(username);
        newUser.setUsername(username);
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setLangKey(langKey);
        newUser.setJobTitle(jobTitle);
        newUser.setPhoneNumber(phoneNumber);
        newUser.setMentionEmail(mentionEmail);
        newUser.setRssUid(rssUid);
        newUser.setWeeklyDigest(weeklyDigest);
        newUser.setDailyDigest(dailyDigest);
        newUser.setDomain(domain);
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        authorities.add(AuthoritiesConstants.USER);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        userSearchRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    public User createUser(ManagedUserDTO managedUserDTO) {
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(managedUserDTO.getUsername());
        user.setFirstName(managedUserDTO.getFirstName());
        user.setLastName(managedUserDTO.getLastName());
        user.setEmail(managedUserDTO.getEmail());
        user.setPhoneNumber(managedUserDTO.getPhoneNumber());
        user.setJobTitle(managedUserDTO.getJobTitle());
        if (managedUserDTO.getLangKey() == null) {
            user.setLangKey("en"); // default language is English
        } else {
            user.setLangKey(managedUserDTO.getLangKey());
        }
        user.setAuthorities(managedUserDTO.getAuthorities());
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(new Date());
        user.setActivated(true);
        userRepository.save(user);
        userSearchRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    public void updateUserInformation(String firstName, String lastName, String email, String langKey, String jobTitle,
                                      String phoneNumber) {
        userRepository.findOneByEmail(userDetailsService.getUserEmail()).ifPresent(u -> {
            u.setFirstName(firstName);
            u.setLastName(lastName);
            u.setEmail(email);
            u.setLangKey(langKey);
            u.setJobTitle(jobTitle);
            u.setPhoneNumber(phoneNumber);
            userRepository.save(u);
            userSearchRepository.save(u);
            log.debug("Changed Information for User: {}", u);
        });
    }

    public void updateUserPreferences(boolean mentionEmail, String rssUid,
                                      boolean weeklyDigest, boolean dailyDigest) {
        userRepository.findOneByEmail(userDetailsService.getUserEmail()).ifPresent(u -> {
            u.setMentionEmail(mentionEmail);
            u.setRssUid(rssUid);
            u.setWeeklyDigest(weeklyDigest);
            u.setDailyDigest(dailyDigest);
            userRepository.save(u);
            userSearchRepository.save(u);
            log.debug("Change Preferences for User: {}", u);
        });
    }

    public void deleteUserInformation(String email) {
        userRepository.findOneByEmail(email).ifPresent(u -> {
            userRepository.delete(u);
            userSearchRepository.delete(u);
            log.debug("Deleted User: {}", u);
        });
    }

    public void changePassword(String password) {
        userRepository.findOneByEmail(userDetailsService.getUserEmail()).ifPresent(u -> {
            String encryptedPassword = passwordEncoder.encode(password);
            u.setPassword(encryptedPassword);
            userRepository.save(u);
            userSearchRepository.save(u);
            log.debug("Changed password for User: {}", u);
        });
    }

    public Optional<User> getUserWithAuthoritiesByEmail(String email) {
        return userRepository.findOneByEmail(email).map(u -> {
            u.getAuthorities().size();
            return u;
        });
    }


    public User getUserWithAuthorities() {
        User user = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        user.getAuthorities().size(); // eagerly load the association
        return user;
    }

    /**
     * Activate of de-activate rss publication for the timeline.
     *
     * @return the rssUid used for rss publication, empty if no publication
     */
    public String updateRssTimelinePreferences(boolean booleanPreferencesRssTimeline) {

        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        String rssUid = currentUser.getRssUid();
        if (booleanPreferencesRssTimeline) {
            // if we already have an rssUid it means it's already activated :
            // nothing to do, we do not want to change it

            if ((rssUid == null) || rssUid.equals("")) {
                // Activate rss feed publication.
                rssUid = rssUidRepository.generateRssUid(currentUser.getUsername());
                currentUser.setRssUid(rssUid);
                log.debug("Updating rss timeline preferences : rssUid={}", rssUid);

                try {
                    userRepository.save(currentUser);
                } catch (ConstraintViolationException cve) {
                    log.info("Constraint violated while updating preferences : " + cve);
                    throw cve;
                }
            }

        } else {

            // Remove current rssUid from both CF!
            if ((rssUid != null) && (!rssUid.isEmpty())) {
                // this used to delete from a rss table. now we don't have one.
                rssUidRepository.removeRssUid(rssUid);
                rssUid = "";
                currentUser.setRssUid(rssUid);
                log.debug("Updating rss timeline preferences : rssUid={}", rssUid);

                try {
                    userRepository.save(currentUser);
                } catch (ConstraintViolationException cve) {
                    log.info("Constraint violated while updating preferences : " + cve);
                    throw cve;
                }
            }
        }
        return rssUid;
    }

    /**
     * update registration to weekly digest email.
     */
    public void updateWeeklyDigestRegistration(boolean registration) {
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        currentUser.setWeeklyDigest(registration);
        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));

        if (registration) {
            mailDigestRepository.subscribeToDigest(DigestType.WEEKLY_DIGEST, currentUser.getUsername(),
                currentUser.getDomain(), day);
        } else {
            mailDigestRepository.unsubscribeFromDigest(DigestType.WEEKLY_DIGEST, currentUser.getUsername(),
                currentUser.getDomain(), day);
        }

        log.debug("Updating weekly digest preferences : " +
            "weeklyDigest={} for user {}", registration, currentUser.getUsername());
        try {
            userRepository.save(currentUser);
            userSearchRepository.save(currentUser);
//            userRepository.updateUser(currentUser);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating preferences : " + cve);
            throw cve;
        }
    }

    /**
     * Update registration to daily digest email.
     */
    public void updateDailyDigestRegistration(boolean registration) {
        User currentUser = userRepository.findOneByEmail(userDetailsService.getUserEmail()).get();
        currentUser.setDailyDigest(registration);
        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));

        if (registration) {
            mailDigestRepository.subscribeToDigest(DigestType.DAILY_DIGEST, currentUser.getUsername(),
                currentUser.getDomain(), day);
        } else {
            mailDigestRepository.unsubscribeFromDigest(DigestType.DAILY_DIGEST, currentUser.getUsername(),
                currentUser.getDomain(), day);
        }

        log.debug("Updating daily digest preferences : dailyDigest={} for user {}", registration, currentUser.getUsername());
        try {
            userRepository.save(currentUser);
        } catch (ConstraintViolationException cve) {
            log.info("Constraint violated while updating preferences : " + cve);
            throw cve;
        }
    }

    /**
     * Return a collection of Users based on their email addresses (ie : uid)
     *
     * @param emails the collection : must not be null
     * @return a Collection of User
     */
    public Collection<User> getUsersByEmail(Collection<String> emails) {
        final Collection<User> users = new ArrayList<User>();
        User user;
        for (String email : emails) {
            user = userRepository.findOneByEmail(email).get();
            if (user != null) {
                users.add(user);
            }
        }
        return users;
    }
}
