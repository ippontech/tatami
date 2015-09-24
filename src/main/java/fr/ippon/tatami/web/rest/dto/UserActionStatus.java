package fr.ippon.tatami.web.rest.dto;

import java.io.Serializable;

/**
 * This class is used in order to specify the action of PATCH request (cf vUserList.js).
 * The action can be "addFriend" ( friendShip = true ) or "activate/desactivate" ( activate = true ).
 */
public class UserActionStatus implements Serializable {

    private Boolean activate = null;

    private Boolean friendShip = null;

    private Boolean isFriend = null;

    public Boolean getFriend() {
        return isFriend;
    }

    public void setFriend(Boolean friend) {
        isFriend = friend;
    }
    public Boolean getFriendShip() {
        return friendShip;
    }

    public void setFriendShip(Boolean friendShip) {
        this.friendShip = friendShip;
    }

    public Boolean getActivate() {
        return activate;
    }

    public void setActivate(Boolean activate) {
        this.activate = activate;
    }
}
