package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.jvnet.mock_javamail.Mailbox;
import org.springframework.core.env.Environment;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;

public class MailServiceTest extends AbstractCassandraTatamiTest {
	
	
		private static final Log log = LogFactory.getLog(MailService.class);
		
	 	@Inject
	    public MailService mailService;
	 	

	 	
	 	@Inject
	    private Environment env;

	    private String host;

	    private int port;

	    private String smtpUser;

	    private String smtpPassword;

	    private String from;

	    private String tatamiUrl;
	 	
	 	 @PostConstruct
	     public void init() {
	 		this.host = env.getProperty("smtp.host");
	        this.port = env.getProperty("smtp.port", Integer.class);
	        this.smtpUser = env.getProperty("smtp.user");
	        this.smtpPassword = env.getProperty("smtp.password");
	        this.from = env.getProperty("smtp.from");
	        this.tatamiUrl = env.getProperty("tatami.url");
	     }
	 	
	 	

	    @Test
	    public void shouldGetAMailServiceInjected() {
	        assertThat(mailService, notNullValue());
	    }
	    
	    
	    
	    @Test
	    public void shouldSendRegistrationEmail() throws MessagingException, IOException {
	    	
	    	User user = constructAUser("uuser@ippon.fr", "uuser", "UpdatedLastName");
	    	String registrationKey = "edzkubqs1234";
	    	String subject = "Tatami activation";
	    	String url = tatamiUrl + "/tatami/register?key=" + registrationKey;
	    	
	    	String text = "Dear "
	                  + user.getLogin()
	                  + ",\n\n"
	                  + "Your Tatami account has been created, please click on the URL below to activate it : "
	                  + "\n\n"
	                  + url
	                  + "\n\n"
	                  + "Regards,\n\n" + "Ippon Technologies.";
	        
		MailService mailS = new MailService();
		
		mailS.sendRegistrationEmail(registrationKey, user);
	    	
		List<Message> inbox;
		try {
			inbox = Mailbox.get(user.getLogin());
			assertTrue(inbox.size() == 1);
			assertEquals(subject, inbox.get(0).getSubject());
			assertEquals(text, inbox.get(0).getContent());
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
    	
	    	
	    }
	    
	    @Test
	    public void shouldSendLostPasswordEmail() {
	    	
	    }
	    
	    @Test
	    public void shouldSendValidationEmail() {
	    	
	    }

}
