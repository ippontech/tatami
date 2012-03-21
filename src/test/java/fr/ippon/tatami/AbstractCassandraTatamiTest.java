package fr.ippon.tatami;

import org.cassandraunit.DataLoader;
import org.cassandraunit.dataset.json.ClassPathJsonDataSet;
import org.cassandraunit.utils.EmbeddedCassandraServerHelper;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/spring/applicationContext-test.xml" })
public abstract class AbstractCassandraTatamiTest {

	private static boolean isInitialized = false;

	@BeforeClass
	public static void beforeClass() throws Exception {
		if (!isInitialized) {
			EmbeddedCassandraServerHelper.startEmbeddedCassandra();
			/* create structure and load data */
			String clusterName = "Tatami cluster";
			String host = "localhost:9171";
			DataLoader dataLoader = new DataLoader(clusterName, host);
			dataLoader.load(new ClassPathJsonDataSet("dataset/dataset.json"));
			isInitialized = true;
		}
	}

}