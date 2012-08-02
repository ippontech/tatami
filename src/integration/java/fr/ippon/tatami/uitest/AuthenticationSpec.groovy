package fr.ippon.tatami.uitest

import geb.Page
import geb.spock.GebSpec

import pages.*

class AuthenticationSpec extends TatamiBaseGebSpec {
		
	static {
		
		// TODO : il doit y avoir un moyen plus simple/propre de choisir le driver : (cf GebConfig aussi)
		// by default we use HtmlUnit (cf GebConfig.groovy )
		
//		if(!System.getProperty('gev.env')) {
////			System.setProperty('geb.env',"chrome")
//			System.setProperty('geb.env',"firefox")
//		}
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
        at HomePage
		
		and:
		assert dropDownMenu
		assert adminLink
		
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
		at HomePage
		
		and:
		assert ! adminLink
		
		and:
		if(realBrowser()) {
			// doesn't work with htmlDriver (when javascript is disabled at least) :
			assert updateStatus !=null
		}
	}
	
	// TODO : test new openid user can login ... (auto-registration)
	
//	def "login as normal user with google"() {
//		given:
//		to LoginPage
//		verifyAt()
//		
//		// assert user not in database ?
//		
//		when:
//		googleForm.with {
//			j_username = "farrault@ippon.fr"
//		}
//		 
//		and:
//		googleButton.click()
//		
//		then :
//		// TODO : login on google ?
//		// TODO : authorize localhost on google ?
//		 
//		then:
//		at HomePage
//		
//		and:
//		assert ! adminLink
//	
//	}
}