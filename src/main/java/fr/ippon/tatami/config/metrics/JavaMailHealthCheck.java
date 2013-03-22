package fr.ippon.tatami.config.metrics;

import com.yammer.metrics.core.HealthCheck;
import fr.ippon.tatami.service.MailService;

/**
 * Metrics HealthCheck for JavaMail.
 */
public class JavaMailHealthCheck extends HealthCheck {

    private MailService mailService;

    public JavaMailHealthCheck(MailService mailService) {
        super("JavaMail");
        this.mailService = mailService;
    }

    @Override
    public Result check() throws Exception {
        if (mailService.connectSmtpServer()) {
            return Result.healthy();
        } else {
            return Result.unhealthy("Cannot connect to Mail server");
        }
    }
}
