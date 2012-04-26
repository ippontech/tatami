package fr.ippon.tatami.config.elasticsearch;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;

import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.common.settings.Settings;
import org.springframework.stereotype.Component;

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

    public ElasticSearchSettings(Properties properties) {
        LOG.debug("Loading Elastic Search settings from properties: " + properties);
        this.settings = settingsBuilder().put(properties).build();
    }

    public Settings getSettings() {
        return this.settings;
    }

}
