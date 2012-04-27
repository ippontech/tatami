package fr.ippon.tatami.service.util;

/**
 * 
 * @author DuyHai DOAN
 */
public class TatamiConstants
{
	public static final int DEFAULT_TWEET_LIST_SIZE = 10;

	public static final int DEFAULT_TAG_LIST_SIZE = 10;

	public static final int DEFAULT_FAVORITE_LIST_SIZE = 10;

	public static final int DEFAULT_DAY_LIST_SIZE = 10;

	public static final int DEFAULT_WEEK_LIST_SIZE = 10;

	public static final int DEFAULT_MONTH_LIST_SIZE = 10;

	public static final int DEFAULT_YEAR_LIST_SIZE = 10;

	public static final int USER_SUGGESTION_LIMIT = 5;

	public static final int USER_SEARCH_LIMIT = 10;

	public static final int MAX_TWEET_SIZE = 140;

	public static final int TWEET_FIRST_FETCH_SIZE = 5;

	public static final int TWEET_SECOND_FETCH_SIZE = 10;

	public static final int TWEET_THIRD_FETCH_SIZE = 20;

	// &#x23; is the HTML encoded version of the # character
	public static final String HASHTAG_REGEXP = "&#x23;(\\w+)";

	public static final String HASHTAG = "&#x23;";

	public static final String TAG_LINK_PATTERN = "<a href='#' data-tag='$1' title='Show $1 related tweets'><em>#$1</em></a>";

	// &#x40; is the HTML encoded version of the @ character
	public static final String USER_REGEXP = "&#x40;(\\w+)";

	public static final String USERTAG = "&#x40;";

	public static final String USER_LINK_PATTERN = "<a href='#' data-user='$1' title='Show $1 tweets'><em>@$1</em></a>";

	public static final String TWEET_NB_PATTERN = "__TWEET-NB__";

	public static final String START_TWEET_INDEX_PATTERN = "__START__";

	public static final String END_TWEET_INDEX_PATTERN = "__END__";

	public static final String USER_LOGIN_PATTERN = "__LOGIN__";

	public static final String TAG_PATTERN = "__TAG__";
}
