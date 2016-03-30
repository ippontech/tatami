package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.TagFollowerRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.web.rest.util.DomainUtil;
import fr.ippon.tatami.web.rest.dto.TagDTO;
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
    private UserRepository userRepository;

    public boolean followTag(TagDTO tag) {
        log.debug("Following tag : {}", tag);
        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
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

    public boolean unfollowTag(TagDTO tag) {
        log.debug("Removing followed tag : {}", tag);
        User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
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
