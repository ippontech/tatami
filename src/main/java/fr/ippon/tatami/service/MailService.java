package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

/**
 * Send e-mails.
 *
 * @author Julien Dubois
 */
@Service
public class MailService {

    private static final Log log = LogFactory.getLog(MailService.class);

    @Inject
    private Environment env;

    private String host;

    private int port;

    private String smtpUser;

    private String smtpPassword;

    private String from;

    private String tatamiUrl;

    @PostConstruct
    public void init() {
        this.host = env.getProperty("smtp.host");
        if (!env.getProperty("smtp.port").equals("")) {
            this.port = env.getProperty("smtp.port", Integer.class);
        }
        this.smtpUser = env.getProperty("smtp.user");
        this.smtpPassword = env.getProperty("smtp.password");
        this.from = env.getProperty("smtp.from");
        this.tatamiUrl = env.getProperty("tatami.url");
    }

    @Async
    public void sendRegistrationEmail(String registrationKey, User user) {
        String subject = "Tatami activation";
        String url = tatamiUrl + "/tatami/register?key=" + registrationKey;
        if (log.isDebugEnabled()) {
            log.debug("Sending registration e-mail to User '" + user.getLogin() +
                    "', Url='" + url + "'");
        }
        String text = "Dear "
                + user.getLogin()
                + ",\n\n"
                + "Your Tatami account has been created, please click on the URL below to activate it : "
                + "\n\n"
                + url
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(user, subject, text);
    }

    @Async
    public void sendLostPasswordEmail(String registrationKey, User user) {
        String subject = "Tatami lost password";
        String url = tatamiUrl + "/tatami/register?key=" + registrationKey;
        if (log.isDebugEnabled()) {
            log.debug("Sending lost password e-mail to User '" + user.getLogin() +
                    "', Url='" + url + "'");
        }
        String text = "Dear "
                + user.getLogin()
                + ",\n\n"
                + "Someone asked to re-initialize your password."
                + "\n\n"
                + "If you want to re-initialize your password, please click on the link below : "
                + "\n\n"
                + url
                + "\n\n"
                + "If you do not want to re-initialize your password, you can safely ignore this message "
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(user, subject, text);
    }

    @Async
    public void sendValidationEmail(User user, String password) {
        if (log.isDebugEnabled()) {
            log.debug("Sending validation e-mail to User '" + user.getLogin() +
                    "', non-encrypted Password='" + password + "'");
        }
        String subject = "Tatami account validated";
        String text = "Dear "
                + user.getLogin()
                + ",\n\n"
                + "Your Tatami account has been validated, here is your password : "
                + "\n\n"
                + password
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(user, subject, text);
    }

    @Async
    public void sendPasswordReinitializedEmail(User user, String password) {
        if (log.isDebugEnabled()) {
            log.debug("Sending password re-initialization e-mail to User '" + user.getLogin() +
                    "', non-encrypted Password='" + password + "'");
        }
        String subject = "Tatami password re-initialized";
        String text = "Dear "
                + user.getLogin()
                + ",\n\n"
                + "Your Tatami password has been re-initialized, here is your new password : "
                + "\n\n"
                + password
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(user, subject, text);
    }

    public void sendUserMentionEmail(Status status, User mentionnedUser) {
        if (log.isDebugEnabled()) {
            log.debug("Sending Mention e-mail to User '" + mentionnedUser.getLogin() + "'");
        }
        String subject = "You have been mentionned on Tatami";
        String url = tatamiUrl + "/tatami/profile/" + status.getUsername() + "/#/status/" + status.getStatusId();
        String text = "Dear @"
                + mentionnedUser.getUsername()
                + ",\n\n"
                + "You have been mentionned on Tatami : "
                + "\n\n"
                + "@"
                + status.getUsername()
                + "\n\n"
                + status.getContent()
                + "\n\n"
                + "You can see this status on Tatami :"
                + "\n\n"
                + url
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(mentionnedUser, subject, text);
    }

    private void sendEmail(User user, String subject, String text) {
        if (host != null && !host.equals("")) {
            JavaMailSenderImpl sender = new JavaMailSenderImpl();
            sender.setHost(host);
            sender.setPort(port);
            sender.setUsername(smtpUser);
            sender.setPassword(smtpPassword);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getLogin());
            message.setFrom(from);
            message.setSubject(subject);
            message.setText(text);
            try {
                sender.send(message);
                if (log.isDebugEnabled()) {
                    log.debug("Sent e-mail to User '" + user.getLogin() + "'!");
                }
            } catch (MailException e) {
                log.warn("Warning! SMTP server error, could not send e-mail.");
                if (log.isDebugEnabled()) {
                    log.debug("SMTP Error : " + e.getMessage());
                    log.debug("Did you configure your SMTP settings in /META-INF/tatami/tatami.properties ?");
                }
            }
        } else {
            log.debug("SMTP server is not configured in /META-INF/tatami/tatami.properties");
        }
    }
}
