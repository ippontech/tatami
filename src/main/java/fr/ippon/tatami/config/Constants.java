package fr.ippon.tatami.config;

/**
 * Application constants.
 */
public class Constants {

    private Constants() {
    }

    public static final String SPRING_PROFILE_METRICS = "metrics";

    public static final String REMOTE_ENGINE = "remote";

    public static final String EMBEDDED_ENGINE = "embedded";

    public static String VERSION = null;

    public static String GOOGLE_ANALYTICS_KEY = null;

    public static final int PAGINATION_SIZE = 50;

    public static final String TATAMIBOT_NAME = "tatamibot";

    public static final int AVATAR_SIZE = 200;

    /**
     * Cassandra : number of columns to return when not doing a name-based template
     */
    public static final int CASSANDRA_MAX_COLUMNS = 10000;

    /**
     * Cassandra : number of rows to return
     */
    public static final int CASSANDRA_MAX_ROWS = 10000;

}
