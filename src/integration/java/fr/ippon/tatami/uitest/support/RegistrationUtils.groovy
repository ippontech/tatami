package fr.ippon.tatami.uitest.support;

import fr.ippon.tatami.repository.cassandra.CassandraRegistrationRepository;

@Singleton
public class RegistrationUtils {
	
	String getRegistrationKeyByLogin(String login) {
		def keyspaceOperator = CassandraAccessUtils.getInstance().getKeyspaceOperator()
		def repository = new CassandraRegistrationRepository(keyspaceOperator:keyspaceOperator)
		
		def registrationsByLogin = repository._getAllRegistrationKeyByLogin()
		return registrationsByLogin[login]		
	}
}
