package fr.ippon.tatami.domain;

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
@Table(name = "User")
@Data
@EqualsAndHashCode(of = "login")
public class User {

    @Id
    private String login;

    @Column(name = "email")
    private String email;

    @Column(name = "gravatar")
    private String gravatar;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    private long tweetCount;

    private long friendsCount;

    private long followersCount;
}
