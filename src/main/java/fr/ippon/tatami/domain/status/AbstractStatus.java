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

    Date getStatusDate();

    String getGeoLocalization();

    void setStatusId(UUID uuid);

    void setStatusDate(Date date);

    String getUsername();

    String getDomain();

    void setUsername(String string);

    void setDomain(String domain);

    void setRemoved(boolean removed);
}
