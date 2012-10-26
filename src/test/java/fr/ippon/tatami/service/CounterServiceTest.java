package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import javax.inject.Inject;

import junit.framework.Assert;

import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.repository.CounterRepository;

public class CounterServiceTest extends AbstractCassandraTatamiTest{
	
	private final String login = "uuser@ippoon.fr";
	
	@Inject
    public CounterService counterService;
	
	@Inject
    public CounterRepository counterRepository;
	
	@Test
	public void shouldGetCounterServiceInjected(){
		assertThat(counterService, notNullValue());
	}
	
	@Test
	public void shouldGetCounterRepositoryInjected(){
		assertThat(counterRepository, notNullValue());
	}

	@Test
	public void shouldgetNbStatus() {
		Long nb =  counterService.getNbStatus(login);
    	assertThat(nb,notNullValue());
    	Assert.assertTrue(nb instanceof Long);
    }

   @Test
	public void ShouldgetNbFollowed() {
        Long nb = counterService.getNbFollowed(login);
        assertThat(nb,notNullValue());
        Assert.assertTrue(nb instanceof Long);
    }

    @Test
    public void ShouldgetNbFollowers() {
        Long nb = counterService.getNbFollowers(login);
        assertThat(nb,notNullValue());
        Assert.assertTrue(nb instanceof Long);
    }

}
