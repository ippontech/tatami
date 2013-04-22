package fr.ippon.tatami.web.rest.dto;

/**
 * DTO containing the user name and e-mail.
 */
public class EmailAndUsername {
    private String email;
    private String username;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
