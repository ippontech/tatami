package fr.ippon.tatami.uitest.support;

import fr.ippon.tatami.repository.cassandra.CassandraCounterRepository;
import fr.ippon.tatami.repository.cassandra.CassandraUserRepository;

@Singleton
public class AccountUtils {
	
	void assertUserExists(String login) {
		def keyspaceOperator = CassandraAccessUtils.instance.keyspaceOperator
		def em = CassandraAccessUtils.instance.entityManager
		def counterRepository = new CassandraCounterRepository(keyspaceOperator:keyspaceOperator)
		def repository = new CassandraUserRepository(keyspaceOperator:keyspaceOperator,em:em,counterRepository:counterRepository)
		assert repository.findUserByLogin(login) != null
	}
}
