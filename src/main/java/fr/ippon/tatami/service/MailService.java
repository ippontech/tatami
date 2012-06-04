package fr.ippon.tatami.service;

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

    private String user;

    private String password;

    private String from;

    private String tatamiUrl;

    @PostConstruct
    public void init() {
        this.host = env.getProperty("smtp.host");
        this.port = env.getProperty("smtp.port", Integer.class);
        this.user = env.getProperty("smtp.user");
        this.password = env.getProperty("smtp.password");
        this.from = env.getProperty("smtp.from");
        this.tatamiUrl = env.getProperty("tatami.url");
    }

    @Async
    public void sendRegistrationEmail(String email, String token) {
        if (log.isDebugEnabled()) {
            log.debug("Sending registration e-mail to User '" + email + "'...");
        }
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(user);
        sender.setPassword(password);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom(from);
        message.setSubject("Tatami activation");
        message
                .setText("Dear "
                        + email
                        + ",\n\n"
                        + "To validate your Tatami account, please go to this URL : \""
                        + tatamiUrl + "/register/token/" + token
                        + "\n\n"
                        + "Regards,\n\n" + "Ippon Technologies.");

        try {
            sender.send(message);
            if (log.isDebugEnabled()) {
                log.debug("Sent registration e-mail to User '" + email + "'!");
            }
        } catch (MailException e) {
            log.warn("Warning! SMTP server error, could not send e-mail.");
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        }
    }
}
