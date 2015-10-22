package fr.ippon.tatami.config.metrics;

import com.yammer.metrics.core.HealthCheck;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.exceptions.HectorException;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DOMAIN_CF;
import static me.prettyprint.hector.api.factory.HFactory.createRangeSlicesQuery;

/**
 * Metrics HealthCheck for Cassandra.
 */
public class CassandraHealthCheck extends HealthCheck {

    private final Keyspace keyspaceOperator;

    public CassandraHealthCheck(Keyspace keyspaceOperator) {
        super("Cassandra");
        this.keyspaceOperator = keyspaceOperator;
    }

    @Override
    public Result check() throws Exception {
        try {
            createRangeSlicesQuery(keyspaceOperator,
                    StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
                    .setColumnFamily(DOMAIN_CF)
                    .setRange(null, null, false, 1)
                    .execute()
                    .get();
            return Result.healthy();
        } catch (HectorException he) {
            return Result.unhealthy("Cannot connect to Cassandra Cluster : " + keyspaceOperator.getKeyspaceName());
        }
    }
}
