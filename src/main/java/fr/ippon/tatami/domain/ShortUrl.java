package fr.ippon.tatami.domain;


public class ShortUrl {

    private String shortUrl;

    private String longUrl;

    public String getShortUrl() {
        return shortUrl;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    @Override
    public String toString() {
        return "ShortUrl{" +
                "shorturl='" + shortUrl + '\'' +
                ", longurl='" + longUrl + '\'' +
                '}';
    }
}
