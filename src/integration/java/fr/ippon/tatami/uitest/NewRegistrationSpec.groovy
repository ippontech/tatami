package fr.ippon.tatami.uitest

import pages.*
import fr.ippon.tatami.uitest.support.TatamiBaseGebSpec

class NewRegistrationSpec extends TatamiBaseGebSpec {
	
	def "existing user can't register"() {
		given:
		to LoginPage
		verifyAt()
		def existingUserEmail = "john_doe@ippon.fr"
//		accountUtils.assertUserExists(existingUserEmail);
        accountUtils.createUserIfNecessary(existingUserEmail);
		// TODO : use org.cassandraunit.DataLoader instead to create user before the test ?
		
		when:
		registrationForm.email = existingUserEmail
		registrationButton.click()
		
		then:
		waitFor { at LoginPage }
		errorAlert.isPresent()
	}
	
    def "register with new user email"() {
        given:
        to LoginPage
        verifyAt() 
		def newUserEmail = "new_user_${new Date().time}@domain.fr"
		
        when: "Filling register form"
        registrationForm.email = newUserEmail
		and: "submit register form"
        registrationButton.click()
		
        then: "I'm at LoginPage with msg 'registration sent'"
        waitFor { at LoginPage }
		! errorAlert.isPresent()
		infoAlert.isPresent()
		
		when: "Clicking on registration link (normally sent by email)"
		def registrationKey = registrationUtils.getRegistrationKeyByLogin(newUserEmail)
//		go "tatami/register?key=$registrationKey"
		to([key:registrationKey], EmailVerifiedPage)
		verifyAt()
		
		then: "New user exist in DB"
		accountUtils.assertUserExists(newUserEmail);
		
		// TODO : just testing for existence of user in DB is ok or should I try to log ? how ? password is encrypted in database
//		when: "Login with newly generated password"
//		
//		to LoginPage
//		verifyAt()
//		password = "" // read or set in database ... 
//		loginForm.with {
//			j_username = newUserEmail
//			j_password = password
//		}
//		loginButton.click()
//		 
//		then:
//		waitFor { at HomePage }
//		
    }
	
}