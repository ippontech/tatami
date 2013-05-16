package fr.ippon.tatami.web.rest.dto;

import java.io.Serializable;

/**
 * Reply to a Status.
 */
public class ActionStatus implements Serializable {

    private Boolean favorite = null;

    private Boolean shared = null;

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

    @Override
    public String toString() {
        return "ActionStatus{" +
                "shared='" + shared + '\'' +
                ", favorite='" + favorite + '\'' +
                '}';
    }
}
