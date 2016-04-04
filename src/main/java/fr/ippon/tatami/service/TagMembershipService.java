package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.TagFollowerRepository;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.repository.UserTagRepository;
import fr.ippon.tatami.security.SecurityUtils;
import fr.ippon.tatami.service.util.DomainUtil;
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
        User currentUser = userRepository.findOneByUsername(SecurityUtils.getCurrentUser().getUsername()).get();
        for (String alreadyFollowingTest : userTagRepository.findTags(currentUser.getUsername())) {
            if (alreadyFollowingTest.equals(tag.getName())) {
                log.debug("User {} already follows tag {}", currentUser.getUsername(), tag);
                return false;
            }
        }
        String domain = DomainUtil.getDomainFromEmail(currentUser.getEmail());
        userTagRepository.addTag(currentUser.getUsername(), tag.getName());
        tagFollowerRepository.addFollower(domain, tag.getName(), currentUser.getUsername());
        log.debug("User " + currentUser.getUsername() +
                " now follows tag " + tag);

        return true;
    }

    public boolean unfollowTag(TagDTO tag) {
        log.debug("Removing followed tag : {}", tag);
        User currentUser = userRepository.findOneByUsername(SecurityUtils.getCurrentUser().getUsername()).get();
        boolean tagAlreadyFollowed = false;
        for (String alreadyFollowingTest : userTagRepository.findTags(currentUser.getUsername())) {
            if (alreadyFollowingTest.equals(tag.getName())) {
                tagAlreadyFollowed = true;
            }
        }
        if (tagAlreadyFollowed) {
            String domain = DomainUtil.getDomainFromEmail(currentUser.getEmail());
            userTagRepository.removeTag(currentUser.getUsername(), tag.getName());
            tagFollowerRepository.removeFollower(domain, tag.getName(), currentUser.getUsername());
            log.debug("User " + currentUser.getUsername() +
                    " has stopped following tag " + tag);

            return true;
        } else {
            return false;
        }
    }
}
