package fr.ippon.tatami.service;

import fr.ippon.tatami.repository.CounterRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Manages the application's counters.
 *
 * @author François Descamps
 */
@Service
public class CounterService {

    @Inject
    private CounterRepository counterRepository;

    /**
     * @param login
     * @return
     */
    public long getNbStatus(String login) {
        return counterRepository.getStatusCounter(login);
    }

    /**
     * @param login
     * @return
     */
    public long getNbFollowed(String login) {
        return counterRepository.getFriendsCounter(login);
    }

    /**
     * Description de la méthode.
     * @param login
     * Description du login
     * @return
     * Description du return
     */
    public long getNbFollowers(String login) {
        return counterRepository.getFollowersCounter(login);
    }
}
