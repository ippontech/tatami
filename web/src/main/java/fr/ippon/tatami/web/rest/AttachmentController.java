package fr.ippon.tatami.web.rest;

import com.yammer.metrics.annotation.Timed;
import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.service.AttachmentService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;

@Controller
public class AttachmentController {

    @Inject
    private AttachmentService attachmentService;

    /**
     * GET  /attachments -> get the attachments list
     */
    @RequestMapping(value = "/rest/attachments",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Collection<Attachment> getAttachments(
            @RequestParam(required = false) Integer pagination,
            @RequestParam(required = false) String finish) {

        if (pagination == null) {
            pagination = 10;
        }

        Collection<String> attachmentIds =
                attachmentService.getAttachmentIdsForCurrentUser(pagination, finish);

        Collection<Attachment> attachments =
                new ArrayList<Attachment>();

        for (String attachmentId : attachmentIds) {
            attachments.add(attachmentService.getAttachmentById(attachmentId));
        }

        return attachments;
    }

    /**
     * GET  /attachment/{attachmentId} -> get a specific attachment
     */
    @RequestMapping(value = "/rest/attachments/{attachmentId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Attachment getAttachmentById(@PathVariable("attachmentId") String attachmentId) {
        return attachmentService.getAttachmentById(attachmentId);
    }

    /**
     * DELETE /attachment/{attachmentId} -> delete a specific attachment
     */
    @RequestMapping(value = "/rest/attachments/{attachmentId}",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @ResponseBody
    @Timed
    public Attachment DeleteAttachment(@PathVariable("attachmentId") String attachmentId) {
        Attachment attachment = attachmentService.getAttachmentById(attachmentId);
        attachmentService.deleteAttachment(attachment);
        return attachment;
    }

    /**
     * GET /attachment/quota -> get quota in % for the domain
     */
    @RequestMapping(value = "/rest/attachments/quota",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Collection<Long> getDomainQuota() {
        return attachmentService.getDomainQuota();
    }

}
