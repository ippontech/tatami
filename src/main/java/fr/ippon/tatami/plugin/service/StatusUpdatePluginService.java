package fr.ippon.tatami.plugin.service;

import java.util.Collections;

import javax.inject.Inject;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import fr.ippon.tatami.plugin.api.StatusUpdateServiceApi;
import fr.ippon.tatami.service.StatusUpdateService;

@Component
public class StatusUpdatePluginService implements StatusUpdateServiceApi {

	@Inject
	StatusUpdateService statusUpdateService;

	@Override
	public void postStatus(String userToPostAs, String content) {

		// TODO : check that the user already exists ...
		// and if not ???

		// TODO : refactor StatusUpdateService to be able to use it without hacking into Spring Security ...

		SecurityContext securityContext = SecurityContextHolder.getContext();
		UserDetails userDetails = new User(userToPostAs, "not_used", Collections.<GrantedAuthority> emptySet());
		Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, "not_used");
		securityContext.setAuthentication(authentication);
		try {
			statusUpdateService.postStatus(content, false, Collections.<String>emptySet());
		} finally {
			SecurityContextHolder.clearContext();
		}
	}

}