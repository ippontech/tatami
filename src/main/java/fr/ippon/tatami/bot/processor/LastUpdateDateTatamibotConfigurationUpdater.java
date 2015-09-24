package fr.ippon.tatami.bot.processor;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import fr.ippon.tatami.repository.TatamibotConfigurationRepository;
import org.apache.camel.Header;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.Date;

@Component
public class LastUpdateDateTatamibotConfigurationUpdater {

    @Inject
    private TatamibotConfigurationRepository tatamibotConfigurationRepository;

    public void updateLastDate(@Header("tatamibotLastUpdateDate") Date lastUpdateDate,
                               @Header("tatamibotConfiguration") TatamibotConfiguration tatamibotConfigurationUsedByRoute) {

        String tatamibotConfigurationId = tatamibotConfigurationUsedByRoute.getTatamibotConfigurationId();

        TatamibotConfiguration lastTatamibotConfiguration = tatamibotConfigurationRepository
                .findTatamibotConfigurationById(tatamibotConfigurationId);

        lastTatamibotConfiguration.setLastUpdateDate(lastUpdateDate);
        tatamibotConfigurationRepository.updateTatamibotConfiguration(lastTatamibotConfiguration);
    }

}
