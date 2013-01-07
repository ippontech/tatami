package fr.ippon.tatami.web.controller.form;

/**
 * Created with IntelliJ IDEA.
 * User: godu
 * Date: 21/12/12
 * Time: 14:55
 * To change this template use File | Settings | File Templates.
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
