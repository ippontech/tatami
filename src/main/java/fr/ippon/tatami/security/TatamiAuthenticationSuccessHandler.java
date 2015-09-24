package fr.ippon.tatami.security;

import fr.ippon.tatami.repository.AppleDeviceRepository;
import fr.ippon.tatami.repository.AppleDeviceUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Tatami specific Spring Security success handler, that understands Ajax requests.
 */
@Component
public class TatamiAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final Logger log = LoggerFactory.getLogger(TatamiAuthenticationSuccessHandler.class);

    private RequestCache requestCache = new HttpSessionRequestCache();

    @Inject
    private AppleDeviceRepository appleDeviceRepository;

    @Inject
    private AppleDeviceUserRepository appleDeviceUserRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {
        SavedRequest savedRequest = requestCache.getRequest(request, response);

        manageAppleDevice(authentication.getName(), request.getParameter("device_token"));

        if (savedRequest == null) {
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }
        if (savedRequest.getHeaderNames().contains("X-Requested-With") &&
                "XMLHttpRequest".equals(savedRequest.getHeaderValues("X-Requested-With").get(0))) {

            requestCache.removeRequest(request, response);
            clearAuthenticationAttributes(request);
            response.sendRedirect(getDefaultTargetUrl());
            return;
        }

        String targetUrlParameter = getTargetUrlParameter();
        if (isAlwaysUseDefaultTargetUrl() || (targetUrlParameter != null && StringUtils.hasText(request.getParameter(targetUrlParameter)))) {
            requestCache.removeRequest(request, response);
            super.onAuthenticationSuccess(request, response, authentication);

            return;
        }

        clearAuthenticationAttributes(request);

        // Use the DefaultSavedRequest URL
        String targetUrl = savedRequest.getRedirectUrl();
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }

    private void manageAppleDevice(String login, String deviceToken) {
        if (deviceToken == null) {
            return;
        }
        log.debug("Device token: {}", deviceToken);
        String deviceId = deviceToken.substring(1, deviceToken.length() - 1);
        log.debug("Device Id: {}", deviceId);
        String existingDeviceLogin = appleDeviceUserRepository.findLoginForDeviceId(deviceId);
        if (existingDeviceLogin != null) {
            appleDeviceRepository.removeAppleDevice(existingDeviceLogin, deviceId);
            appleDeviceUserRepository.removeAppleDeviceForUser(deviceId);
        }
        appleDeviceUserRepository.createAppleDeviceForUser(deviceId, login);
        appleDeviceRepository.createAppleDevice(login, deviceId);
    }
}
