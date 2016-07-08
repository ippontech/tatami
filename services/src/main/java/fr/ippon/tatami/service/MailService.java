package fr.ippon.tatami.service;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.domain.status.AbstractStatus;
import fr.ippon.tatami.domain.status.Status;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.TatamiUserDetailsService;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.apache.velocity.app.VelocityEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.ui.velocity.VelocityEngineUtils;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.mail.MessagingException;
import java.util.*;

/**
 * Send e-mails.
 * <p/>
 * Templates are implemented with velocity.
 * Emails localisation is based on system locale, this could be improved by storing a preferred locale
 * for each user.
 *
 * @author Julien Dubois
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    @Inject
    private Environment env;

    @Inject
    private MessageSource mailMessageSource;

    private String host;

    private int port;

    private String smtpUser;

    private String smtpPassword;

    private String smtpTls;

    private String from;

    private String tatamiUrl;

    private Locale locale;

    // TODO: this can be used for external mail template configuration
    private final String templateRoot = "/META-INF/tatami/mails/";
    private final String templateSuffix = "Email";

    @Inject
    private VelocityEngine velocityEngine;

    @Inject
    private TatamiUserDetailsService tatamiUserDetailsService;

    @PostConstruct
    public void init() {
        this.host = env.getProperty("smtp.host");
        if (!env.getProperty("smtp.port").equals("")) {
            this.port = env.getProperty("smtp.port", Integer.class);
        }
        this.smtpUser = env.getProperty("smtp.user");
        this.smtpPassword = env.getProperty("smtp.password");
        this.smtpTls = env.getProperty("smtp.tls");
        this.from = env.getProperty("smtp.from");
        this.tatamiUrl = env.getProperty("tatami.url");

        // TODO : we should probably let the user choose which language he wants to use for email, and store this as a preference
        this.locale = Locale.getDefault();
    }

    @Async
    public void sendRegistrationEmail(String registrationKey, User user) {

        String registrationUrl = tatamiUrl + "/#/register?key=" + registrationKey;
        log.debug("Sending registration e-mail to User '{}', Url='{}' " +
                "with locale : '{}'", user.getLogin(), registrationUrl, locale);

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user);
        model.put("registrationUrl", registrationUrl);

        sendTextFromTemplate(user.getLogin(), model, "registration", this.locale);
    }

    @Async
    public void sendInvitationEmail(String email, User user) {
        log.debug("Sending invitation e-mail to email '{}'", email);

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user.getLogin());
        model.put("invitationUrl", tatamiUrl);

        sendTextFromTemplate(user.getLogin(), model, "invitationMessage", this.locale);
    }

    @Async
    public void sendLostPasswordEmail(String registrationKey, User user) {

        String url = tatamiUrl + "/#/register?key=" + registrationKey;
        log.debug("Sending lost password e-mail to User '{}', Url='{}' with locale : '{}'", user.getLogin(), url, locale);

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user);
        model.put("reinitUrl", url);

        sendTextFromTemplate(user.getLogin(), model, "lostPassword", this.locale);
    }

    @Async
    public void sendValidationEmail(User user, String password) {
        log.debug("Sending validation e-mail to User '{}', non-encrypted Password='{}' " +
                "with locale : '{}'", user.getLogin(), password, locale);

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user);
        model.put("password", password);

        sendTextFromTemplate(user.getLogin(), model, "validation", this.locale);
    }

    @Async
    public void sendPasswordReinitializedEmail(User user, String password) {
        log.debug("Sending password re-initialization e-mail to User '{}', non-encrypted Password='{}' " +
                "with locale : '{}'", user.getLogin(), password, locale);

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user);
        model.put("password", password);

        sendTextFromTemplate(user.getLogin(), model, "passwordReinitialized", this.locale);
    }

    @Async
    public void sendUserPrivateMessageEmail(User mentionnedUser, Status status) {
        log.debug("Sending Private Message e-mail to User '{}' " +
                "with locale : '{}'", mentionnedUser.getLogin(), locale);
        String url = tatamiUrl + "/#/home/status/" + status.getStatusId();

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", mentionnedUser);
        model.put("status", status);
        model.put("statusUrl", url);

        sendTextFromTemplate(mentionnedUser.getLogin(), model, "userPrivateMessage", this.locale);
    }

    @Async
    public void sendUserMentionEmail(User mentionnedUser, Status status) {
        log.debug("Sending Mention e-mail to User '{}' with locale : '{}'", mentionnedUser.getLogin(), locale);
        String url = tatamiUrl + "/#/home/status/" + status.getStatusId();

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", mentionnedUser);
        model.put("status", status);
        model.put("statusUrl", url);

        sendTextFromTemplate(mentionnedUser.getLogin(), model, "userMention", this.locale);
    }

    @Async
    public void sendDailyDigestEmail(User user, List<StatusDTO> statuses, int nbStatus,
                                     Collection<User> suggestedUsers) {
        log.debug("Sending daily digest e-mail to User '{}'", user.getLogin());

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user);
        model.put("tatamiUrl", tatamiUrl);
        model.put("statuses", statuses);
        model.put("nbStatus", nbStatus);
        model.put("suggestedUsers", suggestedUsers);

        sendTextFromTemplate(user.getLogin(), model, "dailyDigest", this.locale);
    }


    @Async
    public void sendWeeklyDigestEmail(User user, List<StatusDTO> statuses, int nbStatus,
                                      Collection<User> suggestedUsers,
                                      Collection<Group> suggestedGroup) {
        log.debug("Sending weekly digest e-mail to User '{}'", user.getLogin());

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("user", user);
        model.put("tatamiUrl", tatamiUrl);
        model.put("statuses", statuses);
        model.put("nbStatus", nbStatus);
        model.put("suggestedUsers", suggestedUsers);
        model.put("suggestedGroups", suggestedGroup);

        sendTextFromTemplate(user.getLogin(), model, "weeklyDigest", this.locale);
    }

    @Async
    public void sendReportedStatusEmail(String emailReporting, AbstractStatus status) {
        log.debug("Sending Mention e-mail to User '{}' with locale : '{}'", locale);
        String url = tatamiUrl + "/#/home/status/" + status.getStatusId();

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("status", status);
        model.put("statusUrl", url);

        //TODO: need to get admin emails
        String adminEmail = "eklein@ipponusa.com";
        sendTextFromTemplate(adminEmail, model, "reportedStatus", this.locale);

//        for(String email : tatamiUserDetailsService.getAdminUsers()) {
//            sendTextFromTemplate(email, model, "reportedStatus", this.locale);
//        }
    }

    public boolean connectSmtpServer() {
        if (host != null && !host.equals("")) {
            JavaMailSenderImpl sender = configureJavaMailSender();
            try {
                sender.getSession().getTransport().connect();
                return true;
            } catch (MessagingException e) {
                return false;
            }
        } else {
            return false;
        }
    }

    private void sendEmail(String email, String subject, String text) {
        if (host != null && !host.equals("")) {
            JavaMailSenderImpl sender = configureJavaMailSender();
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom(from);
            message.setSubject(subject);
            message.setText(text);
            try {
                sender.send(message);
                log.debug("Sent e-mail to User '{}'!", email);
            } catch (MailException e) {
                log.warn("Warning! SMTP server error, could not send e-mail.");
                log.debug("SMTP Error : {}", e.getMessage());
                log.debug("Did you configure your SMTP settings in /META-INF/tatami/tatami.properties ?");
            }
        } else {
            log.debug("SMTP server is not configured in /META-INF/tatami/tatami.properties");
        }
    }

    private JavaMailSenderImpl configureJavaMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(smtpUser);
        sender.setPassword(smtpPassword);
        if (smtpTls != null && !smtpTls.equals("")) {
            Properties sendProperties = new Properties();
            sendProperties.setProperty("mail.smtp.starttls.enable", "true");
            sender.setJavaMailProperties(sendProperties);
        }
        return sender;
    }

    /**
     * Generate and send the mail corresponding to the given template.
     */
    private void sendTextFromTemplate(String email, Map<String, Object> model, String template, Locale locale) {
        model.put("messages", mailMessageSource);
        model.put("locale", locale);

        String subject = mailMessageSource.getMessage(template + ".title", null, locale);
        String text = VelocityEngineUtils.mergeTemplateIntoString(velocityEngine, templateRoot + template + templateSuffix,
                "utf-8", model);
        log.debug("e-mail text  '{}", text);

        sendEmail(email, subject, text);
    }

}
