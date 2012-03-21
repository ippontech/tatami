package fr.ippon.tatami.domain;

import static fr.ippon.tatami.service.PrettyDateUtil.prettyPrint;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A user.
 * 
 * @author Julien Dubois
 */
@Entity
@Table(name = "Tweet")
@Data
@EqualsAndHashCode(of = "tweetId")
public class Tweet {

    @Id
    private String tweetId;

    @Column(name = "login")
    private String login;

    @Column(name = "content")
    private String content;

    @Column(name = "tweetDate")
    private Date tweetDate;

    private String firstName;

    private String lastName;

    private String gravatar;

    public String getPrettyPrintTweetDate() {
        return prettyPrint(tweetDate);
    }
}
