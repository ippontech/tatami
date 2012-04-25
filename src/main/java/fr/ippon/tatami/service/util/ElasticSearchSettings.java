/**
 * 
 */
package fr.ippon.tatami.service.util;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.elasticsearch.common.settings.Settings;
import org.springframework.stereotype.Component;

/**
 * @author dmartin
 *
 */
@Component
public class ElasticSearchSettings {

	private static final Log LOG = LogFactory.getLog(ElasticSearchSettings.class);

	public static final String DEFAULT_SETTINGS_RESOURCE_PATH = "es/tatami/_settings.properties";

	private Settings settings;

	public ElasticSearchSettings() {
		this(DEFAULT_SETTINGS_RESOURCE_PATH);
	}

	public ElasticSearchSettings(String settingsResourcePath) {
		LOG.debug("Loading ES settings from " + settingsResourcePath);
        this.settings = settingsBuilder().loadFromClasspath(settingsResourcePath).build();
	}

	public Settings getSettings() {
        return this.settings;
	}

}
