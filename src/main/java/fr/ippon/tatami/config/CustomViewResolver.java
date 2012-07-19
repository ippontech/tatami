package fr.ippon.tatami.config;

import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.mobile.device.DeviceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.support.JstlUtils;
import org.springframework.web.servlet.view.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Locale;

/**
 * Created with IntelliJ IDEA.
 * User: ippon
 * Date: 13/07/12
 * Time: 16:47
 * To change this template use File | Settings | File Templates.
 */
public class CustomViewResolver extends InternalResourceViewResolver {

    @Override
    protected AbstractUrlBasedView buildView(String viewName) throws Exception {
        HttpServletRequest request=((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
        String subUrl="";
        if(DeviceUtils.getCurrentDevice(request).isNormal()){
             subUrl="/WEB-INF/layouts/standard/";
        }else if(DeviceUtils.getCurrentDevice(request).isMobile()){
            subUrl="/WEB-INF/layouts/mobile/";
        }
        JstlView view =new JstlView(subUrl+viewName+".jsp");
        return view;
    }

}
