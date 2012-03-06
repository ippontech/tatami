package fr.ippon.tatami.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * A user.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "User")
public class User {

    @Id
    private String email;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "openIdToken")
    private String openIdToken;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getOpenIdToken() {
        return openIdToken;
    }

    public void setOpenIdToken(String openIdToken) {
        this.openIdToken = openIdToken;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (!email.equals(user.email)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return email.hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", openIdToken='" + openIdToken + '\'' +
                '}';
    }
}
