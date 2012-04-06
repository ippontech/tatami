/**
 * 
 */
package fr.ippon.tatami.service;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.mortbay.log.Log;

/**
 * Elastic Search clients factory.
 *
 * @author dmartinpro
 * 
 */
public class TransportClientFactory {

	/**
	 * Create a TransportClient. Aimed at being used in Spring configuration as a factory method.
	 * 
	 * @param host
	 *            the host (ES Node) to connect to
	 * @param port
	 *            the port the node is listening (9300 is the ES default value)
	 * @param settings
	 *            some settings like the cluster name ("cluster.name"), ...
	 * @return a fully configured (ES) client
	 */
	public TransportClient createInstance(final String host, final int port,
			final Map<String, String> settings) {

		if (StringUtils.isBlank(host)) {
			throw new IllegalArgumentException("host parameter can't be null");
		}

		final ImmutableSettings.Builder builder = ImmutableSettings.settingsBuilder();
		builder.put(settings);

		final Settings _settings = builder.build();

		final TransportClient client = new TransportClient(_settings);
		client.addTransportAddress(new InetSocketTransportAddress(host, port));

		if (client.connectedNodes().size() == 0) {
			Log.warn("Elastic Search client **wasn't** able to connect to any node. Is Elastic Search server started or your configuration Ok ?");
		}

		return client;
	}

}
