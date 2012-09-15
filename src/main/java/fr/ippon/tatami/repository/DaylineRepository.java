package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.UserStatusStat;

import java.util.Collection;

/**
 * The Dayline Repository, which stores statistics per day.
 *
 * @author Julien Dubois
 */
public interface DaylineRepository {

    /**
     * Add a status to the repository.
     */
    void addStatusToDayline(Status status, String day);

    /**
     * Get the statistics for one day, in the form &lt;username, number of status updates&gt;.
     */
    Collection<UserStatusStat> getDayline(String domain, String day);
}
