package pages

import geb.Page;

class TatamiBasePage extends Page {

	static content = {
		dropDownMenu { $("ul.dropdown-menu") } // <ul class="dropdown-menu">
		adminLink(required: false) {
			// <a href="/tatami/admin"> // href returns absolute url so we need to filter with endsWith ...
			dropDownMenu.find("a",href:endsWith('/tatami/admin'))
		}
	}
	
}
