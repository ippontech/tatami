package fr.ippon.tatami;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;
import fr.ippon.tatami.security.SecurityUtilsIntTest;
import fr.ippon.tatami.web.rest.AccountResourceIntTest;
import fr.ippon.tatami.web.rest.FriendshipResourceIntTest;
import fr.ippon.tatami.web.rest.GroupResourceIntTest;
import fr.ippon.tatami.web.rest.UserResourceIntTest;
import org.apache.cassandra.exceptions.ConfigurationException;
import org.apache.thrift.transport.TTransportException;
import org.cassandraunit.CQLDataLoader;
import org.cassandraunit.dataset.cql.ClassPathCQLDataSet;
import org.cassandraunit.utils.EmbeddedCassandraServerHelper;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;

import java.io.IOException;

@RunWith(Suite.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebIntegrationTest
@Suite.SuiteClasses({
    SecurityUtilsIntTest.class,
    AccountResourceIntTest.class,
    UserResourceIntTest.class,
    FriendshipResourceIntTest.class,
    GroupResourceIntTest.class
})
public class TatamiSuiteIntTest {

    private static final String CASSANDRA_UNIT_KEYSPACE = "cassandra_unit_keyspace";

    @BeforeClass
    public static void before() throws InterruptedException, TTransportException, ConfigurationException, IOException {
        // Start Cassandra
        EmbeddedCassandraServerHelper.startEmbeddedCassandra();
        Cluster cluster = new Cluster.Builder().addContactPoints("127.0.0.1").withPort(9142).build();
        Session session = cluster.connect();
        CQLDataLoader dataLoader = new CQLDataLoader(session);
        dataLoader.load(new ClassPathCQLDataSet("config/cql/create-tables.cql", true, CASSANDRA_UNIT_KEYSPACE));
    }

    @Before
    public void setup() {
        // Set Security context
        TestUtil.createAdminSecurityContext();
    }

    @AfterClass
    public static void after() {
        EmbeddedCassandraServerHelper.cleanEmbeddedCassandra();
    }

}
