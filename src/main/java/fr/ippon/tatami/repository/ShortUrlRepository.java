package fr.ippon.tatami.repository;

import fr.ippon.tatami.domain.ShortUrl;

public interface ShortUrlRepository {

    void createShortUrl(ShortUrl shortUrl);

    ShortUrl findUrlFromKey(String key);

}
