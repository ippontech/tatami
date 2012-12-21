package fr.ippon.tatami.web.rest;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.service.AttachmentService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
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
    public Collection<String> getAttachments() {
        return attachmentService.getAttachmentIdsForCurrentUser();
    }

    /**
     * GET  /attachment/{attachmentId} -> get a specific attachment
     */
    @RequestMapping(value = "/rest/attachment/{attachmentId}",
            method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Attachment getAttachmentById(@PathVariable("attachmentId") String attachmentId) {
        return attachmentService.getAttachementById(attachmentId);
    }
}
