package fr.ippon.tatami.repository;

import java.util.Collection;

/**
 * Created by emilyklein on 7/13/16.
 */
public interface DeletedHoldingRepository {

    void addDeletedStatus (String reportedStatusId, String adminResolved);


    Collection<String> findAllDeleted();

}

