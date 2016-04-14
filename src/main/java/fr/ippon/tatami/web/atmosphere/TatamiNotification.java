package fr.ippon.tatami.web.atmosphere;

import fr.ippon.tatami.web.rest.dto.StatusDTO;

import java.io.Serializable;

/**
 * Tatami notification : contains the user to be notified and the StatusDTO to display.
 */
public class TatamiNotification implements Serializable {

    private String username;

    private StatusDTO statusDTO;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public StatusDTO getStatusDTO() {
        return statusDTO;
    }

    public void setStatusDTO(StatusDTO statusDTO) {
        this.statusDTO = statusDTO;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TatamiNotification)) return false;

        TatamiNotification that = (TatamiNotification) o;

        if (!username.equals(that.username)) return false;
        if (!statusDTO.equals(that.statusDTO)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = username.hashCode();
        result = 31 * result + statusDTO.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "TatamiNotification{" +
                "username='" + username + '\'' +
                ", statusDTO=" + statusDTO +
                "} " + super.toString();
    }
}
