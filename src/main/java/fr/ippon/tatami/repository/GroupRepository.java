package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.Group;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.set;

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
public class GroupRepository {

    @Inject
    private Session session;

    private static final String NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String PUBLIC_GROUP = "publicGroup";
    private static final String ARCHIVED_GROUP = "archivedGroup";



    public UUID createGroup(String domain, String name, String description, boolean publicGroup) {
        UUID groupId = UUIDs.timeBased();
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.GROUP_CF)
                .value("id", groupId)
                .value("domain", domain)
                .value(NAME,name)
                .value(DESCRIPTION, description)
                .value(PUBLIC_GROUP,publicGroup)
                .value(ARCHIVED_GROUP,false);
        session.execute(statement);
        return groupId;
    }


    public void editGroupDetails(UUID groupId, String name, String description, boolean archivedGroup) {
        Statement statement = QueryBuilder.update(ColumnFamilyKeys.GROUP_CF)
                .with(set(NAME,name))
                .and(set(DESCRIPTION,description))
                .and(set(ARCHIVED_GROUP,archivedGroup))
                .where(eq("id",groupId));
        session.execute(statement);
    }


    public Group getGroupById(String domain, UUID groupId) {
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.GROUP_CF)
                .where(eq("id", groupId));
        ResultSet results = session.execute(statement);
        Row row = results.one();
        return getGroupFromRow(row);
    }


    public Group getGroupByGroupId(UUID groupId) {
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.GROUP_CF)
                .where(eq("id", groupId));
        ResultSet results = session.execute(statement);
        Row row = results.one();
        return getGroupFromRow(row);
    }

    private Group getGroupFromRow(Row row) {
        if (row != null) {
            Group group = new Group();
            group.setGroupId(row.getUUID("id"));
            group.setName(row.getString("name"));
            group.setDomain(row.getString("domain"));
            group.setDescription(row.getString(DESCRIPTION));
            group.setPublicGroup(row.getBool(PUBLIC_GROUP));
            group.setArchivedGroup(row.getBool(ARCHIVED_GROUP));
            return group;
        } else {
            return null;
        }
    }
}
