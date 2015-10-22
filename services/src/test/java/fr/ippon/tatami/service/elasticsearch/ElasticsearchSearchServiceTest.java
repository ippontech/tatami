//package fr.ippon.tatami.service.elasticsearch;
//
//import fr.ippon.tatami.AbstractCassandraTatamiTest;
//import fr.ippon.tatami.service.AdminService;
//import fr.ippon.tatami.service.SearchService;
//import org.junit.Test;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//
//import javax.inject.Inject;
//import java.util.ArrayList;
//import java.util.Collection;
//
//import static org.junit.Assert.assertEquals;
//
//public class ElasticsearchSearchServiceTest extends AbstractCassandraTatamiTest {
//
//    @Inject
//    private AdminService adminService;
//
//    @Inject
//    private SearchService searchService;
//
//    @Test
//    public void resetElasticSearch() throws InterruptedException {
//        // The user needs to have the admin role
//        GrantedAuthority adminAuthority = new SimpleGrantedAuthority("ROLE_ADMIN");
//        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
//        grantedAuthorities.add(adminAuthority);
//
//        org.springframework.security.core.userdetails.User userDetails =
//                new org.springframework.security.core.userdetails.User("tatami@ippon.fr", "", grantedAuthorities);
//
//        Authentication authentication =
//                new UsernamePasswordAuthenticationToken(userDetails,
//                        userDetails.getPassword(),
//                        userDetails.getAuthorities());
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        // Clean the index if needed
//        searchService.reset();
//
//        // Test the user index
//        Collection<String> users = searchService.searchUserByPrefix("ippon.fr", "jdub");
//        assertEquals(0, users.size());
//
//        adminService.rebuildIndex();
//
//        // Test every 100ms, for 30 seconds : this is the time for Elastic Search to index everything
//        for (int i = 0; i < 100; i++) {
//            Thread.sleep(300 * i);
//            users = searchService.searchUserByPrefix("ippon.fr", "jdub");
//            if (users.size() > 0) {
//                break;
//            }
//        }
//
//        assertEquals(1, users.size());
//        assertEquals("jdubois@ippon.fr", users.iterator().next());
//    }
//}
