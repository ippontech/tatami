package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.repository.GroupDetailsRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.*;
import static com.datastax.driver.core.querybuilder.QueryBuilder.desc;

/**
 * Cassandra implementation of the Group Details repository.
 * <p/>
 * Structure :
 * - Key = Group ID
 * - Name / Value pairs of group details
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraGroupDetailsRepository implements GroupDetailsRepository {

    private static final String NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String PUBLIC_GROUP = "publicGroup";
    private static final String ARCHIVED_GROUP = "archivedGroup";

    @Inject
    private Session session;

    @Override
    public void createGroupDetails(String groupId, String name, String description, boolean publicGroup) {
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.GROUP_DETAILS_CF)
                .value("groupId", UUID.fromString(groupId))
                .value(NAME, name)
                .value(DESCRIPTION, description)
                .value(PUBLIC_GROUP, publicGroup)
                .value(ARCHIVED_GROUP,false);
        session.execute(statement);
    }

    @Override
    public void editGroupDetails(UUID groupId, String name, String description, boolean archivedGroup) {
        Statement statement = QueryBuilder.update(ColumnFamilyKeys.GROUP_DETAILS_CF)
                .with(set(NAME,name))
                .and(set(DESCRIPTION,description))
                .and(set(ARCHIVED_GROUP,archivedGroup))
                .where(eq("groupId",groupId));
        session.execute(statement);
    }

    @Override
    public Group getGroupDetails(UUID groupId) {
        Statement statement = QueryBuilder.select()
                .all()
                .from(ColumnFamilyKeys.GROUP_DETAILS_CF)
                .where(eq("groupId", groupId));

        ResultSet results = session.execute(statement);
        Row row =  results.one();
        if (row != null) {
            Group group = new Group();
            group.setName(row.getString(NAME));
            group.setDescription(row.getString(DESCRIPTION));
            group.setPublicGroup(row.getBool(PUBLIC_GROUP));
            group.setArchivedGroup(row.getBool(ARCHIVED_GROUP));
            return group;
        }
        return null;
    }
}
