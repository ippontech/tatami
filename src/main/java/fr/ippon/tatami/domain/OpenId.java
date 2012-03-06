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
@Table(name = "OpenId")
public class OpenId {

    @Id
    private String token;

    @Column(name = "email")
    private String email;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OpenId openId = (OpenId) o;

        if (email != null ? !email.equals(openId.email) : openId.email != null) return false;
        if (token != null ? !token.equals(openId.token) : openId.token != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = token != null ? token.hashCode() : 0;
        result = 31 * result + (email != null ? email.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "OpenId{" +
                "token='" + token + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
