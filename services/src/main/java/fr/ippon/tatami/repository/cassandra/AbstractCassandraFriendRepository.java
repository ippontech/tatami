package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;

import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Abstract class for managing friends : users or tags that a user follows.
 */
public abstract class AbstractCassandraFriendRepository {

    @Inject
    Session session;

    protected abstract String getFriendsTable();

    public void addFriend(String login, String friendTag) {
        Statement statement = QueryBuilder.insertInto(getFriendsTable())
                .value("login", login)
                .value("friendLogin", friendTag);
        session.execute(statement);

    }

    public void removeFriend(String login, String friendTag) {
        Statement statement = QueryBuilder.delete().from(getFriendsTable())
                .where(eq("login", login))
                .and(eq("friendLogin", friendTag));
        session.execute(statement);
    }

    public List<String> findFriends(String login) {
        Statement statement = QueryBuilder.select()
                .column("friendLogin")
                .from(getFriendsTable())
                .where(eq("login", login));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("friendLogin"))
                .collect(Collectors.toList());
    }
}
