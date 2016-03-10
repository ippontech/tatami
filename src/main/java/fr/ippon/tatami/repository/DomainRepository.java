package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.utils.UUIDs;
import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.Domain;
import fr.ippon.tatami.repository.DomainRepository;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;

/**
 * Cassandra implementation of the Domain repository.
 * <p/>
 * Structure :
 * - Key = domain
 * - Name = login
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class DomainRepository {

    public static final String DOMAIN_ID = "domainId";
    @Inject
    private Session session;


    public void addUserInDomain(String domain, String login) {
        Statement statement = QueryBuilder.insertInto("domain")
                .value(DOMAIN_ID, domain)
                .value("login", login)
                .value("created", UUIDs.timeBased());
        session.execute(statement);
    }


    public void updateUserInDomain(String domain, String login) {
        this.addUserInDomain(domain, login);
    }


    public void deleteUserInDomain(String domain, String login) {
        Statement statement = QueryBuilder.delete()
                .from("domain")
                .where(eq(DOMAIN_ID,domain))
                .and(eq("login",login));
        session.execute(statement);
    }


    public List<String> getLoginsInDomain(String domain, int pagination) {
        int maxColumns = pagination + Constants.PAGINATION_SIZE;
        Statement statement = QueryBuilder.select()
                .column("login")
                .from("domain")
                .where(eq(DOMAIN_ID, domain))
                .limit(maxColumns+1);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .skip(pagination)
                .map(e -> e.getString("login"))
                .collect(Collectors.toList());
    }


    public List<String> getLoginsInDomain(String domain) {
        Statement statement = QueryBuilder.select()
                .column("login")
                .from("domain")
                .where(eq(DOMAIN_ID, domain));

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .map(e -> e.getString("login"))
                .collect(Collectors.toList());
    }


    public Set<Domain> getAllDomains() {
        Statement statement = QueryBuilder.select()
                .distinct()
                .column(DOMAIN_ID)
                .from("domain");

        ResultSet results = session.execute(statement);
        Set<Domain> domainMaps = new HashSet<>();

        for (Row result : results) {
            String domainId = result.getString(DOMAIN_ID);
            Domain domain = new Domain();
            domain.setName(domainId);
            domain.setNumberOfUsers((int)getCountForDomain(domain.getName()));
            domainMaps.add(domain);
        }
        return domainMaps;
    }

    private long getCountForDomain(String name) {
        Statement statement = QueryBuilder.select()
                .countAll()
                .from("domain")
                .where(eq(DOMAIN_ID,name));

        ResultSet results = session.execute(statement);
        if (!results.isExhausted()) {
            return results.one().getLong(0);
        }
        return 0L;
    }
}
