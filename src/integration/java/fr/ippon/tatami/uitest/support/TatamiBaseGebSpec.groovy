package fr.ippon.tatami.uitest.support;

import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import geb.spock.GebSpec;

public abstract class TatamiBaseGebSpec extends GebSpec {
	
	static {
//		// TODO : il doit y avoir un moyen plus simple/propre de choisir le driver : (cf GebConfig aussi)
//		// by default we use HtmlUnit (cf GebConfig.groovy )
//		// FIXME : delete this :
//		if(!System.getProperty('gev.env')) {
//			System.setProperty('geb.env',"chrome")
////			System.setProperty('geb.env',"firefox")
//		}
	}
	
	boolean realBrowser() {
		! (getBrowser().getDriver() instanceof HtmlUnitDriver)
	}
	
	RegistrationUtils getRegistrationUtils() {
		return RegistrationUtils.getInstance();
	}
	AccountUtils getAccountUtils() {
		return AccountUtils.getInstance();
	}
	
}
