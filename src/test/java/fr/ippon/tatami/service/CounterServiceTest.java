package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import javax.inject.Inject;

import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.repository.CounterRepository;

public class CounterServiceTest extends AbstractCassandraTatamiTest{
	
	@Inject
    public CounterService CounterService;
	
	@Inject
    private CounterRepository counterRepository;
	
	@Test
	public void shouldGetCounterServiceInjected(){
		assertThat(CounterService, notNullValue());
	}
	
	@Test
	public void shouldGetCounterRepositoryInjected(){
		assertThat(counterRepository, notNullValue());
	}
	
//    public long shouldgetNbStatus(String login) {
//    	assert 
//    	return counterRepository.getStatusCounter(login);
//    }

//    public long ShouldgetNbFollowed(String login) {
//        return counterRepository.getFriendsCounter(login);
//    }
//
//    public long ShouldgetNbFollowers(String login) {
//        return counterRepository.getFollowersCounter(login);
//    }

}
