package fr.ippon.tatami.service.util;

import java.util.*;
import java.util.regex.*;

public class HtmlEntities{
    private static Map<String, Character> map = new LinkedHashMap<String, Character>();

    static{
    	map.put("&quot;", (char) 34);
    	map.put("&amp;", (char) 38);
    	map.put("&lt;", (char) 60);
    	map.put("&gt;", (char) 62);
        map.put("&nbsp;", (char) 160);
        map.put("&iexcl;", (char) 161);
        map.put("&cent;", (char) 162);
        map.put("&pound;", (char) 163);
        map.put("&curren;", (char) 164);
        map.put("&yen;", (char) 165);
        map.put("&brvbar;", (char) 166);
        map.put("&sect;", (char) 167);
        map.put("&uml;", (char) 168);
        map.put("&copy;", (char) 169);
        map.put("&ordf;", (char) 170);
        map.put("&laquo;", (char) 171);
        map.put("&not;", (char) 172);
        map.put("&shy;", (char) 173);
        map.put("&reg;", (char) 174);
        map.put("&macr;", (char) 175);
        map.put("&deg;", (char) 176);
        map.put("&plusmn;", (char) 177);
        map.put("&sup2;", (char) 178);
        map.put("&sup3;", (char) 179);
        map.put("&acute;", (char) 180);
        map.put("&micro;", (char) 181);
        map.put("&para;", (char) 182);
        map.put("&middot;", (char) 183);
        map.put("&cedil;", (char) 184);
        map.put("&sup1;", (char) 185);
        map.put("&ordm;", (char) 186);
        map.put("&raquo;", (char) 187);
        map.put("&frac14;", (char) 188);
        map.put("&frac12;", (char) 189);
        map.put("&frac34;", (char) 190);
        map.put("&iquest;", (char) 191);
        map.put("&times;", (char) 215);
        map.put("&divide;", (char) 247);
        map.put("&Agrave;", (char) 192);
        map.put("&Aacute;", (char) 193);
        map.put("&Acirc;", (char) 194);
        map.put("&Atilde;", (char) 195);
        map.put("&Auml;", (char) 196);
        map.put("&Aring;", (char) 197);
        map.put("&AElig;", (char) 198);
        map.put("&Ccedil;", (char) 199);
        map.put("&Egrave;", (char) 200);
        map.put("&Eacute;", (char) 201);
        map.put("&Ecirc;", (char) 202);
        map.put("&Euml;", (char) 203);
        map.put("&Igrave;", (char) 204);
        map.put("&Iacute;", (char) 205);
        map.put("&Icirc;", (char) 206);
        map.put("&Iuml;", (char) 207);
        map.put("&ETH;", (char) 208);
        map.put("&Ntilde;", (char) 209);
        map.put("&Ograve;", (char) 210);
        map.put("&Oacute;", (char) 211);
        map.put("&Ocirc;", (char) 212);
        map.put("&Otilde;", (char) 213);
        map.put("&Ouml;", (char) 214);
        map.put("&Oslash;", (char) 216);
        map.put("&Ugrave;", (char) 217);
        map.put("&Uacute;", (char) 218);
        map.put("&Ucirc;", (char) 219);
        map.put("&Uuml;", (char) 220);
        map.put("&Yacute;", (char) 221);
        map.put("&THORN;", (char) 222);
        map.put("&szlig;", (char) 223);
        map.put("&agrave;", (char) 224);
        map.put("&aacute;", (char) 225);
        map.put("&acirc;", (char) 226);
        map.put("&atilde;", (char) 227);
        map.put("&auml;", (char) 228);
        map.put("&aring;", (char) 229);
        map.put("&aelig;", (char) 230);
        map.put("&ccedil;", (char) 231);
        map.put("&egrave;", (char) 232);
        map.put("&eacute;", (char) 233);
        map.put("&ecirc;", (char) 234);
        map.put("&euml;", (char) 235);
        map.put("&igrave;", (char) 236);
        map.put("&iacute;", (char) 237);
        map.put("&icirc;", (char) 238);
        map.put("&iuml;", (char) 239);
        map.put("&eth;", (char) 240);
        map.put("&ntilde;", (char) 241);
        map.put("&ograve;", (char) 242);
        map.put("&oacute;", (char) 243);
        map.put("&ocirc;", (char) 244);
        map.put("&otilde;", (char) 245);
        map.put("&ouml;", (char) 246);
        map.put("&oslash;", (char) 248);
        map.put("&ugrave;", (char) 249);
        map.put("&uacute;", (char) 250);
        map.put("&ucirc;", (char) 251);
        map.put("&uuml;", (char) 252);
        map.put("&yacute;", (char) 253);
        map.put("&thorn;", (char) 254);
        map.put("&yuml;", (char) 255);
    }

    /**
     * Find the Html Entity and convert it back to a regular character if the
     * entity exists, otherwise return the same string.
     * @param str
     * @return Character represented by HTML Entity or the same string if unknown entity.
     */
    private static String fromHtmlEntity(String str){
    	Character ch = map.get(str);
    	return ( ch != null ) ? ch.toString() : str;
    }
    
    /**
     * Finds the value and returns the key that corresponds to that value. If value not found
     * returns null.
     * @param value The value to be found.
     * @return The key corresponding to the value that was found or null if value not found.
     */
    private static String findValue(char value){
    	Set<String> keySet = map.keySet();
    	Iterator<String> i = keySet.iterator();
    	String key = i.next(); // key
    	boolean found = false;
    	String result = null;
    	
    	while(i.hasNext() && !found){
    		if(map.get(key).charValue() == value){
    			found = true;
    			result = key;
    		}
    		
    		key = i.next();
    	}
    	
    	return result;
    }
    
    /**
     * Converts special characters in ASCII into html entities (e.g. & -> &amp;)
     * @param encode The string to be encoded.
     * @return The encoded string with HTML entities.
     */
    public static String encode(String encode){
    	StringBuilder str = new StringBuilder(encode);
    	String key;
    	int i = 0;
    	
    	// loop over all the characters in the string
    	while(i < str.length()){
    		// try matching a character to an entity
    		key = findValue(str.charAt(i));
    		if(key != null){
    			str.replace(i, i + 1, key);
    			i += key.length();
    		}else{
    			i++;
    		}
    	}
    	
    	return str.toString();
    }
    
    /**
     * Converts html entities (e.g. &amp;) into real characters (ASCII characters, e.g. &amp; -> &)
     * @param decode A string to be decoded.
     * @return The string decoded with no HTML entities.
     */
    public static String decode(String decode){
        StringBuilder str = new StringBuilder(decode);
        Matcher m = Pattern.compile("&[A-Za-z]+;").matcher(str);
        String replaceStr = null;
        
        int matchPointer = 0;
        while (m.find(matchPointer)){
        	// check if we have a corresponding key in our map
        	replaceStr = fromHtmlEntity(m.group());
        	str.replace(m.start(), m.end(), replaceStr);
        	matchPointer = m.start() + replaceStr.length();
        }
        
        return str.toString();
    }
}
