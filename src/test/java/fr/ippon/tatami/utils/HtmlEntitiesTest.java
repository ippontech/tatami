package fr.ippon.tatami.utils;

import static org.junit.Assert.*;
import org.junit.Test;

import fr.ippon.tatami.service.util.HtmlEntities;

public class HtmlEntitiesTest{
	private final static String decoded = "<img src=\"dir/filename.php?file=1&date=12414\" />";
	private final static String encoded = "&lt;img src=&quot;dir/filename.php?file=1&amp;date=12414&quot; /&gt;";
	
	private final static String decodedUnknownEntity =  "When I was a kid we used to shop at the grocery store A&P; " + 
		"but it went bankrupt.";
	private final static String encodedUnknownEntity = "When I was a kid we used to shop at the grocery store A&amp;P; " + 
		"but it went bankrupt.";
	
	private final static String decodedConsecitiveEntities = "1 <> 2";
	private final static String encodedConsecitiveEntities = "1 &lt;&gt; 2";
	
	@Test
	public void testEncondeHtmlEntities()
	{
		assertEquals(encoded, HtmlEntities.encode(decoded));
		assertEquals(encodedUnknownEntity, HtmlEntities.encode(decodedUnknownEntity));
		assertEquals(encodedConsecitiveEntities, HtmlEntities.encode(decodedConsecitiveEntities));
	}

	@Test
	public void testDecodeHtmlEntities() 
	{
		assertEquals(decoded, HtmlEntities.decode(encoded));
		// unknown entities should be left the same if we cannot decode them
		assertEquals(decodedUnknownEntity, HtmlEntities.decode(decodedUnknownEntity));
		assertEquals(decodedConsecitiveEntities, HtmlEntities.decode(encodedConsecitiveEntities));
	}

}
