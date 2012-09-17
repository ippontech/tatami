package fr.ippon.tatami.web.controller.form;

import java.io.Serializable;

/**
 * Form bean used to change the user's password.
 */
public class UserPassword implements Serializable {

    private String oldPassword;

    private String newPassword;

    private String newPasswordConfirmation;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPasswordConfirmation() {
        return newPasswordConfirmation;
    }

    public void setNewPasswordConfirmation(String newPasswordConfirmation) {
        this.newPasswordConfirmation = newPasswordConfirmation;
    }

    @Override
    public String toString() {
        return "UserPassword{" +
                "oldPassword='" + oldPassword + '\'' +
                ", newPassword='" + newPassword + '\'' +
                ", newPasswordConfirmation='" + newPasswordConfirmation + '\'' +
                '}';
    }
}
