package fr.ippon.tatami.repository;

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
public abstract class AbstractFriendRepository {

    @Inject
    Session session;

    protected abstract String getFriendsTable();

    public void addFriend(String username, String friendTag) {
        Statement statement = QueryBuilder.insertInto(getFriendsTable())
                .value("username", username)
                .value("friendUsername", friendTag);
        session.execute(statement);

    }

    public void removeFriend(String username, String friendTag) {
        Statement statement = QueryBuilder.delete().from(getFriendsTable())
                .where(eq("username", username))
                .and(eq("friendUsername", friendTag));
        session.execute(statement);
    }

    public List<String> findFriends(String username) {
        Statement statement = QueryBuilder.select()
                .column("friendUsername")
                .from(getFriendsTable())
                .where(eq("username", username));
        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("friendUsername"))
                .collect(Collectors.toList());
    }
}
