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

    public long getNbStatus(String login) {
        return counterRepository.getStatusCounter(login);
    }

    public long getNbFollowed(String login) {
        return counterRepository.getFriendsCounter(login);
    }

    public long getNbFollowers(String login) {
        return counterRepository.getFollowersCounter(login);
    }
}
