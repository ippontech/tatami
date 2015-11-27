package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.repository.GroupRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;

/**
 * Cassandra implementation of the Group repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = Group ID
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraGroupRepository implements GroupRepository {

    @Inject
    Session session;

    @Override
    public UUID createGroup(String domain, String name, String description, boolean publicGroup) {
        UUID groupId = UUIDs.timeBased();
        Statement statement = QueryBuilder.insertInto("group")
                .value("id", groupId)
                .value("domain", domain)
                .value("name",name)
                .value("description", description)
                .value("publicGroup",publicGroup);
        session.execute(statement);
        return groupId;
    }

    @Override
    public Group getGroupById(String domain, UUID groupId) {
        Statement statement = QueryBuilder.select()
                .all()
                .from("group")
                .where(eq("id", groupId))
                .and(eq("domain", domain));
        ResultSet results = session.execute(statement);
        Row row = results.one();
        if (row != null) {
            Group group = new Group();
            group.setGroupId(row.getUUID("id"));
            group.setName(row.getString("name"));
            group.setDomain(row.getString("domain"));
            group.setDescription(row.getString("description"));
            group.setPublicGroup(row.getBool("publicGroup"));
            return group;
        } else {
            return null;
        }
    }
}
