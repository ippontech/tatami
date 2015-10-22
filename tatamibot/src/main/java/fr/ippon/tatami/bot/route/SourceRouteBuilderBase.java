package fr.ippon.tatami.bot.route;

import fr.ippon.tatami.bot.config.TatamibotConfiguration;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.spi.IdempotentRepository;

public abstract class SourceRouteBuilderBase extends RouteBuilder {

    protected IdempotentRepository<String> idempotentRepository;
    protected TatamibotConfiguration configuration;
    protected String tatamiBotLogin;

    public SourceRouteBuilderBase() {
    }

    public IdempotentRepository<String> getIdempotentRepository() {
        return idempotentRepository;
    }

    public void setIdempotentRepository(IdempotentRepository<String> idempotentRepository) {
        this.idempotentRepository = idempotentRepository;
    }

    public TatamibotConfiguration getConfiguration() {
        return configuration;
    }

    public void setConfiguration(TatamibotConfiguration configuration) {
        this.configuration = configuration;
    }

    public String getTatamiBotLogin() {
        return tatamiBotLogin;
    }

    public void setTatamiBotLogin(String tatamiBotLogin) {
        this.tatamiBotLogin = tatamiBotLogin;
    }

}