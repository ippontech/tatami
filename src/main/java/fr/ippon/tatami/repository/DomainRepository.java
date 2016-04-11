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
 * - Name = email
 * - Value = time
 *
 * @author Julien Dubois
 */
@Repository
public class DomainRepository {

    public static final String DOMAIN_ID = "domainId";
    @Inject
    private Session session;


    public void addEmailInDomain(String domain, String email) {
        Statement statement = QueryBuilder.insertInto("domain")
                .value(DOMAIN_ID, domain)
                .value("email", email)
                .value("created", UUIDs.timeBased());
        session.execute(statement);
    }


    public void updateEmailInDomain(String domain, String email) {
        this.addEmailInDomain(domain, email);
    }


    public void deleteEmailInDomain(String domain, String email) {
        Statement statement = QueryBuilder.delete()
                .from("domain")
                .where(eq(DOMAIN_ID,domain))
                .and(eq("email",email));
        session.execute(statement);
    }


    public List<String> getEmailnamesInDomain(String domain, int pagination) {
        int maxColumns = pagination + Constants.PAGINATION_SIZE;
        Statement statement = QueryBuilder.select()
                .column("email")
                .from("domain")
                .where(eq(DOMAIN_ID, domain))
                .limit(maxColumns+1);

        ResultSet results = session.execute(statement);
        return results
                .all()
                .stream()
                .skip(pagination)
                .map(e -> e.getString("email"))
                .collect(Collectors.toList());
    }

    public List<String> getEmailsInDomain(String domain) {
        Statement statement = QueryBuilder.select()
            .column("email")
            .from("domain")
            .where(eq(DOMAIN_ID, domain));

        ResultSet results = session.execute(statement);
        return results
            .all()
            .stream()
            .map(e -> e.getString("email"))
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
