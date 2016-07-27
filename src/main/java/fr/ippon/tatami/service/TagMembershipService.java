package fr.ippon.tatami.service;

import fr.ippon.tatami.repository.TagFollowerRepository;
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

    public boolean followTag(TagDTO tag) {
        log.debug("Following tag : {}", tag);
        String email = SecurityUtils.getCurrentUserEmail();
        for (String alreadyFollowingTest : userTagRepository.findTags(email)) {
            if (alreadyFollowingTest.equals(tag.getName())) {
                log.debug("User {} already follows tag {}", email, tag);
                return false;
            }
        }
        String domain = DomainUtil.getDomainFromEmail(email);
        userTagRepository.addTag(email, tag.getName());
        tagFollowerRepository.addFollower(domain, tag.getName(), email);
        log.debug("User {} now follows tag {}", email, tag);

        return true;
    }

    public boolean unfollowTag(TagDTO tag) {
        log.debug("Removing followed tag : {}", tag);
        String email = SecurityUtils.getCurrentUserEmail();
        boolean tagAlreadyFollowed = false;
        for (String alreadyFollowingTest : userTagRepository.findTags(email)) {
            if (alreadyFollowingTest.equals(tag.getName())) {
                tagAlreadyFollowed = true;
            }
        }
        if (tagAlreadyFollowed) {
            String domain = DomainUtil.getDomainFromEmail(email);
            userTagRepository.removeTag(email, tag.getName());
            tagFollowerRepository.removeFollower(domain, tag.getName(), email);
            log.debug("User {} has stopped following tag {}", DomainUtil.getUsernameFromEmail(email), tag);

            return true;
        } else {
            return false;
        }
    }
}
