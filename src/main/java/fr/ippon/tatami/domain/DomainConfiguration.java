package fr.ippon.tatami.domain;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.Properties;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.io.IOUtils;

/**
 * The configuration for a specific domain.
 *
 * @author Julien Dubois
 */
@Entity
@Table(name = "DomainConfiguration")
public class DomainConfiguration implements Serializable {

    public static class SubscriptionAndStorageSizeOptions {

        public static String BASICSIZE = "10";

        public static String PREMIUMSIZE = "1000";

        public static String IPPONSIZE = "100000";
        
        public static String BASICSUSCRIPTION = "0";

        public static String PREMIUMSUSCRIPTION = "1";

        public static String IPPONSUSCRIPTION = "-1";
                
        static{
            InputStream inputStream=null;
            try{
            	
                
                
                inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("META-INF/tatami/tatami.properties");
                
                Properties props = new Properties();
                props.load(inputStream);
			    
			    String basicSize = "storage.basic.max.size";
                String premiumSize = "storage.premium.max.size";
                String ipponSize = "storage.ippon.max.size";
                String basicSuscription = "suscription.level.free";
                String premiumSuscription = "suscription.level.premium";
                String ipponSuscription = "suscription.level.ippon";
                if(!props.containsKey(basicSize) || !props.containsKey(premiumSize) 
                		|| !props.containsKey(ipponSize) || !props.containsKey(basicSuscription) 
                		|| !props.containsKey(premiumSuscription) || !props.containsKey(ipponSuscription))
                    throw new IllegalStateException("Property not found");
                BASICSIZE= props.getProperty(basicSize);
                PREMIUMSIZE= props.getProperty(premiumSize);
                IPPONSIZE= props.getProperty(ipponSize);
                BASICSUSCRIPTION= props.getProperty(basicSuscription);
                PREMIUMSUSCRIPTION= props.getProperty(premiumSuscription);
                IPPONSUSCRIPTION= props.getProperty(ipponSuscription);
                
            } catch(IOException e){
                throw new IllegalStateException(e);
            }finally{
                // apache commons / IO
                IOUtils.closeQuietly(inputStream);
            }
        }
        

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
            return Long.parseLong(SubscriptionAndStorageSizeOptions.BASICSIZE) * 1000000;
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
