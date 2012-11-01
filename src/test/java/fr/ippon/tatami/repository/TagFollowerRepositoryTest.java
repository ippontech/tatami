package fr.ippon.tatami.repository;

import fr.ippon.tatami.AbstractCassandraTatamiTest;

/**
 * Created with IntelliJ IDEA.
 * User: dygcao
 * Date: 29/10/12
 * Time: 21:33
 * To change this template use File | Settings | File Templates.
 */
public class TagFollowerRepositoryTest extends AbstractCassandraTatamiTest {

    @Inject
    public TagFollowerRepository tagFollowerRepository;

           @Test
           public void shouldGetAStatusRepositoryInjected() {
                assertThat(tagFollowerRepository, notNullValue());
           }

           @Test
           public void shouldAddFollower() {
                   String domain = "ippon.fr";
                   String login = "jdubois@ippon.fr";
                   String tag = "jdubois";
                   assertThat(tagFollowerRepository.addFollower(domain, tag, login), notNullValue());
           }

           @Test(expected = ValidationException.class)
           public void shouldNotAddFollowerBecauseLoginNull() {
                   String domain = "ippon.fr";
                   String login = null;
                   String tag = "jdubois";

                   tagFollowerRepository.addFollower(domain,login, tag);
           }
}