package fr.ippon.tatami.web.rest.dto;

import fr.ippon.tatami.domain.User;
import org.apache.commons.lang.StringUtils;

import java.io.Serializable;

/**
 * Stores a user's preferences.
 */
public class Preferences implements Serializable {

    private Boolean mentionEmail = false;

    private Boolean weeklyDigest = false;

    private Boolean dailyDigest = false;

    private Boolean rssUidActive = false;

    private String rssUid;

    public Preferences() {

    }

    public Preferences(User user) {
        this.mentionEmail = user.getPreferencesMentionEmail();
        this.weeklyDigest = user.getWeeklyDigestSubscription();
        this.dailyDigest = user.getDailyDigestSubscription();
        if (!StringUtils.isEmpty(user.getRssUid())) {
            this.rssUidActive = true;
            this.rssUid = user.getRssUid();
        }
    }

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

    public String getRssUid() {
        return rssUid;
    }

    public void setRssUid(String rssUid) {
        this.rssUid = rssUid;
    }

    public Boolean getWeeklyDigest() {
        return weeklyDigest;
    }

    public void setWeeklyDigest(Boolean weeklyDigest) {
        this.weeklyDigest = weeklyDigest;
    }

    public Boolean getDailyDigest() {
        return dailyDigest;
    }

    public void setDailyDigest(Boolean dailyDigest) {
        this.dailyDigest = dailyDigest;
    }
}
