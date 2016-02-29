package fr.ippon.tatami.domain.status;

import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.PartitionKey;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.UUID;

/**
 * Mention a user that someone started following him.
 */
public class MentionFriend implements AbstractStatus {
    @PartitionKey
    private UUID statusId;

    @NotNull
    @Column
    private StatusType type;

    @NotNull
    @Column
    private String login;

    @NotNull
    @Column
    private String username;

    @NotNull
    @Column
    private String domain;

    @Column
    private Date statusDate;

    public String getGeoLocalization() {
        return geoLocalization;
    }

    public void setGeoLocalization(String geoLocalization) {
        this.geoLocalization = geoLocalization;
    }

    @Column
    private String geoLocalization;

    @Column
    private boolean removed;

    public UUID getStatusId() {
        return statusId;
    }

    public void setStatusId(UUID statusId) {
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

    private String followerLogin;

    public String getFollowerLogin() {
        return followerLogin;
    }

    public void setFollowerLogin(String followerLogin) {
        this.followerLogin = followerLogin;
    }

    @Override
    public String toString() {
        return "MentionFriend{" +
                "followerLogin='" + followerLogin + '\'' +
                "} " + super.toString();
    }
}
