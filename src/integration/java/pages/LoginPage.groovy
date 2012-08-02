package pages
 
import geb.Page
 
class LoginPage extends Page {
    static url = "tatami/login"
 
    static at = { $("h1").text() in ["Presentation","Présentation"] } // TODO : avec htmlunit je suis en anglais et avec un navigateur en Français ...
 
    static content = {
        loginForm { $("#loginForm") }
		loginButton { $("#loginButton") }
		googleForm { ${"#googleForm"} }
		googleButton { $("#proceed_google") }
    }
}