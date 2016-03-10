package fr.ippon.tatami.repository;

<<<<<<< HEAD
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;
import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.GroupMember;
import fr.ippon.tatami.domain.enums.GroupRoles;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.in;

/**
 * Cassandra repository for the Group entity.
=======
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
>>>>>>> story-transitionToJhipster
 */
@Repository
public class GroupRepository {

    @Inject
    private Session session;

<<<<<<< HEAD
    private Mapper<Group> mapper;

    private Mapper<GroupMember> mapperMember;

    @PostConstruct
    public void init() {
        mapper = new MappingManager(session).mapper(Group.class);
        mapperMember = new MappingManager(session).mapper(GroupMember.class);
    }

    public Group createGroup(Group group) {
        mapper.save(group);
        return group;
    }

    public GroupMember addMember(GroupMember member) {
        mapperMember.save(member);
        return member;
    }

    public void removeMember(GroupMember member) {
        mapperMember.delete();
    }

    public void incrementCounter(UUID groupId) {
        Group group = mapper.get(groupId);
        group.setCounter(group.getCounter() + 1);
        mapper.save(group);
    }

    public void decrementCounter(UUID groupId) {
        Group group = mapper.get(groupId);
        group.setCounter(group.getCounter() - 1);
        mapper.save(group);
    }

    public List<UUID> getGroupsFromUser(String login) {
        Statement statement = QueryBuilder.select()
            .column("group_id")
            .from("group_member")
            .where(eq("login", login));
        return session.execute(statement)
            .all()
            .stream()
            .map(e -> e.getUUID("group_id"))
            .collect(Collectors.toList());
    }

    public List<Group> getGroupsFromIds(List<UUID> ids) {
        Statement statement = QueryBuilder.select()
            .from("group")
            .where(in("id", ids));
        return mapper.map(session.execute(statement)).all();
    }

    public boolean isAdministrator(UUID id, String login) {
        Statement statement = QueryBuilder.select()
            .column("role")
            .from("group_member")
            .where(eq("group_id", id))
            .and(eq("login", login));
        return GroupRoles.valueOf(session.execute(statement).one().getString("role")) == GroupRoles.ADMIN;
=======
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
>>>>>>> story-transitionToJhipster
    }
}
