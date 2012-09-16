package fr.ippon.tatami.uitest

import fr.ippon.tatami.test.support.LdapTestServer;
import fr.ippon.tatami.uitest.support.TatamiBaseGebSpec;
import geb.Page
import geb.spock.GebSpec

import pages.*
import pages.google.*;

class AuthenticationSpec extends TatamiBaseGebSpec {
	
	static LdapTestServer ldapTestServer
	def setupSpec() {
		// It only works if Tatami server is on the same host as the test ...
		// AND tatami server points to localhost to reach the ldap server !
		// TODO : fix tatami configuration !
		// TODO : put this into maven
		ldapTestServer = new LdapTestServer();
		ldapTestServer.start();
	}
	
	def cleanupSpec() {
		ldapTestServer.stop();
		ldapTestServer = null;
	}
			
    def "login as admin with ldap"() {
        given:
        to LoginPage
        verifyAt() 
		
        when:
        loginForm.with {
            j_username = "jdubois@ippon.fr"
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
		
		! adminLink.isPresent()
		
		if(realBrowser()) {
			// doesn't work with htmlDriver (when javascript is disabled at least) :
			assert updateStatus !=null
		}
	}
	
	// TODO : should we explicitly test that new openid user can login (auto-registration) ?
	
	def "login as normal user with google"() {
		given:
		def googleEmail = System.getProperty("google.email")
		def googlePassword = System.getProperty("google.password")
		assert googleEmail !=null
		assert googlePassword !=null
		to LoginPage
		verifyAt()
		// and google account not already accepting localhost ...
				
		when: "click on goodle authentication button"
		googleButton.click()
		
		then :
		waitFor { at GoogleAuthenticationPage }
		
		when : "enter credentials on google"
		loginForm.with {
			Email = googleEmail
			Passwd = googlePassword
		}
		loginButton.click()
		
		then:
		waitFor { at GoogleOpenIdPage }
		

		when: "Authorize localhost to reveive openid authentication on google" 
		rememberChoicesCB.value(false)
		approveButton.click()
		 
		then:
		waitFor { at HomePage }
		! adminLink.isPresent()
	
	}
	
}