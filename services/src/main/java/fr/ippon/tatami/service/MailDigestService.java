package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.DigestType;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.MailDigestRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;

/**
 * This service generates digest emails for subscribed users.
 *
 * @author Pierre Rust
 */
@Service
public class MailDigestService {

    private static final Logger log = LoggerFactory.getLogger(MailDigestService.class);

    private final static int MAX_STATUS_DAILY_DIGEST = 10;
    private final static int MAX_STATUS_WEEKLY_DIGEST = 10;

    @Inject
    private MailDigestRepository mailDigestRepository;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private TimelineService timelineService;

    @Inject
    private MailService mailService;

    @Inject
    private SuggestionService suggestionService;

    /**
     * Sends daily digest. Must be run every day
     */
    @Scheduled(cron = "0 0 22 * * ?")
    public void dailyDigest() {
        log.info("Starting Daily digest mail process ");
        Set<Domain> domains = domainRepository.getAllDomains();

        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));

        for (Domain d : domains) {
            log.info("Sending daily digest for domain {} and day {}", d, day);
            int pagination = 0;
            List<String> logins;
            do {
                logins = mailDigestRepository.getLoginsRegisteredToDigest(
                        DigestType.DAILY_DIGEST, d.getName(), day, pagination);
                pagination = pagination + logins.size();

                for (String login : logins) {
                    try {
                        handleDailyDigestPageForLogin(login);
                    } catch (Exception e) {
                        log.warn("An error has occured when generating daily digest for user " + login + ": " + e.getMessage());
                        StringWriter stack = new StringWriter();
                        PrintWriter pw = new PrintWriter(stack);
                        e.printStackTrace(pw);
                        log.debug("{}", stack.toString());
                    }
                }
            } while (logins.size() > 0);
        }
    }

    /**
     * Sends weekly digest.
     * <p/>
     * Will run every mondayday and send mails to all registered users
     * <p/>
     * If this is too many mails, this method could be tuned to
     * distribute the load on every day of the week by only sending
     * mails to users who have subscribed that same day.
     */
    @Scheduled(cron = "0 0 01 ? * MON")
    public void weeklyDigest() {
        log.info("Starting Weekly digest mail process ");

        Set<Domain> domains = domainRepository.getAllDomains();

        // sent digest for all domains
        // for users that have register any day of the week
        for (int i = 1; i < 8; ++i) {
            String day = String.valueOf(i);

            for (Domain d : domains) {
                log.info("Sending weekly digest for domain {} and day {}", d, i);
                int pagination = 0;
                List<String> logins;
                do {
                    logins = mailDigestRepository.getLoginsRegisteredToDigest(
                            DigestType.WEEKLY_DIGEST, d.getName(),
                            day, pagination);
                    pagination = pagination + logins.size();

                    for (String login : logins) {
                        try {
                            handleWeeklyDigestPageForLogin(login);
                        } catch (Exception e) {
                            log.warn("An error has occured when generating weekly digest for user " + login + ": " + e.getMessage());
                            StringWriter stack = new StringWriter();
                            PrintWriter pw = new PrintWriter(stack);
                            e.printStackTrace(pw);
                            log.debug("{}", stack.toString());
                        }
                    }
                } while (logins.size() > 0);
            }
        }
    }

    /**
     * Fetch all necessary info for a daily digest mail
     * and delegate the sending operation to mailService.
     */
    private void handleDailyDigestPageForLogin(String login) {
        log.info("Preparing weekly digest for user " + login);

        User user = userRepository.findUserByLogin(login);

        // we want statuses for the past 24 hours
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -1);
        Date yesterday = cal.getTime();

        List<StatusDTO> digestStatuses = new ArrayList<StatusDTO>(MAX_STATUS_DAILY_DIGEST);
        int nbStatusTotal = getStatusesForDigest(user, yesterday, MAX_STATUS_DAILY_DIGEST, digestStatuses);

        Collection<User> suggestedUsers = suggestionService.suggestUsers(user.getLogin());

        // TODO : we could look for popular messages
        // especially if the user
        // does not have anything in it's timeline and there are no suggested users for him

        mailService.sendDailyDigestEmail(user, digestStatuses, nbStatusTotal, suggestedUsers);
    }

    /**
     * Fetch all necessary info for a weekly digest mail
     * and delegate the sending operation to mailService.
     */
    private void handleWeeklyDigestPageForLogin(String login) {
        log.info("Preparing weekly digest for user " + login);

        User user = userRepository.findUserByLogin(login);

        // we want statuses for the past week
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -7);
        Date lastWeek = cal.getTime();

        List<StatusDTO> digestStatuses = new ArrayList<StatusDTO>(MAX_STATUS_WEEKLY_DIGEST);
        int nbStatusTotal = getStatusesForDigest(user, lastWeek, MAX_STATUS_WEEKLY_DIGEST, digestStatuses);


        Collection<User> suggestedUsers = suggestionService.suggestUsers(user.getLogin());
        Collection<Group> suggestedGroups = suggestionService.suggestGroups(user.getLogin());

        mailService.sendWeeklyDigestEmail(user, digestStatuses, nbStatusTotal,
                suggestedUsers, suggestedGroups);
    }

    /**
     * Build a list containing an extract of the status from an user timeline,
     * except its own, since a given date.
     *
     * @param user           the user
     * @param since_date     date since
     * @param nbStatus       number of status to include in the extract
     * @param digestStatuses selected status will be added to this list (ordered by date)
     * @return the number of statuses
     */
    private int getStatusesForDigest(final User user, final Date since_date,
                                     int nbStatus, List<StatusDTO> digestStatuses) {
        String finish = null;
        boolean dateReached = false;
        List<StatusDTO> allStatuses = new ArrayList<StatusDTO>(50);

        // collect all statuses since 'since_date' from the timeline
        while (!dateReached) {
            Collection<StatusDTO> statuses = timelineService.getUserTimeline(user.getLogin(), 200, null, finish);
            statuses.size();
            int count = 0;
            if (statuses.isEmpty()) {
                dateReached = true;
            }

            for (StatusDTO status : statuses) {
                if (status.getStatusDate().before(since_date)) {
                    dateReached = true;
                    break;
                } else {
                    // Do not includes user's own status in digest
                    if (!status.getUsername().equals(user.getUsername())) {
                        allStatuses.add(status);
                    }
                }
                count++;
                if (count == statuses.size() && !dateReached) {
                    finish = status.getStatusId();
                }
            }
        }

        int nbStatusTotal = allStatuses.size();
        if (nbStatusTotal > 0) {

            // now select some of theses statuses
            if (allStatuses.size() > nbStatus) {
                Collections.shuffle(allStatuses);
                digestStatuses.addAll(allStatuses.subList(0, nbStatus));
                Collections.sort(digestStatuses, new Comparator<StatusDTO>() {
                    @Override
                    public int compare(StatusDTO statusDTO, StatusDTO statusDTO2) {
                        return statusDTO.getStatusDate().compareTo(statusDTO2.getStatusDate());
                    }
                });
            } else {
                digestStatuses.addAll(allStatuses);
            }
        }
        return nbStatusTotal;
    }
}
