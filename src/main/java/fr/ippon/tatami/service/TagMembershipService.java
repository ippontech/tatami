package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.TagFollowerRepository;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Manages the tag memberships.
 * <p/>
 * - A tag follower is someone who follows a tag
 * - A user tag is a tag followed by a user
 *
 * @author Julien Dubois
 */
@Service
public class TagMembershipService {

    private final Logger log = LoggerFactory.getLogger(TagMembershipService.class);

    @Inject
    private TagFollowerRepository tagFollowerRepository;

    @Inject
    private UserTagRepository userTagRepository;

    @Inject
    private AuthenticationService authenticationService;

    public boolean followTag(Tag tag) {
        log.debug("Following tag : {}", tag);
        User currentUser = authenticationService.getCurrentUser();
        for (String alreadyFollowingTest : userTagRepository.findTags(currentUser.getLogin())) {
            if (alreadyFollowingTest.equals(tag.getName())) {
                log.debug("User {} already follows tag {}", currentUser.getLogin(), tag);
                return false;
            }
        }
        String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
        userTagRepository.addTag(currentUser.getLogin(), tag.getName());
        tagFollowerRepository.addFollower(domain, tag.getName(), currentUser.getLogin());
        log.debug("User " + currentUser.getLogin() +
                " now follows tag " + tag);

        return true;
    }

    public boolean unfollowTag(Tag tag) {
        log.debug("Removing followed tag : {}", tag);
        User currentUser = authenticationService.getCurrentUser();
        boolean tagAlreadyFollowed = false;
        for (String alreadyFollowingTest : userTagRepository.findTags(currentUser.getLogin())) {
            if (alreadyFollowingTest.equals(tag.getName())) {
                tagAlreadyFollowed = true;
            }
        }
        if (tagAlreadyFollowed) {
            String domain = DomainUtil.getDomainFromLogin(currentUser.getLogin());
            userTagRepository.removeTag(currentUser.getLogin(), tag.getName());
            tagFollowerRepository.removeFollower(domain, tag.getName(), currentUser.getLogin());
            log.debug("User " + currentUser.getLogin() +
                    " has stopped following tag " + tag);

            return true;
        } else {
            return false;
        }
    }
}
