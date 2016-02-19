package fr.ippon.tatami.repository;

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
 */
@Repository
public class GroupRepository {

    @Inject
    private Session session;

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
    }
}
