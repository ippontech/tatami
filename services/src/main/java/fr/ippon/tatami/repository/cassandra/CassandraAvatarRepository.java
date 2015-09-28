package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.domain.Avatar;
import fr.ippon.tatami.repository.AvatarRepository;
import me.prettyprint.cassandra.serializers.BytesArraySerializer;
import me.prettyprint.cassandra.serializers.DateSerializer;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.utils.TimeUUIDUtils;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.ColumnQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Date;

import static fr.ippon.tatami.config.ColumnFamilyKeys.AVATAR_CF;

@Repository
public class CassandraAvatarRepository implements AvatarRepository {

    private final Logger log = LoggerFactory.getLogger(CassandraAttachmentRepository.class);

    private final String CONTENT = "content";
    private final String FILENAME = "filename";
    private final String SIZE = "size";
    private final String CREATION_DATE = "creation_date";

    @Inject
    private Keyspace keyspaceOperator;

    @Override
    public void createAvatar(Avatar avatar) {

        String avatarId = TimeUUIDUtils.getUniqueTimeUUIDinMillis().toString();
        log.debug("Creating avatar : {}", avatar);


        avatar.setAvatarId(avatarId);
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());

        mutator.insert(avatarId, AVATAR_CF, HFactory.createColumn(CONTENT,
                avatar.getContent(), StringSerializer.get(), BytesArraySerializer.get()));

        mutator.insert(avatarId, AVATAR_CF, HFactory.createColumn(FILENAME,
                avatar.getFilename(), StringSerializer.get(), StringSerializer.get()));

        mutator.insert(avatarId, AVATAR_CF, HFactory.createColumn(SIZE,
                avatar.getSize(), StringSerializer.get(), LongSerializer.get()));

        mutator.insert(avatarId, AVATAR_CF, HFactory.createColumn(CREATION_DATE,
                avatar.getCreationDate(), StringSerializer.get(), DateSerializer.get()));

    }

    @Override
    @CacheEvict(value = "avatar-cache")
    public void removeAvatar(String avatarId) {
        log.debug("Avatar deleted : {}", avatarId);

        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(avatarId, AVATAR_CF);
        mutator.execute();
    }

    @Override
    @Cacheable("avatar-cache")
    public Avatar findAvatarById(String avatarId) {
        if (avatarId == null) {
            return null;
        }
        log.debug("Finding avatar : {}", avatarId);

        Avatar avatar = this.findAttachmentMetadataById(avatarId);

        if (avatar == null) {
            return null;
        }

        ColumnQuery<String, String, byte[]> queryAttachment = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), BytesArraySerializer.get());

        HColumn<String, byte[]> columnAttachment =
                queryAttachment.setColumnFamily(AVATAR_CF)
                        .setKey(avatarId)
                        .setName(CONTENT)
                        .execute()
                        .get();

        avatar.setContent(columnAttachment.getValue());
        return avatar;
    }


    Avatar findAttachmentMetadataById(String avatarId) {
        if (avatarId == null) {
            return null;
        }
        Avatar avatar = new Avatar();
        avatar.setAvatarId(avatarId);

        ColumnQuery<String, String, String> queryFilename = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), StringSerializer.get());

        HColumn<String, String> columnFilename =
                queryFilename.setColumnFamily(AVATAR_CF)
                        .setKey(avatarId)
                        .setName(FILENAME)
                        .execute()
                        .get();

        if (columnFilename != null && columnFilename.getValue() != null) {
            avatar.setFilename(columnFilename.getValue());
        } else {
            return null;
        }

        ColumnQuery<String, String, Long> querySize = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), LongSerializer.get());

        HColumn<String, Long> columnSize =
                querySize.setColumnFamily(AVATAR_CF)
                        .setKey(avatarId)
                        .setName(SIZE)
                        .execute()
                        .get();

        if (columnSize != null && columnSize.getValue() != null) {
            avatar.setSize(columnSize.getValue());
        } else {
            return null;
        }

        ColumnQuery<String, String, Date> queryCreationDate = HFactory.createColumnQuery(keyspaceOperator,
                StringSerializer.get(), StringSerializer.get(), DateSerializer.get());

        HColumn<String, Date> columnCreationDate =
                queryCreationDate.setColumnFamily(AVATAR_CF)
                        .setKey(avatarId)
                        .setName(CREATION_DATE)
                        .execute()
                        .get();

        if (columnCreationDate != null && columnCreationDate.getValue() != null) {
            avatar.setCreationDate(columnCreationDate.getValue());
        } else {
            avatar.setCreationDate(new Date());
        }

        return avatar;
    }

}
