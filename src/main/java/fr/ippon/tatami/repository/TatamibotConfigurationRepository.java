package fr.ippon.tatami.repository;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;

import java.util.Collection;

/**
 * The Tatami Bot configuration Repository.
 *
 * @author Julien Dubois
 */
public interface TatamibotConfigurationRepository {

    void insertTatamibotConfiguration(TatamibotConfiguration tatamibotConfiguration);

    void updateTatamibotConfiguration(TatamibotConfiguration tatamibotConfiguration);

    TatamibotConfiguration findTatamibotConfigurationById(String tatamibotConfigurationId);

    Collection<TatamibotConfiguration> findTatamibotConfigurationsByDomain(String domain);
}
