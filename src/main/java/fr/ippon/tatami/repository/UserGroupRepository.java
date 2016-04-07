package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.GroupRoles;
import fr.ippon.tatami.repository.UserGroupRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Cassandra implementation of the User groups repository.
 * <p/>
 * Structure :
 * - Key = username
 * - Name = group ID
 * - Value = role
 *
 * @author Julien Dubois
 */
@Repository
public class UserGroupRepository {

    @Inject
    Session session;



    public void addGroupAsMember(String username, UUID groupId) {
        Statement statement = QueryBuilder.insertInto("userGroup")
                .value("username", username)
                .value("groupId", groupId)
                .value("role", GroupRoles.MEMBER);
        session.execute(statement);
    }


    public void addGroupAsAdmin(String username, UUID groupId) {
        Statement statement = QueryBuilder.insertInto("userGroup")
                .value("username", username)
                .value("groupId", groupId)
                .value("role", GroupRoles.ADMIN);
        session.execute(statement);
    }


    public void removeGroup(String username, UUID groupId) {
        Statement statement = QueryBuilder.delete().from("userGroup")
                .where(eq("username", username))
                .and(eq("groupId", groupId));
        session.execute(statement);
    }


    public List<UUID> findGroups(String email) {
        Statement statement = QueryBuilder.select()
                .column("groupId")
                .from("userGroup")
                .where(eq("email", email));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getUUID("groupId"))
                .collect(Collectors.toList());
    }


    public Collection<UUID> findGroupsAsAdmin(String username) {
        Statement statement = QueryBuilder.select()
                .all()
                .from("userGroup")
                .where(eq("username", username));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .filter(e -> e.getString("role").equals(GroupRoles.ADMIN))
                .map(e -> e.getUUID("groupId"))
                .collect(Collectors.toList());
    }
}
