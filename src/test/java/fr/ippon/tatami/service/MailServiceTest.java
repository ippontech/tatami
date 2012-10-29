package fr.ippon.tatami.service;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.*;
import static org.junit.Assert.assertThat;

import java.io.IOException;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Store;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.springframework.core.env.Environment;

import fr.ippon.tatami.AbstractCassandraTatamiTest;
import fr.ippon.tatami.domain.User;

public class MailServiceTest extends AbstractCassandraTatamiTest {
	
	
		private static final Log log = LogFactory.getLog(MailService.class);
		
	 	@Inject
	    public MailService mailService;
	 	
	 	@Inject
	    private Environment env;
	 	 
	 	private String tatamiUrl;
	 	
	 	
	 	
	 	 @PostConstruct
	     public void init() {

	         this.tatamiUrl = env.getProperty("tatami.url");
	     }
	 	
	 	

	    @Test
	    public void shouldGetAMailServiceInjected() {
	        assertThat(mailService, notNullValue());
	    }
	    
	    
	    
	    @Test
	    public void shouldSendRegistrationEmail() {
	    	
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
	        
	    	mailService.sendRegistrationEmail(registrationKey,user);
	    	
	    	
	    	
	    	Session session = Session.getDefaultInstance(new Properties());
	    	
	    	
	    
	    		Store store;
				try {
					store = session.getStore("pop3");
				
	    		try {
					store.connect(user.getDomain(),user.getUsername(), "password");
					
					Folder folder = store.getFolder("inbox");

		    		folder.open(Folder.READ_ONLY);
		    		Message[] msg = folder.getMessages();

		    		assertTrue(msg.length == 1);
		    	
		    		assertEquals(subject, msg[0].getSubject());
		    		try {
						assertEquals(text, msg[0].getContent());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
		    		folder.close(true);
		    		store.close();
				} catch (MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				}
				catch (NoSuchProviderException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
	    		

	    	
	    	
	    }
	    
	    @Test
	    public void shouldSendLostPasswordEmail() {
	    	
	    }
	    
	    @Test
	    public void shouldSendValidationEmail() {
	    	
	    }

}
