package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import javax.inject.Inject;

import me.prettyprint.hector.api.exceptions.HInvalidRequestException;

import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;

public class CounterServiceTest extends AbstractCassandraTatamiTest {

    @Inject
    public CounterService counterService;

    @Test
    public void shouldGetACounterServiceInjected() {
        assertThat(counterService, notNullValue());
    }

    @Test(expected=HInvalidRequestException.class)
    public void shouldNotGetFollowersCounterWithEmptyValue() {
    	counterService.getFriendsCounter("");
    }
    
    @Test(expected=HInvalidRequestException.class)
    public void shouldNotGetFollowersCounterWithNullValue() {
    	counterService.getFriendsCounter(null);
    }
    
    @Test
    public void shouldGetFollowersCounter() {
    	assertThat(counterService.getFriendsCounter("jdubois"), is(4L));
    }
    
    @Test
    public void shouldGetZeroFollowersCounter() {
    	assertThat(counterService.getFriendsCounter("userToForget"), is(0L));
    }
    
    @Test(expected=NullPointerException.class)
    public void shouldNotGetFollowersCounterWithANonExistedUser() {
    	assertThat(counterService.getFriendsCounter("teszerorororocolan"), is(3L));
    }
    
    @Test
    public void shouldGetAtLeastAPopularUser() {
    	assertThat(counterService.getTheMostPopularUser(), notNullValue());
    }
    
    @Test
    public void shouldGetTheMostPopularUser() {
    	assertThat(counterService.getTheMostPopularUser(), is("jdubois"));
    }
}