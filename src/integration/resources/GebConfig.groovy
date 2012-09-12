/*
 This is the Geb configuration file.
 See: http://www.gebish.org/manual/current/configuration.html
 */

import org.openqa.selenium.Capabilities;
import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.firefox.FirefoxProfile
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions

import com.gargoylesoftware.htmlunit.BrowserVersion

baseUrl = "http://localhost:8080/"

def forcedLocale = "en"

//// See: http://code.google.com/p/selenium/wiki/HtmlUnitDriver
//driver = {
//	def browserVersion = BrowserVersion.getDefault()
//	browserVersion.setSystemLanguage(forcedLocale)
//	browserVersion.setBrowserLanguage(forcedLocale)
//	browserVersion.setUserLanguage(forcedLocale)
//	def driver = new HtmlUnitDriver(browserVersion)
////	driver.javascriptEnabled = true // raphael.js fails to be executed by HtmlUnitDriver
//	driver
//}

FirefoxProfile p = new FirefoxProfile();
p.setPreference( "intl.accept_languages", forcedLocale );
driver = { new FirefoxDriver(p) }

environments {

	// run as “mvn -Dgeb.env=chrome test”
	// See: http://code.google.com/p/selenium/wiki/ChromeDriver
	chrome {
		if(!System.getProperty('webdriver.chrome.driver')) {
			System.setProperty('webdriver.chrome.driver',"C:\\products\\chromedriver_win_22_0_1203_0b\\chromedriver.exe")
		}		
		DesiredCapabilities capabilities = new DesiredCapabilities()
		// available capabilities can be find in %USER_HOME%\AppData\Local\Google\Chrome\User Data\default\preferences
		def prefs = ["intl.accept_languages":forcedLocale] // Map
		capabilities.setCapability("chrome.prefs",prefs);
		driver = { new ChromeDriver(capabilities) }
	}

	// run as “mvn -Dgeb.env=firefox test”
	// See: http://code.google.com/p/selenium/wiki/FirefoxDriver
	firefox {
		FirefoxProfile profile = new FirefoxProfile();
		profile.setPreference( "intl.accept_languages", forcedLocale );
		driver = { new FirefoxDriver(profile) }
	}

}

