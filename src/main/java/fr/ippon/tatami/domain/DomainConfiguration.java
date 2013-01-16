package fr.ippon.tatami.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * The configuration for a specific domain.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "DomainConfiguration")
public class DomainConfiguration {

    public static class SubscriptionLevel {

        public final static String FREE = "0";

        public final static String PREMIUM = "1";

        public final static String IPPON = "-1";

    }

    public static class StorageSizeOptions {

        public final static String BASIC = "10";

        public final static String PREMIUM = "1000";

        public final static String IPPON = "5000";

    }

    @Id
    private String domain;

    @Column(name = "subscriptionLevel")
    private String subscriptionLevel;

    @Column(name = "storageSize")
    private String storageSize;

    @Column(name = "adminLogin")
    private String adminLogin;

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getSubscriptionLevel() {
        return subscriptionLevel;
    }

    public void setSubscriptionLevel(String subscriptionLevel) {
        this.subscriptionLevel = subscriptionLevel;
    }

    public String getStorageSize() {
        return storageSize;
    }

    public long getStorageSizeAsLong() {
        try {
            return Long.parseLong(this.storageSize) * 1000000;
        } catch (NumberFormatException nfe) {
            return Long.parseLong(StorageSizeOptions.BASIC) * 1000000;
        }
    }

    public void setStorageSize(String storageSize) {
        this.storageSize = storageSize;
    }

    public String getAdminLogin() {
        return adminLogin;
    }

    public void setAdminLogin(String adminLogin) {
        this.adminLogin = adminLogin;
    }

    @Override
    public String toString() {
        return "DomainConfiguration{" +
                "domain='" + domain + '\'' +
                ", subscriptionLevel='" + subscriptionLevel + '\'' +
                ", storageSize='" + storageSize + '\'' +
                ", adminLogin='" + adminLogin + '\'' +
                '}';
    }
}
