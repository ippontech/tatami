package fr.ippon.tatami;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.TableMetadata;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.test.application.ApplicationTestConfiguration;
import fr.ippon.tatami.test.application.WebApplicationTestConfiguration;
import org.cassandraunit.CQLDataLoader;
import org.cassandraunit.DataLoader;
import org.cassandraunit.dataset.cql.ClassPathCQLDataSet;
import org.cassandraunit.dataset.json.ClassPathJsonDataSet;
import org.cassandraunit.utils.EmbeddedCassandraServerHelper;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextHierarchy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.inject.Inject;
import java.util.Collection;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextHierarchy({
        @ContextConfiguration(
                name = "root",
                classes = ApplicationTestConfiguration.class),
        @ContextConfiguration(
                name = "dispatcher",
                classes = WebApplicationTestConfiguration.class
        )
})
public abstract class AbstractCassandraTatamiTest {

    protected final Logger log = LoggerFactory.getLogger(this.getClass().getCanonicalName());

    private static boolean isInitialized = false;

    private static final Object lock = new Object();

    protected static Client client = null;
    protected static Session session = null;

    @Inject
    private CounterRepository counterRepository;
    private static Cluster cluster;

    @BeforeClass
    public static void beforeClass() throws Exception {
        synchronized (lock) {
            if (!isInitialized) {
                EmbeddedCassandraServerHelper.startEmbeddedCassandra();
                cluster = new Cluster.Builder().addContactPoints("127.0.0.1").withPort(9142).build();
                session = cluster.connect();
                CQLDataLoader dataLoader = new CQLDataLoader(session);
                dataLoader.load(new ClassPathCQLDataSet("dataset/dataset.cql",true,false,"testTatami"));
                isInitialized = true;
            } else {
                CQLDataLoader dataLoader = new CQLDataLoader(session);
                dataLoader.load(new ClassPathCQLDataSet("dataset/dataset.cql",false,false,"testTatami"));

            }
        }
    }

    @AfterClass
    public static void cleanupServer() {
        Collection<TableMetadata> tables = cluster.getMetadata().getKeyspace("testTatami").getTables();
        tables.forEach(table ->
                session.execute(QueryBuilder.truncate(table)));
//        EmbeddedCassandraServerHelper.cleanEmbeddedCassandra();
    }

    protected User constructAUser(String login, String firstName, String lastName) {
        User user = new User();
        user.setLogin(login);
        user.setPassword("");
        user.setUsername(DomainUtil.getUsernameFromLogin(login));
        user.setDomain(DomainUtil.getDomainFromLogin(login));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setJobTitle("web developer");
        counterRepository.createStatusCounter(user.getLogin());
        counterRepository.createFriendsCounter(user.getLogin());
        counterRepository.createFollowersCounter(user.getLogin());
        return user;
    }

    protected User constructAUser(String login) {
        return constructAUser(login, null, null);
    }

}