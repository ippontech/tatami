package fr.ippon.tatami.domain.status;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

/**
 * Parent class for all statuses.
 */
public interface AbstractStatus extends Serializable {

    UUID getStatusId();

    StatusType getType();

    String getLogin();

    Date getStatusDate();

    String getGeoLocalization();
}
