package fr.ippon.tatami.service;

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
    Environment env;

    private JavaMailSenderImpl sender;

    private String host;

    private int port;

    private String smtpUser;

    private String smtpPassword;

    private String from;

    private String tatamiUrl;

    @PostConstruct
    public void init() {
        this.host = env.getProperty("smtp.host");
        this.port = env.getProperty("smtp.port", Integer.class);
        this.smtpUser = env.getProperty("smtp.user");
        this.smtpPassword = env.getProperty("smtp.password");
        this.from = env.getProperty("smtp.from");
        this.tatamiUrl = env.getProperty("tatami.url");
    }

    @Async
    public void sendRegistrationEmail(String registrationKey, User user) {
        if (log.isDebugEnabled()) {
            log.debug("Sending registration e-mail to User '" + user.getLogin() + "'...");
        }
        String subject = "Tatami activation";
        String text = "Dear "
                + user.getLogin()
                + ",\n\n"
                + "Your Tatami account has been created, please click on the URL below to activate it : "
                + "\n\n"
                + tatamiUrl + "/tatami/register?key=" + registrationKey
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(user, subject, text);
    }


    public void sendValidationEmail(User user) {
        if (log.isDebugEnabled()) {
            log.debug("Sending validation e-mail to User '" + user.getLogin() + "'...");
        }
        String subject = "Tatami account validated";
        String text = "Dear "
                + user.getLogin()
                + ",\n\n"
                + "Your Tatami account has been validated, here is your password : "
                + "\n\n"
                + user.getPassword()
                + "\n\n"
                + "Regards,\n\n" + "Ippon Technologies.";

        sendEmail(user, subject, text);
    }

    private void sendEmail(User user, String subject, String text) {
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
                e.printStackTrace();
            }
        }
    }
}
