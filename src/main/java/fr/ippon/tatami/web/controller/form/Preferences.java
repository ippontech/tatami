package fr.ippon.tatami.web.controller.form;

import fr.ippon.tatami.domain.User;
import org.apache.commons.lang.StringUtils;

/**
 * Stores a user's preferences.
 */
public class Preferences {

    public Preferences(){};

    public Preferences(User user){
        this.setMentionEmail(user.getPreferencesMentionEmail());
        this.setTheme(user.getTheme());
        StringUtils.isEmpty(user.getRssUid());
        this.setRssUidActive(!StringUtils.isEmpty(user.getRssUid()));
    }

    Boolean mentionEmail = false;
    Boolean rssUidActive = false;

    String theme = "";

    public Boolean getMentionEmail() {
        return mentionEmail;
    }

    public void setMentionEmail(Boolean mentionEmail) {
        this.mentionEmail = mentionEmail;
    }

    public Boolean getRssUidActive() {
        return this.rssUidActive;
    }

    public void setRssUidActive(boolean rssUidActive) {
        this.rssUidActive = rssUidActive;
    }


    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

}
