package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;

/**
 * Cassandra implementation of the user repository.
 *
 * @author Julien Dubois
 */
public class CassandraUserRepository implements UserRepository {

    @Override
    public void createUser(User user) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void updateUser(User user) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void deleteUser(String login) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public User findUserByLogin(String login) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
