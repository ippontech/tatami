package fr.ippon.tatami.repository.cassandra;

import static fr.ippon.tatami.config.ColumnFamilyKeys.ATTACHMENT_CF;

import java.util.HashSet;
import java.util.Set;

import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hom.EntityManagerImpl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.validation.ContraintsAttachmentCreation;
import fr.ippon.tatami.repository.AttachmentRepository;
import fr.ippon.tatami.repository.CounterRepository;

@Repository
public class CassandraAttachmentRepository implements AttachmentRepository {

    private final Log log = LogFactory.getLog(CassandraAttachmentRepository.class);

    @Inject
    private EntityManagerImpl em;

    @Inject
    private Keyspace keyspaceOperator;

    @Inject
    private CounterRepository counterRepository;

    private static ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static Validator validator = factory.getValidator();

    @Override
    public void createAttachment(Attachment attachement) {
        if (log.isDebugEnabled()) {
            log.debug("Creating attachment : " + attachement);
        }
        Set<ConstraintViolation<Attachment>> constraintViolations =
                validator.validate(attachement, ContraintsAttachmentCreation.class);
        if (!constraintViolations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(constraintViolations));
        }
        em.persist(attachement);
    }

    @Override
    @CacheEvict(value = "attachment-cache", key = "#attachment.attachmentId")
    public void deleteAttachment(Attachment attachement) {
        if (log.isDebugEnabled()) {
            log.debug("Deleting attachement : " + attachement);
        }
        Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, StringSerializer.get());
        mutator.addDeletion(attachement.getAttachmentId(), ATTACHMENT_CF);
        mutator.execute();
    }

    @Override
    @Cacheable("attachment-cache")
    public Attachment findAttachmentById(String attachmentId) {
        if (attachmentId == null) {
            return null;
        }
        if (log.isDebugEnabled()) {
            log.debug("Finding attachment : " + attachmentId);
        }
        Attachment attachement = em.find(Attachment.class, attachmentId);
        return attachement;
    }
}