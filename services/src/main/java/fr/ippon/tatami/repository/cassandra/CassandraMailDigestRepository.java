package fr.ippon.tatami.repository.cassandra;

import fr.ippon.tatami.config.Constants;
import fr.ippon.tatami.domain.DigestType;
import fr.ippon.tatami.repository.MailDigestRepository;
import org.springframework.stereotype.Repository;
import fr.ippon.tatami.config.ColumnFamilyKeys;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;


/**
 * MailDigestRepository implementation for cassandra
 * <p/>
 * Structure :
 * - Key = digestType_[day]_domain
 * - Name = login
 * - Value = time
 * <p/>
 * Note : in the key, the [day] part is only used for weekly digest and
 * represents the day the user subscribed to the digest.
 *
 * @author Pierre Rust
 */
@Repository
public class CassandraMailDigestRepository implements MailDigestRepository {


    @Override
    public void subscribeToDigest(DigestType digestType, String login, String domain, String day) {

        Calendar cal = Calendar.getInstance();

//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.insert(buildKey(digestType, domain, day), ColumnFamilyKeys.MAILDIGEST_CF,
//                HFactory.createColumn(login, cal.getTimeInMillis(), StringSerializer.get(), LongSerializer.get()));
    }

    @Override
    public void unsubscribeFromDigest(DigestType digestType, String login, String domain, String day) {
//        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
//        mutator.delete(buildKey(digestType, domain, day), ColumnFamilyKeys.MAILDIGEST_CF, login, StringSerializer.get());
    }

    @Override
    public List<String> getLoginsRegisteredToDigest(DigestType digestType, String domain,
                                                    String day, int pagination) {

        List<String> logins = new ArrayList<String>();
//        ColumnSlice<String, String> result = createSliceQuery(keyspaceOperator,
//                StringSerializer.get(), StringSerializer.get(), StringSerializer.get())
//                .setColumnFamily(ColumnFamilyKeys.MAILDIGEST_CF)
//                .setKey(buildKey(digestType, domain, day))
//                .setRange(null, null, false, Integer.MAX_VALUE)
//                .execute()
//                .get();

        int index = 0;
//        for (HColumn<String, String> column : result.getColumns()) {
//            // We take one more item, to display (or not) the "next" button if there is an item after the displayed list.
//            if (index > pagination + Constants.PAGINATION_SIZE) {
//                break;
//            }
//            if (index >= pagination) {
//                logins.add(column.getName());
//            }
//            index++;
//        }
        return logins;
    }

    /**
     * @return the row key
     */
    private String buildKey(DigestType digestType, String domain, String day) {
        String key;
        if (DigestType.WEEKLY_DIGEST == digestType) {
            key = digestType.toString() + "_" + day + "_" + domain;
        } else {
            key = digestType + "_" + domain;
        }
        return key;
    }

}
