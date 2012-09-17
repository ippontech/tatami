package fr.ippon.tatami.uitest.support;

import fr.ippon.tatami.repository.cassandra.CassandraRegistrationRepository;
import fr.ippon.tatami.repository.cassandra.CassandraUserRepository;

@Singleton
public class AccountUtils {
	
	void assertUserExists(String login) {
		def keyspaceOperator = CassandraAccessUtils.instance.keyspaceOperator
		def em = CassandraAccessUtils.instance.entityManager
		def repository = new CassandraUserRepository(keyspaceOperator:keyspaceOperator,em:em)
		assert repository.findUserByLogin(login) != null
	}
}
