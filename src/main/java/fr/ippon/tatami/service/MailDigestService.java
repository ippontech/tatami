package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.DigestType;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.repository.MailDigestRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;

/**
 *
 * @author Pierre Rust
 */
@Service
public class MailDigestService {

    private static final Log log = LogFactory.getLog(MailDigestService.class);

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




    //@Scheduled(cron="*/5 * * * * MON-FRI")
    // FIXME for test only, every 5 sec
    @Scheduled(fixedRate=5000)
    public void dailyDigest() {
        Set<Domain> domains =  domainRepository.getAllDomains();

        for (Domain d : domains) {

            int pagination = 0;

            List<String> logins;
            do {
                logins = mailDigestRepository.getLoginsRegisteredToDigest(
                    DigestType.DAILY_DIGEST, d.getName(), pagination);
                pagination = pagination + logins.size();

                for (String login : logins ) {
                    handleDailyDigestPageForLogin(login);
                }

            } while (logins.size() >0 );
        }
    }

    /**
     * fetch all necessary info for a daily digest mail
     * and delegate the sending operation to mailService
     *
     * @param login
     */
    private void handleDailyDigestPageForLogin(String login) {
        User user = userRepository.findUserByLogin(login);

        // we want statuses for the past 24 hours
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -1);
        Date yesterday = cal.getTime();

        List<StatusDTO> digestStatuses = null;
        int nbStatusTotal = getStatusesForDigest(user, yesterday, MAX_STATUS_DAILY_DIGEST, digestStatuses);

        Collection<User>  suggestedUsers = suggestionService.suggestUsers(user.getLogin());

        mailService.sendDailyDigestEmail(user, digestStatuses, nbStatusTotal, suggestedUsers);
    }

    /**
     * fetch all necessary info for a weekly digest mail
     * and delegate the sending operation to mailService
     *
     * @param login
     */
    private void handleWeeklyDigestPageForLogin(String login) {
        User user = userRepository.findUserByLogin(login);

        // we want statuses for the past week
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -7);
        Date lastWeek = cal.getTime();

        List<StatusDTO> digestStatuses = null;
        int nbStatusTotal = getStatusesForDigest(user, lastWeek, MAX_STATUS_WEEKLY_DIGEST, digestStatuses);


        Collection<User>  suggestedUsers = suggestionService.suggestUsers(user.getLogin());
        Collection<Group>  suggestedGroup = suggestionService.suggestGroups(user.getLogin());

        mailService.sendWeeklyDigestEmail(user, digestStatuses, nbStatusTotal,
                suggestedUsers, suggestedGroup);
    }

    /**
     * Build a list containing all the status from an user timeline, except it's own, since a given date.
     *
     * @param user
     * @param since_date
     * @param nbStatus
     * @param digestStatuses
     * @return
     */
    private int getStatusesForDigest( User user, Date since_date,
                                      int nbStatus, List<StatusDTO> digestStatuses) {
        String max_id = null;
        boolean dateReached = false;
        List<StatusDTO> allStatuses = new ArrayList<StatusDTO>(50);

        // collect all statuses since 'since_date' from te timeline
        do {
            Collection<StatusDTO> statuses = timelineService.getUserTimeline(user.getLogin(), 200, null, max_id);
            statuses.size();
            int count = 0;
            for (StatusDTO status : statuses )  {

                if (status.getStatusDate().before(since_date)) {
                    dateReached = true;
                    break;
                }   else {
                    // Do not includes user's own status in digest
                    if ( ! status.getUsername().equals(user.getUsername()))
                    {
                        allStatuses.add( status);
                    }
                }
                count++;
                if (count == statuses.size() && !dateReached) {
                    max_id = status.getStatusId();
                }
            }
        } while (! dateReached);

        int nbStatusTotal = allStatuses.size();
        if (nbStatusTotal > 0 ) {

            // now select some of theses statuses
            if (allStatuses.size()> nbStatus) {
                Collections.shuffle(allStatuses);
                digestStatuses = allStatuses.subList(0, nbStatus);
                Collections.sort(digestStatuses, new Comparator<StatusDTO>() {
                    @Override
                    public int compare(StatusDTO statusDTO, StatusDTO statusDTO2) {
                        return statusDTO.getStatusDate().compareTo(statusDTO2.getStatusDate());
                    }
                });
            } else  {
                digestStatuses = allStatuses;
            }
        }

        return nbStatusTotal;
    }

}
