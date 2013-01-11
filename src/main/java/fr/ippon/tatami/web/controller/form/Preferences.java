package fr.ippon.tatami.web.controller.form;

/**
 * Stores a user's preferences.
 */
public class Preferences {

    Boolean mentionEmail = false;

    Boolean rssUidActive = false;

    String theme = "";

    String rssUid;

    public Boolean getMentionEmail() {
        return mentionEmail;
    }

    public void setMentionEmail(Boolean mentionEmail) {
        this.mentionEmail = mentionEmail;
    }

    public void setRssUid(String rssUid) {
        this.rssUid = rssUid;
    }

    public String getRssUid() {
        return rssUid;
    }

    public Boolean getRssUidActive() {
        return rssUidActive;
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
