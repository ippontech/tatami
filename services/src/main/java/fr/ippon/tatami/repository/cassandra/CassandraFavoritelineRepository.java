package fr.ippon.tatami.repository.cassandra;

import com.datastax.driver.core.BatchStatement;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import fr.ippon.tatami.repository.FavoritelineRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static com.datastax.driver.core.querybuilder.QueryBuilder.gt;
import static com.datastax.driver.core.querybuilder.QueryBuilder.lt;
import static fr.ippon.tatami.config.ColumnFamilyKeys.FAVLINE_CF;

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
public class CassandraFavoritelineRepository implements FavoritelineRepository {

    @Inject
    Session session;

    @Override
    @CacheEvict(value = "favorites-cache", key = "#login")
    public void addStatusToFavoriteline(String login, String statusId) {
        Statement statement = QueryBuilder.insertInto("favline")
                .value("key", login)
                .value("status", UUID.fromString(statusId));
        session.execute(statement);
    }

    @Override
    @CacheEvict(value = "favorites-cache", key = "#login")
    public void removeStatusFromFavoriteline(String login, String statusId) {
        Statement statement = QueryBuilder.delete()
                .from("favline")
                .where(eq("key",login))
                .and(eq("status",UUID.fromString(statusId)));
        session.execute(statement);
    }

    @Override
    @Cacheable("favorites-cache")
    public List<String> getFavoriteline(String login) {
        Statement statement = QueryBuilder.select()
                .column("status")
                .from("favline")
                .where(eq("key", login))
                .limit(50);
        ResultSet results = session.execute(statement);

        return results
                .all()
                .stream()
                .map(e -> e.getUUID("status").toString())
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFavoriteline(String login) {
        Statement statement = QueryBuilder.delete()
                .from("favline")
                .where(eq("key",login));
        session.execute(statement);
    }
}
