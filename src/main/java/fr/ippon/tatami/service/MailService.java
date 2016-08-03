package fr.ippon.tatami.service;

import fr.ippon.tatami.config.JHipsterProperties;
import fr.ippon.tatami.domain.User;
import org.apache.commons.lang.CharEncoding;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * Service for sending e-mails.
 * <p/>
 * <p>
 * We use the @Async annotation to send e-mails asynchronously.
 * </p>
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    @Inject
    private JHipsterProperties jHipsterProperties;

    @Inject
    private JavaMailSenderImpl javaMailSender;

    @Inject
    private MessageSource messageSource;

    @Inject
    private SpringTemplateEngine templateEngine;

    @Inject
    private UserService userService;

    /**
     * System default email address that sends the e-mails.
     */
    private String from;

    @Async
    private void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        log.debug("Send e-mail[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart, isHtml, to, subject, content);

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, CharEncoding.UTF_8);
            message.setTo(to);
            message.setFrom(jHipsterProperties.getMail().getFrom());
            message.setSubject(subject);
            message.setText(content, isHtml);
            javaMailSender.send(mimeMessage);
            log.debug("Sent e-mail to User '{}'", to);
        } catch (MessagingException e) {
            log.error("E-mail could not be sent to user : " + to, e);
        }
    }

    @Async
    public void sendActivationEmail(User user, String baseUrl) {
        log.debug("Sending activation e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("baseUrl", baseUrl);
        String content = templateEngine.process("activationEmail", context);
        String subject = messageSource.getMessage("email.activation.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendCreationEmail(User user, String baseUrl) {
        log.debug("Sending creation e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("baseUrl", baseUrl);
        String content = templateEngine.process("creationEmail", context);
        String subject = messageSource.getMessage("email.activation.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendPasswordResetMail(User user, String baseUrl) {
        log.debug("Sending password reset e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("baseUrl", baseUrl);
        String content = templateEngine.process("passwordResetEmail", context);
        String subject = messageSource.getMessage("email.reset.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendReportedStatusEmail (User reportingUser, String statusId){
        log.debug("Sending email alerting admins of reported status");
        //TODO: need to get statusURL
        String statusUrl = "";
        User currentUser = userService.getCurrentUser().get();
        Locale locale = Locale.forLanguageTag(currentUser.getLangKey());
        Context context = new Context(locale);
        context.setVariable("reportingUser", reportingUser);
        context.setVariable("statusUrl", statusUrl);
        String content = templateEngine.process("reportedStatusEmail", context);
        String subject = messageSource.getMessage ("email.reported.title", null, locale);
        //TODO: Need to check to see what admin returns... Is it username or email?
        //TODO: If it is a username, need to get email from username...
        String[] adminUsersArray = StringUtils.split(jHipsterProperties.getTatami().getAdmins(), ",");
        List<String> adminUsers = new ArrayList<>(Arrays.asList(adminUsersArray));
        for (String email : adminUsers) {
            sendEmail(email, subject, content, false, true);
        }
    }

    @Async
    public void sendDeactivatedUserEmail (User deactivatedUser){
        log.debug ("Deactivating account for user '{}'", deactivatedUser.getUsername());
        Locale locale = Locale.forLanguageTag(deactivatedUser.getLangKey());
        Context context = new Context(locale);
        context.setVariable("user", deactivatedUser);
        String content = templateEngine.process("deactivateUserEmail", context);
        String subject = messageSource.getMessage ("email.deactivate.title", null, locale);
        sendEmail(deactivatedUser.getEmail(), subject, content, false, true);
    }


}
