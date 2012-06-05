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
    public void sendRegistrationEmail(User user) {
        if (log.isDebugEnabled()) {
            log.debug("Sending registration e-mail to User '" + user.getLogin() + "'...");
        }
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(smtpUser);
        sender.setPassword(smtpPassword);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getLogin());
        message.setFrom(from);
        message.setSubject("Tatami activation");
        message
                .setText("Dear "
                        + user.getLogin()
                        + ",\n\n"
                        + "Your Tatami account has been created, your password is:\n\n"
                        + user.getPassword()
                        + "\n\n"
                        + "Regards,\n\n" + "Ippon Technologies.");

        try {
            sender.send(message);
            if (log.isDebugEnabled()) {
                log.debug("Sent registration e-mail to User '" + user.getLogin() + "'!");
            }
        } catch (MailException e) {
            log.warn("Warning! SMTP server error, could not send e-mail.");
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        }
    }
}
