package fr.ippon.tatami.uitest

import org.junit.Assume;

import geb.Page
import geb.spock.GebSpec

import pages.*
import pages.google.GoogleAuthenticationPage;
import pages.google.GoogleOpenIdPage;

class AuthenticationSpec extends TatamiBaseGebSpec {
		
	static {
		
		// TODO : il doit y avoir un moyen plus simple/propre de choisir le driver : (cf GebConfig aussi)
		// by default we use HtmlUnit (cf GebConfig.groovy )
		
		if(!System.getProperty('gev.env')) {
//			System.setProperty('geb.env',"chrome")
			System.setProperty('geb.env',"firefox")
		}
	}
	
    def "login as admin with ldap"() {
        given:
        to LoginPage
        verifyAt() 
		
        when:
        loginForm.with {
            j_username = "tatami@ippon.fr"
            j_password = "ippon"
        }
         
        and:
        loginButton.click()
		
        then:
        waitFor { at HomePage }
		
		and:
		adminLink.isPresent();
		
    }
	
	// TODO : test new ldap user can login ... (auto-registration) 
	
	def "login as normal user with ldap"() {
		given:
		to LoginPage
		verifyAt()
		
		when:
		loginForm.with {
			j_username = "john_doe@ippon.fr"
			j_password = "john"
		}
		 
		and:
		loginButton.click()
		 
		then:
		waitFor { at HomePage }
		
		and:
		! adminLink.isPresent()
		
		and:
		if(realBrowser()) {
			// doesn't work with htmlDriver (when javascript is disabled at least) :
			assert updateStatus !=null
		}
	}
	
	// TODO : test new openid user can login ... (auto-registration)
	
	def "login as normal user with google"() {
		given:
		to LoginPage
		verifyAt()
		// and google account not accepting localhost ...
		// assert user not in database ?
				
		when:
		googleButton.click()
	
		// Login at google :
		waitFor { at GoogleAuthenticationPage }
		loginForm.with {
			Email = "farrault@ippon.fr"
			Passwd = System.getProperty("mypassord");
		}
		loginButton.click()
		
		// Authorize localhost on google :
		waitFor { at GoogleOpenIdPage } 
		rememberChoicesCB.value(false)
		approveButton.click()
		 
		then:
		at HomePage
		
		and:
		! adminLink.isPresent()
	
	}
}