package fr.ippon.tatami.web.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class IeRefreshWrapper extends HttpServletRequestWrapper {
 
	private String accept; 
	
    public IeRefreshWrapper(HttpServletRequest request) {
        super(request);
        if (request.getHeader("accept").equals("*/*")) {
        	accept =  "application/x-ms-application, image/jpeg, application/xaml+xml, image/gif, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*";
        } else {
        	accept = request.getHeader("accept");
        }
    }
    
    public String getHeader(String name) {
        return (name != "Accept" && name != "accept") ? super.getHeader(name) : accept;
    }
 
}