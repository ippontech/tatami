package fr.ippon.tatami.repository;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

import javax.inject.Inject;

import org.junit.Test;

import fr.ippon.tatami.AbstractCassandraTatamiTest;


/**
 * @author Francois
 */
public class UserRepositoryTest extends AbstractCassandraTatamiTest{
    
    @Inject
    private UserRepository userRepository;

    
    @Test
    public void shouldFindAUserByLogin() throws Exception {
        assertThat(userRepository.findUserByLogin("fdescamps"), notNullValue());
    } 
    
    /*@Test
    public void shouldCreateAUser() throws Exception {
        User idescamps = new User();
        idescamps.setEmail("ines.descamps@gmail.com");
        idescamps.setFirstName("Inès");
        idescamps.setGravatar("inesgravatar");
        idescamps.setLastName("Descamps");
        idescamps.setLogin("idescamps");
        userRepository.createUser(idescamps);
                
        idescamps = userRepository.findUserByLogin("idescamps");
        idescamps.setGravatar("gravatarupdated");
        
        assertThat(idescamps, notNullValue());
    } 
    
    @Test
    public void shouldUpdateAUser() throws Exception {
        Assert.fail();
    } */
}
