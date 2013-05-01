package fr.ippon.tatami.uitest

import pages.*
import pages.google.*
import spock.lang.Shared
import fr.ippon.tatami.test.support.LdapTestServer
import fr.ippon.tatami.uitest.support.TatamiBaseGebSpec

class AuthenticationSpec extends TatamiBaseGebSpec {
	
	@Shared
	def newUid

	static LdapTestServer ldapTestServer
	def setupSpec() {
		// It only works if Tatami server is on the same host as the test ...
		// AND tatami server points to localhost to reach the ldap server !
		// TODO : fix tatami configuration !
		// TODO : put this into maven
		ldapTestServer = new LdapTestServer();
		ldapTestServer.start();
		
		newUid = "john_doe_${new Date().time}".toString()
		ldapTestServer.replaceAttribute("cn=john_doe,dc=ippon,dc=fr", "uid", newUid)
		
		println "ldap entry patched"
		
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
	
	// auto-registration with ldap : 
	def "login as normal new user with ldap"() {
				
		given:
		to LoginPage
		verifyAt()
		
		when:
		def username = "$newUid@ippon.fr"
		loginForm.with {
//			j_username = "john_doe@ippon.fr"
			j_username = username 
			j_password = "john"
		}
		 
		and:
		loginButton.click()
		 
		then:
		waitFor { at HomePage }
		
        newUserWizard.isPresent()
        // TODO : fill wizards
		
		! adminLink.isPresent()
		if(realBrowser()) {
			// doesn't work with htmlDriver (when javascript is disabled at least) :
			assert updateStatus !=null
		}
	}
	
	// TODO : should we explicitly test that new openid user can login (auto-registration) ?
	
	def "login as normal existing user with google"() {
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
		

		when: "Authorize localhost to receive openid authentication on google" 
		rememberChoicesCB.value(false)
		approveButton.click()
		 
		then:
		waitFor { at HomePage } // Note : If it's a new user, the "new user wizard" will also shows up ... 
		! adminLink.isPresent()
	
	}
	
}