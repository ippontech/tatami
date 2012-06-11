package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.UserStatusStat;

import java.util.Collection;
import java.util.Date;

/**
 * The Dayline Respository, which stores statistics per day.
 *
 * @author Julien Dubois
 */
public interface DaylineRepository {

    /**
     * Add a status to the repository.
     */
    void addStatusToDayline(Status status, String domain, Date date);

    /**
     * Get the statistics for one day, in the form &lt;login, number of tweets&gt;.
     */
    Collection<UserStatusStat> getDayline(String domain, Date date);
}
