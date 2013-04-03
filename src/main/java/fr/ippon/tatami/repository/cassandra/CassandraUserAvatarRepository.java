package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.repository.UserAvatarRepository;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.cassandra.service.template.ColumnFamilyResult;
import me.prettyprint.cassandra.service.template.ColumnFamilyTemplate;
import me.prettyprint.cassandra.service.template.ThriftColumnFamilyTemplate;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.USER_AVATAR_CF;

/**
 * Created with IntelliJ IDEA.
 * User: hellsingblack
 * Date: 26/03/13
 * Time: 15:18
 * To change this template use File | Settings | File Templates.
 *
 */
@Repository
public class CassandraUserAvatarRepository
        implements UserAvatarRepository {

    private ColumnFamilyTemplate<String, UUID> avatarTemplate;

    @Inject
    private Keyspace keyspaceOperator;

    @PostConstruct
    public void init() {
        avatarTemplate = new ThriftColumnFamilyTemplate<String, UUID>(keyspaceOperator,
                USER_AVATAR_CF,
                StringSerializer.get(),
                UUIDSerializer.get());

        avatarTemplate.setCount(Constants.CASSANDRA_MAX_COLUMNS);
    }

    @Override
    public void addAvatarId(String login, String avatarId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, USER_AVATAR_CF, HFactory.createColumn(UUID.fromString(avatarId),
                Calendar.getInstance().getTimeInMillis(), UUIDSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void removeAvatarId(String login, String avatarId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, USER_AVATAR_CF, UUID.fromString(avatarId), UUIDSerializer.get());
    }

    @Override
    public Collection<String> findAvatarIds(String login) {
        ColumnFamilyResult<String, UUID> result = avatarTemplate.queryColumns(login);
        Collection<String> avatarIds = new ArrayList<String>();
        for (UUID columnName : result.getColumnNames()) {
            avatarIds.add(columnName.toString());
        }
        return avatarIds;

    }

}
