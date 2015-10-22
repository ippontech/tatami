package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.GroupRoles;
import fr.ippon.tatami.repository.UserGroupRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static fr.ippon.tatami.config.ColumnFamilyKeys.USER_GROUPS_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the User groups repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = group ID
 * - Value = role
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraUserGroupRepository implements UserGroupRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addGroupAsMember(String login, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, USER_GROUPS_CF, HFactory.createColumn(groupId,
                GroupRoles.MEMBER, StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void addGroupAsAdmin(String login, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, USER_GROUPS_CF, HFactory.createColumn(groupId,
                GroupRoles.ADMIN, StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void removeGroup(String login, String groupId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, USER_GROUPS_CF, groupId, StringSerializer.get());
    }

    @Override
    public List<String> findGroups(String login) {
        List<String> groups = new ArrayList<String>();
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(USER_GROUPS_CF)
                .setKey(login)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        for (HColumn<String, String> column : result.getColumns()) {
            groups.add(column.getName());
        }
        return groups;
    }

    @Override
    public Collection<String> findGroupsAsAdmin(String login) {
        List<String> groups = new ArrayList<String>();
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(USER_GROUPS_CF)
                .setKey(login)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        for (HColumn<String, String> column : result.getColumns()) {
            if (column.getValue() != null && column.getValue().equals(GroupRoles.ADMIN)) {
                groups.add(column.getName());
            }
        }
        return groups;
    }
}
