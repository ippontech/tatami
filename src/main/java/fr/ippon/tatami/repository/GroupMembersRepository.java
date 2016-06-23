package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.config.GroupRoles;
import fr.ippon.tatami.repository.GroupMembersRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Cassandra implementation of the Group members repository.
 * <p/>
 * Structure :
 * - Key = group ID
 * - Name = email
 * - Value = role
 *
 * @author Julien Dubois
 */
@Repository
public class GroupMembersRepository {

    public static final String GROUP_MEMBER = "groupMember";
    public static final String EMAIL = "email";
    public static final String ROLE = "role";
    public static final String GROUP_ID = "groupId";
    @Inject
    Session session;


    public void addMember(UUID groupId, String email) {
        Statement statement = QueryBuilder.insertInto(GROUP_MEMBER)
                .value(GROUP_ID, groupId)
                .value(EMAIL, email)
                .value(ROLE, GroupRoles.MEMBER);
        session.execute(statement);
    }


    public void addAdmin(UUID groupId, String email) {
        Statement statement = QueryBuilder.insertInto(GROUP_MEMBER)
                .value(GROUP_ID, groupId)
                .value(EMAIL, email)
                .value(ROLE, GroupRoles.ADMIN);
        session.execute(statement);
    }


    public void removeMember(UUID groupId, String email) {
        Statement statement = QueryBuilder.delete().from(GROUP_MEMBER)
                .where(eq(GROUP_ID, groupId))
                .and(eq(EMAIL, email));
        session.execute(statement);

    }


    public Map<String, String> findMembers(UUID groupId) {
        Statement statement = QueryBuilder.select()
                .all()
                .from(GROUP_MEMBER)
                .where(eq(GROUP_ID, groupId));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .collect(Collectors.toMap(
                        e -> e.getString(EMAIL),
                        e -> e.getString(ROLE)));
    }
}
