package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.repository.FavoritelineRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.desc;
import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Cassandra implementation of the favoriteline repository.
 * <p/>
 * Structure :
 * - Key = login
 * - Name = statusId
 * - Value = ""
 *
 * @author Julien Dubois
 */
@Repository
public class FavoritelineRepository {

    @Inject
    Session session;


    @CacheEvict(value = "favorites-cache", key = "#login")
    public void addStatusToFavoriteline(String login, String statusId) {
        Statement statement = QueryBuilder.insertInto("favline")
                .value("key", login)
                .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }


    @CacheEvict(value = "favorites-cache", key = "#login")
    public void removeStatusFromFavoriteline(String login, String statusId) {
        Statement statement = QueryBuilder.delete()
                .from("favline")
                .where(eq("key",login))
                .and(eq("status",UUID.fromString(statusId)));
        session.execute(statement);
    }


    @Cacheable("favorites-cache")
    public List<String> getFavoriteline(String login) {
        Statement statement = QueryBuilder.select()
                .column("status")
                .from("favline")
                .where(eq("key", login))
                .orderBy(desc("status"))
                .limit(50);
        ResultSet results = session.execute(statement);

        return results
                .all()
                .stream()
                .map(e -> e.getUUID("status").toString())
                .collect(Collectors.toList());
    }


    public void deleteFavoriteline(String login) {
        Statement statement = QueryBuilder.delete()
                .from("favline")
                .where(eq("key",login));
        session.execute(statement);
    }
}
