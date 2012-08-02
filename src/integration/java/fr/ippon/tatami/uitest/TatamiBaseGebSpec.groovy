package fr.ippon.tatami.uitest;

import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import geb.spock.GebSpec;

public class TatamiBaseGebSpec extends GebSpec {
	
	boolean realBrowser() {
		! (getBrowser().getDriver() instanceof HtmlUnitDriver)
	}
	
}
