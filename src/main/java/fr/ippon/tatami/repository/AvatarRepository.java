package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.ColumnFamilyKeys;
import fr.ippon.tatami.domain.Avatar;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.nio.ByteBuffer;
import java.util.UUID;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

@Repository
public class AvatarRepository {

    private final Logger log = LoggerFactory.getLogger(AttachmentRepository.class);

    private final String CONTENT = "content";
    private final String FILENAME = "filename";
    private final String SIZE = "size";
    private final String CREATION_DATE = "creation_date";

    @Inject
    private Session session;


    public void createAvatar(Avatar avatar) {
        ByteBuffer content = null;
        if (avatar.getContent() != null) {
            content = ByteBuffer.wrap(avatar.getContent());
        }
        avatar.setAvatarId(UUIDs.timeBased().toString());
        Statement statement = QueryBuilder.insertInto(ColumnFamilyKeys.AVATAR_CF)
            .value("id", UUID.fromString(avatar.getAvatarId()))
            .value(FILENAME, avatar.getFilename())
            .value(CONTENT, content)
            .value(SIZE, avatar.getSize())
            .value(CREATION_DATE, avatar.getCreationDate());
        session.execute(statement);
    }

    @CacheEvict(value = "avatar-cache")
    public void removeAvatar(String avatarId) {
        log.debug("Avatar deleted : {}", avatarId);
        Statement statement = QueryBuilder.delete()
            .from(ColumnFamilyKeys.AVATAR_CF)
            .where(eq("id", UUID.fromString(avatarId)));
        session.execute(statement);
    }

    @Cacheable("avatar-cache")
    public Avatar findAvatarById(String avatarId) {
        if (avatarId == null) {
            return null;
        }
        log.debug("Finding avatar : {}", avatarId);

        Avatar avatar = this.findAttachmentMetadataById(avatarId);

        if (avatar != null) {
            Statement statement = QueryBuilder.select()
                .column(CONTENT)
                .from(ColumnFamilyKeys.AVATAR_CF)
                .where(eq("id", UUID.fromString(avatarId)));

            ResultSet results = session.execute(statement);
            avatar.setContent(results.one().getBytes(CONTENT).array());
        }

        return avatar;
    }

    public Avatar findAvatarByFilename(String filename) {
        if (filename == null) {
            return null;
        }

        Statement statement = QueryBuilder.select()
            .column("id")
            .column(FILENAME)
            .column(SIZE)
            .column(CREATION_DATE)
            .from(ColumnFamilyKeys.AVATAR_CF)
            .where(eq("filename", filename));

        ResultSet results = session.execute(statement);
        return loadAvatar(results);
    }

    private Avatar loadAvatar(ResultSet results) {
        if (!results.isExhausted()) {
            Row row = results.one();
            Avatar avatar = new Avatar();
            avatar.setAvatarId(row.getUUID("id").toString());
            avatar.setFilename(row.getString(FILENAME));
            avatar.setSize(row.getLong(SIZE));
            avatar.setCreationDate(row.getDate(CREATION_DATE));
            return avatar;
        }
        return null;
    }


    Avatar findAttachmentMetadataById(String avatarId) {
        if (avatarId == null) {
            return null;
        }

        Statement statement = QueryBuilder.select()
            .column("id")
            .column(FILENAME)
            .column(SIZE)
            .column(CREATION_DATE)
            .from(ColumnFamilyKeys.AVATAR_CF)
            .where(eq("id", UUID.fromString(avatarId)));

        ResultSet results = session.execute(statement);
        return loadAvatar(results);
    }

}
