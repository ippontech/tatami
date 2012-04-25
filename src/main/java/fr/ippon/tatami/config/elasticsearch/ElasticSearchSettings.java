package fr.ippon.tatami.config.elasticsearch;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.common.settings.Settings;
import org.springframework.stereotype.Component;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;

/**
 * @author dmartin
 */
@Component
public class ElasticSearchSettings {

    private static final Log LOG = LogFactory.getLog(ElasticSearchSettings.class);

    public static final String DEFAULT_SETTINGS_RESOURCE_PATH = "META-INF/elasticsearch/_settings.properties";

    private Settings settings;

    public ElasticSearchSettings() {
        this(DEFAULT_SETTINGS_RESOURCE_PATH);
    }

    public ElasticSearchSettings(String settingsResourcePath) {
        LOG.debug("Loading Elastic Search settings from " + settingsResourcePath);
        this.settings = settingsBuilder().loadFromClasspath(settingsResourcePath).build();
    }

    public Settings getSettings() {
        return this.settings;
    }

}
