package fr.ippon.tatami.domain.status;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Parent class for all statuses.
 */
public abstract class AbstractStatus implements Serializable {

    private String statusId;

    @NotNull
    private StatusType type;

    @NotNull
    private String login;

    @NotNull
    private String username;

    @NotNull
    private String domain;

    private Date statusDate;

    public String getGeoLocalization() {
        return geoLocalization;
    }

    public void setGeoLocalization(String geoLocalization) {
        this.geoLocalization = geoLocalization;
    }

    private String geoLocalization;

    private boolean removed;

    public String getStatusId() {
        return statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
    }

    public StatusType getType() {
        return type;
    }

    public void setType(StatusType type) {
        this.type = type;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Date getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(Date statusDate) {
        this.statusDate = statusDate;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AbstractStatus that = (AbstractStatus) o;

        if (statusId != null ? !statusId.equals(that.statusId) : that.statusId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return statusId != null ? statusId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "AbstractStatus{" +
                "statusId='" + statusId + '\'' +
                ", type=" + type +
                ", login='" + login + '\'' +
                ", username='" + username + '\'' +
                ", domain='" + domain + '\'' +
                ", statusDate=" + statusDate +
                ", geoLocalization='" + geoLocalization + '\'' +
                ", removed=" + removed +
                '}';
    }
}
