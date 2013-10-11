package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.GroupRoles;
import fr.ippon.tatami.repository.GroupMembersRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

import static fr.ippon.tatami.config.ColumnFamilyKeys.GROUP_MEMBERS_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

/**
 * Cassandra implementation of the Group members repository.
 * <p/>
 * Structure :
 * - Key = group ID
 * - Name = login
 * - Value = role
 *
 * @author Julien Dubois
 */
@Repository
public class CassandraGroupMembersRepository implements GroupMembersRepository {

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void addMember(String groupId, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(groupId, GROUP_MEMBERS_CF, HFactory.createColumn(login,
                GroupRoles.MEMBER, StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void addAdmin(String groupId, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(groupId, GROUP_MEMBERS_CF, HFactory.createColumn(login,
                GroupRoles.ADMIN, StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void removeMember(String groupId, String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(groupId, GROUP_MEMBERS_CF, login, StringSerializer.get());
    }

    @Override
    public Map<String, String> findMembers(String groupId) {
        Map<String, String> members = new HashMap<String, String>();
        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                .setColumnFamily(GROUP_MEMBERS_CF)
                .setKey(groupId)
                .setRange(null, null, false, Integer.MAX_VALUE)
                .execute()
                .get();

        for (HColumn<String, String> column : result.getColumns()) {
            members.put(column.getName(), column.getValue());
        }
        return members;
    }
}
