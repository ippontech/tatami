package fr.ippon.tatami.service;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import fr.ippon.tatami.repository.CounterRepository;

/**
 * Manages the application's counters.
 *
 * @author François Descamps
 */
@Service
public class CounterService {

    @Inject
    private CounterRepository counterRepository;

    public long getFriendsCounter(String login){
    	return counterRepository.getFriendsCounter(login);
    }
    
    public long getNbTweets(String login){
    	return counterRepository.getTweetCounter(login);
    }
    
    public long getNbFollowed(String login){
    	return counterRepository.getFriendsCounter(login);
    }
    
    public long getNbFollowers(String login){
    	return counterRepository.getFollowersCounter(login);
    }
}
