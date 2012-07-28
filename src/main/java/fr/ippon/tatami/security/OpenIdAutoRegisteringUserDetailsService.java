package fr.ippon.tatami.security;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.openid.OpenIDAttribute;
import org.springframework.security.openid.OpenIDAuthenticationToken;
import org.springframework.stereotype.Component;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.DomainRepository;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.util.DomainUtil;

/**
 * 
 // TODO : code dupliqué de TatamiLdapAuthenticationProvider !!
 * 
 * @author Fabien Arrault
 *
 */
@Component
public class OpenIdAutoRegisteringUserDetailsService implements AuthenticationUserDetailsService<OpenIDAuthenticationToken> {
	
    private final Log log = LogFactory.getLog(OpenIdAutoRegisteringUserDetailsService.class);

    private Collection<GrantedAuthority> userGrantedAuthorities = new ArrayList<GrantedAuthority>();

    private Collection<GrantedAuthority> adminGrantedAuthorities = new ArrayList<GrantedAuthority>();

    private Collection<String> adminUsers = null;

    @Inject
    private UserService userService;

    @Inject
    private DomainRepository domainRepository;

    @Inject
    Environment env;
	
    protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();
    
 // TODO : code dupliqué de TatamiLdapAuthenticationProvider
    @PostConstruct
    public void init() {
        //Roles for "normal" users
        GrantedAuthority roleUser = new SimpleGrantedAuthority("ROLE_USER");
        userGrantedAuthorities.add(roleUser);

        //Roles for "admin" users, configured in tatami.properties
        GrantedAuthority roleAdmin = new SimpleGrantedAuthority("ROLE_ADMIN");
        adminGrantedAuthorities.add(roleUser);
        adminGrantedAuthorities.add(roleAdmin);

        String adminUsersList = this.env.getProperty("tatami.admin.users");
        String[] adminUsersArray = adminUsersList.split(",");
        adminUsers = new ArrayList<String>(Arrays.asList(adminUsersArray));
        if (log.isDebugEnabled()) {
            for (String admin : adminUsers) {
                log.debug("User \"" + admin + "\" is an administrator.");
            }
        }
    }
    
	@Override
	public UserDetails loadUserDetails(OpenIDAuthenticationToken token) throws UsernameNotFoundException {

		String email = null;
		String firstName = null;
		String lastName = null;
		
		for (OpenIDAttribute attribute : token.getAttributes()) {
			String attName = attribute.getName();
			List<String> values = attribute.getValues();
			String firstValue = values.isEmpty()?null:values.iterator().next();
			if("email".equals(attName)) {
				email = firstValue;
			} else if("firstname".equals(attName)) {
				firstName = firstValue;
			} else if("lastname".equals(attName)) {
				lastName = firstValue;
			}
		}
		if(email == null) {
            // TODO : use messages
			String msg = "OpendId response did not contains the user email";
			log.error(msg);
			throw new UsernameNotFoundException(msg);
		}
		
		// TODO : code dupliqué <<en partie>> de TatamiLdapAuthenticationProvider
		
        //Automatically create LDAP users in Tatami
        User user = userService.getUserByLogin(email);
        if (user == null) {
            user = new User();
            // Note : on perd l'identifiant openId là ...
            // TODO : Est-ce grave ??
            user.setLogin(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            userService.createUser(user);
        }
        
        // TODO : création de l'espace entreprise ?? 
        
        domainRepository.updateUserInDomain(user.getDomain(), user.getLogin());
        
        // TODO : code dupliqué de TatamiLdapAuthenticationProvider
            String login = email;
            if (!login.contains("@")) {
                if (log.isDebugEnabled()) {
                    log.debug("User login " + login + " is incorrect.");
                }

//                throw new BadCredentialsException(messages.getMessage(
//                        "LdapAuthenticationProvider.badCredentials", "Bad credentials"));
                // TODO : use messages
                String msg = "OpendId response did not contains a valid the user email";
                log.error(msg);
				throw new UsernameNotFoundException(msg);
            }
//            String username = DomainUtil.getUsernameFromLogin(login);

            Collection<GrantedAuthority> grantedAuthorities = null;
            if (adminUsers.contains(login)) {
                if (log.isDebugEnabled()) {
                    log.debug("User \"" + login + "\" is an administrator.");
                }
                grantedAuthorities = adminGrantedAuthorities;
            } else {
                grantedAuthorities = userGrantedAuthorities;
            }
        
        // The real autentication object uses the login, and not the username
        org.springframework.security.core.userdetails.User realUser =
                new org.springframework.security.core.userdetails.User(user.getLogin(), "", grantedAuthorities);
        
		return realUser;
	}

}
