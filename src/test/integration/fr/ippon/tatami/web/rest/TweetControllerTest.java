package fr.ippon.tatami.web.rest;

import static org.junit.Assert.assertThat;
import static org.junit.matchers.JUnitMatchers.containsString;
import static org.hamcrest.CoreMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

public class TweetControllerTest {

	static HttpClient httpclient;

	@BeforeClass
	public static void initHttpClient() throws Throwable {
		HttpClient httpclient = new DefaultHttpClient();
		HttpPost httppost = new HttpPost("http://127.0.0.1:8080/tatami/authentication");
		List<NameValuePair> formparams = new ArrayList<NameValuePair>();
		formparams.add(new BasicNameValuePair("j_username", "jdubois"));
		formparams.add(new BasicNameValuePair("j_password", "password"));
		UrlEncodedFormEntity reqEntity = new UrlEncodedFormEntity(formparams);
		httppost.setEntity(reqEntity);

		System.out.println("executing request " + httppost.getRequestLine());
		HttpResponse response = httpclient.execute(httppost);

		String firstHeader = response.getFirstHeader("Location").getValue();
		System.out.println("Location : " + firstHeader);
		assertThat(firstHeader, containsString("http://127.0.0.1:8080/;")); // jetty  8.0.4.v20111024
		// assertThat(firstHeader,is(equalTo("http://127.0.0.1:8080/"))); // jetty 8.1.2.v20120308

		HttpEntity resEntity = response.getEntity();
		EntityUtils.consume(resEntity);

		TweetControllerTest.httpclient = httpclient; // en static : un peu bourrin ...
	}

	@AfterClass
	public static void dispose() {
		if (httpclient != null) {
			httpclient.getConnectionManager().shutdown();
			httpclient = null;
		}
	}

	@Test
	public void testListTweetsWithAcceptJson() throws Throwable {

		HttpGet httpget = new HttpGet("http://127.0.0.1:8080/tatami/rest/tweets");
		httpget.setHeader("Accept", "application/json");
		// httpget.setHeader("Accept","text/plain");

		HttpResponse response = httpclient.execute(httpget);

		System.out.println("Status Line : " + response.getStatusLine());
		System.out.println("Headers : " + Arrays.asList(response.getAllHeaders()));
		Header contentType = response.getFirstHeader("Content-type");
		System.out.println(contentType);
		String content = EntityUtils.toString(response.getEntity());
		System.out.println(content);

		assertThat(contentType.getValue(), containsString("application/json"));
	}

	@Test
	public void testListTweetsWithExtensionJson() throws Throwable {

		HttpGet httpget = new HttpGet("http://127.0.0.1:8080/tatami/rest/tweets.json");
		HttpResponse response = httpclient.execute(httpget);

		System.out.println("Status Line : " + response.getStatusLine());
		System.out.println("Headers : " + Arrays.asList(response.getAllHeaders()));
		Header contentType = response.getFirstHeader("Content-type");
		System.out.println(contentType);
		String content = EntityUtils.toString(response.getEntity());
		System.out.println(content);

		assertThat(contentType.getValue(), containsString("application/json"));
	}

	@Test
	public void testListTweetsWithAccepHTML() throws Throwable {

		HttpGet httpget = new HttpGet("http://127.0.0.1:8080/tatami/rest/tweets");
		httpget.setHeader("Accept", "text/html");

		HttpResponse response = httpclient.execute(httpget);

		System.out.println("Status Line : " + response.getStatusLine());
		System.out.println("Headers : " + Arrays.asList(response.getAllHeaders()));
		Header contentType = response.getFirstHeader("Content-type");
		System.out.println(contentType);
		String content = EntityUtils.toString(response.getEntity());
		System.out.println(content);

		assertThat(contentType.getValue(), containsString("text/html"));
	}

	@Test
	public void testListTweetsWithExtensionHTML() throws Throwable {

		HttpGet httpget = new HttpGet("http://127.0.0.1:8080/tatami/rest/tweets.html");
		HttpResponse response = httpclient.execute(httpget);

		System.out.println("Status Line : " + response.getStatusLine());
		System.out.println("Headers : " + Arrays.asList(response.getAllHeaders()));
		Header contentType = response.getFirstHeader("Content-type");
		System.out.println(contentType);
		String content = EntityUtils.toString(response.getEntity());
		System.out.println(content);

		assertThat(contentType.getValue(), containsString("text/html"));
	}
}
