package fr.ippon.tatami.web.atmosphere;

import fr.ippon.tatami.service.dto.StatusDTO;

import java.io.Serializable;

/**
 * Tatami notification : contains the user to be notified and the StatusDTO to display.
 */
public class TatamiNotification implements Serializable {

    private String login;

    private StatusDTO statusDTO;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
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

        if (!login.equals(that.login)) return false;
        if (!statusDTO.equals(that.statusDTO)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = login.hashCode();
        result = 31 * result + statusDTO.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "TatamiNotification{" +
                "login='" + login + '\'' +
                ", statusDTO=" + statusDTO +
                "} " + super.toString();
    }
}
