package pages

import geb.Page;

class HomePage extends TatamiBasePage {
    static url = "tatami/"
 
    static at = { profileContent != null } // sometimes I got an error here ?!
                // TODO : add " or newUserWizard != null" if necessary
 
    static content = {
		// défini dans la classe mère :
//		dropDownMenu
//    	adminLink

		profileContent { $("div#profileContent") }
	  
		// les contenus ci-dessous ne sont accessibles qu'avec le javascript puisque les div sont chargés vides ... // TODO : tjs vrai ?
		updateStatus { $("textarea#updateStatusContent") }
        
        newUserWizard { $("div#modal-welcome") }
		
    }
}