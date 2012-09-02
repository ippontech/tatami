package fr.ippon.tatami.uitest.support;

import static fr.ippon.tatami.config.ColumnFamilyKeys.REGISTRATION_CF;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.query.ColumnQuery;
import me.prettyprint.hom.EntityManagerImpl;

import org.springframework.core.env.Environment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import fr.ippon.tatami.config.CassandraConfiguration;

@Singleton(lazy=true)
public class CassandraAccessUtils {

	Keyspace keyspaceOperator
	EntityManagerImpl entityManager
	
	CassandraAccessUtils() {
		// TODO : use tatami.properties or tatami-uitest.properties ?
		StandardEnvironment env = new StandardEnvironment()
		def properties = [
				"cassandra.host" : "127.0.0.1:9160",
				"cassandra.clusterName" : "Tatami cluster",
				"cassandra.keyspace" : "tatami"
				]
		def propSource = new MapPropertySource("testProps",properties);
		env.getPropertySources().addFirst(propSource)
		CassandraConfiguration configuration = new CassandraConfiguration();
		configuration.env = env
		keyspaceOperator =  configuration.keyspaceOperator()
		entityManager =  configuration.entityManager(keyspaceOperator)
	}
	

}
