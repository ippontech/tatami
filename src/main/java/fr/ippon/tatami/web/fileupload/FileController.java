package fr.ippon.tatami.web.fileupload;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.service.AttachmentService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class FileController {

    private static Logger log = Logger.getLogger(FileController.class);

    @Inject
    private AttachmentService attachmentService;

    @RequestMapping(value = "/rest/fileupload", method = RequestMethod.POST)
    public
    @ResponseBody
    List<UploadedFile> upload(
            @RequestParam("uploadFile") MultipartFile file) throws IOException {

        Attachment attachment = new Attachment();
        attachment.setContent(file.getBytes());
        attachment.setFilename(file.getName());
        attachment.setSize(file.getSize());


        attachmentService.createAttachment(attachment);

        log.debug("Created attachement : " + attachment.getAttachmentId());

        List<UploadedFile> uploadedFiles = new ArrayList<UploadedFile>();
        UploadedFile u = new UploadedFile(file.getOriginalFilename(),
                Long.valueOf(file.getSize()).intValue(),
                "http://localhost:8080/spring-fileupload-tutorial/resources/" + file.getOriginalFilename());

        uploadedFiles.add(u);
        return uploadedFiles;
    }

    @RequestMapping(value = "/file/{attachmentId}", method = RequestMethod.GET)
    public void download(@PathVariable("attachmentId") String attachmentId, HttpServletResponse response) {
        try {
            byte[] fileContent = attachmentService.getAttachementById(attachmentId).getContent();
            response.getOutputStream().write(fileContent);
            response.flushBuffer();
        } catch (IOException e) {
            log.info("Error writing file to output stream. " + e.getMessage());
        }
    }
}