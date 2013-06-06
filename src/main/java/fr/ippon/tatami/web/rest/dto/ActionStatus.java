package fr.ippon.tatami.web.rest.dto;

import java.io.Serializable;

/**
 * Reply to a Status.
 */
public class ActionStatus implements Serializable {

    private Boolean favorite = null;

    private Boolean shared = null;

    private Boolean announced = null;

    public Boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }

    public Boolean isShared() {
        return shared;
    }

    public void setShared(Boolean shared) {
        this.shared = shared;
    }

    public Boolean isAnnounced() {
        return announced;
    }

    public void setAnnounced(Boolean announced) {
        this.announced = announced;
    }

    @Override
    public String toString() {
        return "ActionStatus{" +
                "favorite=" + favorite +
                ", shared=" + shared +
                ", announced=" + announced +
                "} " + super.toString();
    }
}
