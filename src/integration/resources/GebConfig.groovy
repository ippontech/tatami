/*
 This is the Geb configuration file.
 See: http://www.gebish.org/manual/current/configuration.html
 */

import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.chrome.ChromeDriver

import com.gargoylesoftware.htmlunit.BrowserVersion;

// TODO : faut-il laisser la baseUrl ici ?
baseUrl = "http://localhost:8080/"

// Use htmlunit as the default
// See: http://code.google.com/p/selenium/wiki/HtmlUnitDriver
driver = {
	def browserVersion = BrowserVersion.getDefault()
	browserVersion.setBrowserLanguage("fr") // on force en Français
	def driver = new HtmlUnitDriver(browserVersion)
	// driver.javascriptEnabled = true // raphael.js fails to be executed by HtmlUnitDriver
	driver
}

environments {

	// run as “mvn -Dgeb.env=chrome test”
	// See: http://code.google.com/p/selenium/wiki/ChromeDriver
	chrome {
		if(!System.getProperty('webdriver.chrome.driver')) {
			System.setProperty('webdriver.chrome.driver',"C:\\products\\chromedriver_win_22_0_1203_0b\\chromedriver.exe")
		}
		driver = { new ChromeDriver() }
	}

	// run as “mvn -Dgeb.env=firefox test”
	// See: http://code.google.com/p/selenium/wiki/FirefoxDriver
	firefox {
		driver = { new FirefoxDriver() }
	}

}

