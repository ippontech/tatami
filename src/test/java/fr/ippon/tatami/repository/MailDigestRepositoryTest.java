package fr.ippon.tatami.repository;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.DigestType;
import org.junit.Test;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.List;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

/**
 * @author Pierre Rust
 */
public class MailDigestRepositoryTest extends AbstractCassandraTatamiTest {


    @Inject
    public MailDigestRepository mailDigestRepository;


    @Test
    public void shouldGetAUserRepositoryInjected() {
        assertThat(mailDigestRepository, notNullValue());
    }


    @Test
    public void shouldInsertWeeklySubscription() {
        String login = "nuuser@ippon.fr";
        String domain = "ippon.fr";
        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));

        mailDigestRepository.subscribeToDigest(DigestType.WEEKLY_DIGEST, login, domain, day);

        List<String> logins = mailDigestRepository.getLoginsRegisteredToDigest(DigestType.WEEKLY_DIGEST, domain, day, 0);
        assertThat(logins, notNullValue());
        assertTrue(logins.contains(login));

    }


    @Test
    public void shouldInsertDailySubscription() {
        String digestType = "DAILY";
        String login = "nuuser@ippon.fr";
        String domain = "ippon.fr";
        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));


        mailDigestRepository.subscribeToDigest(DigestType.DAILY_DIGEST, login, domain, day);

        List<String> logins = mailDigestRepository.getLoginsRegisteredToDigest(DigestType.DAILY_DIGEST, domain, day, 0);
        assertThat(logins, notNullValue());
        assertTrue(logins.contains(login));

    }


    @Test
    public void shouldRemoveWeeklySubscription() {
        String login = "nuuser@ippon.fr";
        String domain = "ippon.fr";
        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));

        mailDigestRepository.unsubscribeFromDigest(DigestType.WEEKLY_DIGEST, login, domain, day);

        List<String> logins = mailDigestRepository.getLoginsRegisteredToDigest(DigestType.WEEKLY_DIGEST, domain, day, 0);
        assertThat(logins, notNullValue());
        assertTrue(!logins.contains(login));

    }


    @Test
    public void shouldRemoveDailySubscription() {
        String digestType = "DAILY";
        String login = "nuuser@ippon.fr";
        String domain = "ippon.fr";
        String day = String.valueOf(Calendar.getInstance().get(Calendar.DAY_OF_WEEK));

        mailDigestRepository.unsubscribeFromDigest(DigestType.DAILY_DIGEST, login, domain, day);

        List<String> logins = mailDigestRepository.getLoginsRegisteredToDigest(DigestType.DAILY_DIGEST, domain, day, 0);
        assertThat(logins, notNullValue());
        assertTrue(!logins.contains(login));

    }


}
