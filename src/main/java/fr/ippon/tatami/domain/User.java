package fr.ippon.tatami.domain;

import static org.hibernate.validator.constraints.SafeHtml.WhiteListType.NONE;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.SafeHtml;

/**
 * A user.
 * 
 * @author Julien Dubois
 */
@Entity
@Table(name = "User")
@Data
@EqualsAndHashCode(of = "login")
public class User {

    @Id
    @NotEmpty
    @Length(min = 1, max = 50)
    private String login;

    @NotEmpty
    @Email
    @Column(name = "email")
    private String email;

    @Column(name = "gravatar")
    private String gravatar;

    @NotEmpty
    @Length(min = 1, max = 50)
    @SafeHtml(whitelistType = NONE)
    @Column(name = "firstName")
    private String firstName;

    @NotEmpty
    @Length(min = 1, max = 50)
    @SafeHtml(whitelistType = NONE)
    @Column(name = "lastName")
    private String lastName;

    private long tweetCount;

    private long friendsCount;

    private long followersCount;
}
