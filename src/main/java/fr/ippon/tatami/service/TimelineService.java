package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.OpenId;
import fr.ippon.tatami.domain.Tweet;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.OpenIdRepository;
import fr.ippon.tatami.repository.TweetRepository;
import fr.ippon.tatami.repository.UserRepository;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Manages the the timeline.
 *
 * @author Julien Dubois
 */
@Service
public class TimelineService {

    @Inject
    private UserService userService;

    @Inject
    private TweetRepository tweetRepository;

    public void postTweet(String content) {
        User currentUser = userService.getCurrentUser();
        Tweet tweet = tweetRepository.createTweet(currentUser.getEmail(), content);
        tweetRepository.addTweetToUserline(tweet);
        tweetRepository.addTweetToTimeline(currentUser.getEmail(), tweet);
    }

    public Collection<Tweet> getTimeline() {
        User currentUser = userService.getCurrentUser();
        Collection<String> tweetIds = tweetRepository.getTimeline(currentUser.getEmail());
        Collection<Tweet> tweets = new ArrayList<Tweet>();
        for (String tweedId : tweetIds) {
            tweets.add(tweetRepository.findTweetById(tweedId));
        }
        return tweets;
    }
}
