package fr.ippon.tatami.repository;

import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Statement;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.stream.Collectors;

import static com.datastax.driver.core.querybuilder.QueryBuilder.eq;
import static fr.ippon.tatami.config.ColumnFamilyKeys.USERSBLOCKED_CF;

@Repository
public class BlockRepository {

    @Inject
    Session session;

    private String usersBlockedTable = USERSBLOCKED_CF;

    public void blockUser(String currentEmail, String blockedEmail){
        Statement statement = QueryBuilder.insertInto(usersBlockedTable)
            .value("email", currentEmail)
            .value("blockedEmail", blockedEmail);
        session.execute(statement);
    }

    public void unblockUser(String currentEmail, String unblockedEmail){
        Statement statement = QueryBuilder.delete().from(usersBlockedTable)
            .where(eq("email", currentEmail))
            .and(eq("blockedEmail", unblockedEmail));
        session.execute(statement);
    }

    public Collection<String> getUsersBlockedBy(String userEmail) {
        Statement statement = QueryBuilder.select()
            .column("blockedEmail")
            .from(usersBlockedTable)
            .where(eq("email", userEmail));
        ResultSet results = session.execute(statement);
        return results
            .all()
            .stream()
            .map(e -> e.getString("blockedEmail"))
            .collect(Collectors.toList());
    }

    public boolean isBlocked(String blockingEmail, String blockedEmail){
        Collection<String> blockedEmails = getUsersBlockedBy(blockingEmail);
        return blockedEmails.contains(blockedEmail);
    }
}
