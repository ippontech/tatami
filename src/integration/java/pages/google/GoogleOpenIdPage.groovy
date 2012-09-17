package pages.google

import geb.Page

class GoogleOpenIdPage extends Page {

	static at = {
		approveButton.isPresent()
	}
	
	static content = {
		loginForm { $("form") }		
		rememberChoicesCB { $("input#remember_choices_checkbox") }
		approveButton { $("#approve_button") }
	}
}
