package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import javax.inject.Inject;

import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;

public class MailServiceTest extends AbstractCassandraTatamiTest {
	
	 @Inject
	    public MailService mailService;

	    @Test
	    public void shouldGetAMailServiceInjected() {
	        assertThat(mailService, notNullValue());
	    }
	    
	    @Test
	    public void shouldSendRegistrationEmail() {
	    	
	    	String subject = "Tatami activation";
	       // String url = tatamiUrl + "/tatami/register?key=" + registrationKey;
	    	
	    }
	    
	    @Test
	    public void shouldSendLostPasswordEmail() {
	    	
	    }
	    
	    @Test
	    public void shouldSendValidationEmail() {
	    	
	    }

}
