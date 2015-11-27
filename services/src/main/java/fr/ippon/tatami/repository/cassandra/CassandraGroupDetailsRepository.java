package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.repository.GroupDetailsRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

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

//    @Inject

    @Override
    public void createGroupDetails(String groupId, String name, String description, boolean publicGroup) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(NAME,
//                name, StringSerializer.get(), StringSerializer.get()));
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(DESCRIPTION,
//                description, StringSerializer.get(), StringSerializer.get()));
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(PUBLIC_GROUP,
//                (Boolean.valueOf(publicGroup)).toString(), StringSerializer.get(), StringSerializer.get()));
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(ARCHIVED_GROUP,
//                Boolean.FALSE.toString(), StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public void editGroupDetails(UUID groupId, String name, String description, boolean archivedGroup) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(NAME,
//                name, StringSerializer.get(), StringSerializer.get()));
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(DESCRIPTION,
//                description, StringSerializer.get(), StringSerializer.get()));
//        mutator.insert(groupId, GROUP_DETAILS_CF, HFactory.createColumn(ARCHIVED_GROUP,
//                (Boolean.valueOf(archivedGroup)).toString(), StringSerializer.get(), StringSerializer.get()));
    }

    @Override
    public Group getGroupDetails(UUID groupId) {
        Group group = new Group();
        group.setGroupId(groupId);
        group.setPublicGroup(false);
//        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
//                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
//                .setColumnFamily(GROUP_DETAILS_CF)
//                .setKey(groupId)
//                .setRange(null, null, false, 4)
//                .execute()
//                .get();
//
//        for (HColumn<String, String> column : result.getColumns()) {
//            if (column.getName().equals(NAME)) {
//                group.setName(column.getValue());
//            } else if (column.getName().equals(DESCRIPTION)) {
//                group.setDescription(column.getValue());
//            } else if (column.getName().equals(PUBLIC_GROUP)) {
//                if (column.getValue().equals(Boolean.TRUE.toString())) {
//                    group.setPublicGroup(true);
//                }
//            } else if (column.getName().equals(ARCHIVED_GROUP)) {
//                if (column.getValue().equals(Boolean.TRUE.toString())) {
//                    group.setArchivedGroup(true);
//                }
//            }
//        }
        return group;
    }
}
