package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.repository.FavoritelineRepository;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.serializers.UUIDSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static fr.ippon.tatami.config.ColumnFamilyKeys.FAVLINE_CF;
import static me.prettyprint.hector.api.factory.HFactory.createSliceQuery;

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
    private Keyspace keyspaceOperator;

    @Override
    @CacheEvict(value = "favorites-cache", key = "#login")
    public void addStatusToFavoriteline(String login, String statusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.insert(login, FAVLINE_CF, HFactory.createColumn(UUID.fromString(statusId), "",
                UUIDSerializer.get(), StringSerializer.get()));
    }

    @Override
    @CacheEvict(value = "favorites-cache", key = "#login")
    public void removeStatusFromFavoriteline(String login, String statusId) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.delete(login, FAVLINE_CF, UUID.fromString(statusId), UUIDSerializer.get());
    }

    @Override
    @Cacheable("favorites-cache")
    public List<String> getFavoriteline(String login) {
        List<String> line = new ArrayList<String>();
        ColumnSlice<UUID, String> result = createSliceQuery(keyspaceOperator,
                StringSerializer.get(), UUIDSerializer.get(), StringSerializer.get())
                .setColumnFamily(FAVLINE_CF)
                .setKey(login)
                .setRange(null, null, true, 50)
                .execute()
                .get();

        for (HColumn<UUID, String> column : result.getColumns()) {
            line.add(column.getName().toString());
        }
        return line;
    }

    @Override
    public void deleteFavoriteline(String login) {
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(login, FAVLINE_CF);
        mutator.execute();
    }
}
