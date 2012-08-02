package pages

import geb.Page;

class HomePage extends Page {
    static url = "tatami/"
 
    static at = { /* Thread.sleep(10);*/ profileContent != null } // sometimes I got an error here ?!
 
    static content = {
      profileContent { $("div#profileContent") }
	  // les contenus ci-dessous ne sont accessibles qu'avec le javascript puisque les div sont chargés vides ...
      updateStatus { $("input",value:"Update your status") }
	  dropDownMenu { $("ul.dropdown-menu") } // <ul class="dropdown-menu">
	  adminLink(required: false) {
		  // <a href="/tatami/admin"> // href returns absolute url so we need to filter with endsWith ...
		  dropDownMenu.find("a",href:endsWith('/tatami/admin')) 
	  }
    }
}