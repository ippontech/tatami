package pages
 
import geb.Page
 
class LoginPage extends Page {
    static url = "tatami/login"
 
    static at = { $("h1").text() == "Presentation" } // TODO : avec htmlunit je suis en anglais et avec un navigateur en Français ...
 
    static content = {
		
		errorAlert(required:false) { $("div.alert-error",text:contains("e-mail address is already in used")) }
		infoAlert(required:false) { $("div.alert-info",text:contains("registration e-mail")) }
		
		registrationForm { $("#registrationForm") }
		registrationButton { $("#registrationButton") }
		
        loginForm { $("#loginForm") }
		loginButton { $("#loginButton") }
//		googleForm { $("#googleForm") }
		googleButton { $("#proceed_google") }
    }
}