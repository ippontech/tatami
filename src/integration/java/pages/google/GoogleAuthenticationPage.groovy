package pages.google

import geb.Browser;
import geb.Page

class GoogleAuthenticationPage extends Page {

	static at = {
		loginForm.isPresent()
	}
	
	static content = {
		loginForm { $("form#gaia_loginform") }
		loginButton { $("input#signIn") }
	}
}
