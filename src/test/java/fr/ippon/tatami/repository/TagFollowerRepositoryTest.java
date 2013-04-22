package fr.ippon.tatami.repository;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import org.junit.Test;

import javax.inject.Inject;
import java.util.Collection;

import static org.junit.Assert.assertEquals;

public class TagFollowerRepositoryTest extends AbstractCassandraTatamiTest {

    @Inject
    public TagFollowerRepository tagFollowerRepository;

    @Test
    public void addNewFollowerForTag() {
        String domain = "ippon.fr";
        String login = "jdubois@ippon.fr";
        String tag = "tag";
        Collection<String> followers = tagFollowerRepository.findFollowers(domain, tag);
        assertEquals(0, followers.size());
        tagFollowerRepository.addFollower(domain, tag, login);
        followers = tagFollowerRepository.findFollowers(domain, tag);
        assertEquals(1, followers.size());
        assertEquals(login, followers.iterator().next());
    }
}