package fr.ippon.tatami.config.metrics;

import com.yammer.metrics.core.HealthCheck;

import static fr.ippon.tatami.config.ColumnFamilyKeys.DOMAIN_CF;

/**
 * Metrics HealthCheck for Cassandra.
 */
public class CassandraHealthCheck extends HealthCheck {
    /**
     * Create a new {@link HealthCheck} instance with the given name.
     *
     * @param name the name of the health check (and, ideally, the name of the underlying
     *             component the health check tests)
     */
    protected CassandraHealthCheck(String name) {
        super(name);
    }

    @Override
    protected Result check() throws Exception {
        return null;
    }


//    public CassandraHealthCheck(Keyspace keyspaceOperator) {
//        super("Cassandra");
//        this.keyspaceOperator = keyspaceOperator;
//    }
//
//    @Override
//    public Result check() throws Exception {
//        try {
//            createRangeSlicesQuery(keyspaceOperator,
//                    StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
//                    .setColumnFamily(DOMAIN_CF)
//                    .setRange(null, null, false, 1)
//                    .execute()
//                    .get();
//            return Result.healthy();
//        } catch (HectorException he) {
//            return Result.unhealthy("Cannot connect to Cassandra Cluster : " + keyspaceOperator.getKeyspaceName());
//        }
//    }
}
