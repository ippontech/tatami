package fr.ippon.tatami.web.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

/**
 * .
 * Filter each request with jsoup
 * @author Francois
 */
public class RequestWrapper extends HttpServletRequestWrapper {
	
	public RequestWrapper(HttpServletRequest servletRequest) {
        super(servletRequest);
    }
	
    public String[] getParametercontents(String parameter) {
      String[] contents = super.getParameterValues(parameter);
      if (contents==null){
                  return null;
      }
      int count = contents.length;
      String[] encodedcontents = new String[count];
      for (int i = 0; i < count; i++) {
    	  encodedcontents[i] = cleanXSS(contents[i]);
      }
      return encodedcontents;
    }
    
    public String getParameter(String parameter) {
    	String content = super.getParameter(parameter);
    	if (content == null) {
    		return null;
    	}
    	return cleanXSS(content);
    }
    
    public String getHeader(String name) {
        String content = super.getHeader(name);
        if (content == null){
            return null;
        }
        return cleanXSS(content);
    }
    
    private String cleanXSS(String content) {
        return Jsoup.clean(content, Whitelist.basic());
    }
}
