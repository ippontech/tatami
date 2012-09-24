package fr.ippon.tatami;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.CounterRepository;
import fr.ippon.tatami.service.util.DomainUtil;
import fr.ippon.tatami.test.application.ApplicationTestConfiguration;
import org.cassandraunit.DataLoader;
import org.cassandraunit.dataset.json.ClassPathJsonDataSet;
import org.cassandraunit.utils.EmbeddedCassandraServerHelper;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import javax.inject.Inject;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
        classes = ApplicationTestConfiguration.class,
        loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("default")
public abstract class AbstractCassandraTatamiTest {

    private static boolean isInitialized = false;

    protected static Client client = null;

    @Inject
    private CounterRepository counterRepository;

    @BeforeClass
    public static void beforeClass() throws Exception {
        if (!isInitialized) {
            EmbeddedCassandraServerHelper.startEmbeddedCassandra();
            /* create structure and load data */
            String clusterName = "Tatami cluster";
            String host = "localhost:9171";
            DataLoader dataLoader = new DataLoader(clusterName, host);
            dataLoader.load(new ClassPathJsonDataSet("dataset/dataset.json"));

            final ImmutableSettings.Builder builder = ImmutableSettings.settingsBuilder();
            builder.put("cluster.name", clusterName);

            final Node node = NodeBuilder.nodeBuilder().settings(builder.build()).local(true).node();
            client = node.client();

            isInitialized = true;
        }
    }

    @AfterClass
    public static void afterClass() throws Exception {
        if (client != null) {
            client.close();
        }
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