package fr.ippon.tatami.config;

/**
 * Application constants.
 */
public class Constants {

    private Constants() {
    }

    public static final String ELASTICSEARCH_ENGINE = "elasticsearch";

    public static final String LUCENE_ENGINE = "lucene";

    public static final String DEFAULT_THEME = "bootstrap";

    public static String VERSION = null;

    public static String GOOGLE_ANALYTICS_KEY = null;

    public static Boolean WRO4J_ENABLED = false;

    public static final int PAGINATION_SIZE = 50;

    /**
     * Cassandra : number of columns to return when not doing a name-based template
     */
    public static final int CASSANDRA_MAX_COLUMNS = 10000;

}
