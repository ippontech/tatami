package fr.ippon.tatami.web.rest;

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
    public Collection<Attachment> getAttachments(
            @RequestParam(required = false) Integer pagination) {

        if (pagination == null) {
            pagination = 0;
        }

        Collection<String> attachmentIds =
                attachmentService.getAttachmentIdsForCurrentUser(pagination);

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
    @RequestMapping(value = "/rest/attachment/{attachmentId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Attachment getAttachmentById(@PathVariable("attachmentId") String attachmentId) {
        return attachmentService.getAttachmentById(attachmentId);
    }


    /**
     * POST /attachment/destroy -> delete a specific attachment
     */
    @RequestMapping(value = "/rest/attachment/destroy",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public void DeleteAttachment(@RequestBody Attachment attachment) {
        attachmentService.deleteAttachment(attachment);
    }
}
