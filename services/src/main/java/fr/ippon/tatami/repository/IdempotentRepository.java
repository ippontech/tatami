package fr.ippon.tatami.repository;

/**
 * Used to de-deplucate Camel messages.
 */
public interface IdempotentRepository extends org.apache.camel.spi.IdempotentRepository<String> {

    @Override
    boolean add(String key);

    @Override
    boolean contains(String key);

    @Override
    boolean remove(String key);
}
