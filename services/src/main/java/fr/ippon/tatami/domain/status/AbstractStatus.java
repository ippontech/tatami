package fr.ippon.tatami.domain.status;

import java.io.Serializable;
import java.util.Date;

/**
 * Parent class for all statuses.
 */
public interface AbstractStatus extends Serializable {

    String getStatusId();

    StatusType getType();

    String getLogin();

    Date getStatusDate();

    String getGeoLocalization();
}
