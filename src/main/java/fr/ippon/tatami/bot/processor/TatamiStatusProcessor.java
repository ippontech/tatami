package fr.ippon.tatami.bot.processor;

import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.StatusUpdateService;
import fr.ippon.tatami.service.UserService;
import org.apache.camel.Body;
import org.apache.camel.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

@Component
public class TatamiStatusProcessor {

    private final Logger log = LoggerFactory.getLogger(TatamiStatusProcessor.class);

    @Inject
    private StatusUpdateService statusUpdateService;

    @Inject
    private UserService userService;

    public void sendStatus(@Body String content, @Header("login") String login) throws Exception {

        User tatamiBotUser = userService.getUserByLogin(login);

        log.debug("Posting content to Tatami : {}", content);


        // TODO : handle posting in group ...

        statusUpdateService.postStatusAsUser(content, tatamiBotUser);

    }
}
