package fr.ippon.tatami.domain.line;

import com.datastax.driver.mapping.annotations.Column;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;

import java.util.UUID;

/**
 * Created by lnorregaard on 25/11/15.
 */
@Table(name="timeline")
public class TimeLine {
    @PartitionKey
    private UUID id;

    @Column
    private String login;

    @Column
    private UUID statusId;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public UUID getStatusId() {
        return statusId;
    }

    public void setStatusId(UUID statusId) {
        this.statusId = statusId;
    }
}
