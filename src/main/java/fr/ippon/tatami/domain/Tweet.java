package fr.ippon.tatami.domain;

import static fr.ippon.tatami.service.PrettyDateUtil.prettyPrint;
import static org.hibernate.validator.constraints.SafeHtml.WhiteListType.NONE;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Past;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.SafeHtml;

import com.sun.istack.internal.NotNull;

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

    @NotEmpty
    @Length(min = 1, max = 50)
    @SafeHtml(whitelistType = NONE)
    @Column(name = "login")
    private String login;

    @NotEmpty
    @Length(min = 4, max = 140)
    @SafeHtml(whitelistType = NONE)
    @Column(name = "content")
    private String content;

    @NotNull
    @Past
    @Column(name = "tweetDate")
    private Date tweetDate;

    @NotEmpty
    @Length(min = 1, max = 50)
    @SafeHtml(whitelistType = NONE)
    private String firstName;

    @SafeHtml(whitelistType = NONE)
    @Length(min = 1, max = 50)
    private String lastName;

    private String gravatar;

    public String getPrettyPrintTweetDate() {
        return prettyPrint(tweetDate);
    }
}
