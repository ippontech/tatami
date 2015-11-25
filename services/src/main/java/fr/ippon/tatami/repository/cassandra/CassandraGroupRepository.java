package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.repository.GroupRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;

import static fr.ippon.tatami.config.ColumnFamilyKeys.GROUP_CF;

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

//    @Inject

    @Override
    public String createGroup(String domain) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        String groupId = TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString();
//        mutator.insert(domain, GROUP_CF, HFactory.createColumn(groupId,
//                "", StringSerializer.get(), StringSerializer.get()));
//
        return null;
    }

    @Override
    public Group getGroupById(String domain, String groupId) {
//        ColumnQuery<String, String, String> query = HFactory.createStringColumnQuery(keyspaceOperator);
//        HColumn<String, String> column =
//                query.setColumnFamily(GROUP_CF)
//                        .setKey(domain)
//                        .setName(groupId)
//                        .execute()
//                        .get();

//        if (column != null) {
//            Group group = new Group();
//            group.setDomain(domain);
//            group.setGroupId(groupId);
//            return group;
//        } else {
            return null;
//        }
    }
}
