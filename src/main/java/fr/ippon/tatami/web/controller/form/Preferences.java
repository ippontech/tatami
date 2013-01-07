package fr.ippon.tatami.web.controller.form;

/**
 * Stores a user's preferences.
 */
public class Preferences {

    Boolean mentionEmail = false;

    String theme = "";

    public Boolean getMentionEmail() {
        return mentionEmail;
    }

    public void setMentionEmail(Boolean mentionEmail) {
        this.mentionEmail = mentionEmail;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

}
