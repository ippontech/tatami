package fr.ippon.tatami.repository;

/**
 * The Rss Uid Repository.
 * </p>
 * The RSS uid is used to build an anonymous url to a RSS channel
 * representing an user timeline.
 *
 * @author Pierre Rust
 */
public interface RssUidRepository {

    String generateRssUid(String login);

    void removeRssUid(String rssUid);

    String getLoginByRssUid(String rssUid);
}
