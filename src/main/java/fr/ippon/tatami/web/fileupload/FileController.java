package fr.ippon.tatami.web.fileupload;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.service.AttachmentService;
import fr.ippon.tatami.service.exception.StorageSizeException;
import org.apache.log4j.Logger;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class FileController {

    private static Logger log = Logger.getLogger(FileController.class);

    private static final String HEADER_EXPIRES = "Expires";

    private static final String HEADER_CACHE_CONTROL = "Cache-Control";

    private static final int CACHE_SECONDS = 60 * 60 * 24 * 30;

    private static String HEADER_ETAG = "ETag";

    private static String HEADER_IF_NONE_MATCH = "If-None-Match";

    private String tatamiUrl;

    @Inject
    private Environment env;

    @Inject
    private AttachmentService attachmentService;

    @PostConstruct
    public void init() {
        this.tatamiUrl = env.getProperty("tatami.url");
    }

    @RequestMapping(value = "/rest/fileupload", method = RequestMethod.POST)
    public
    @ResponseBody
    List<UploadedFile> upload(
            @RequestParam("uploadFile") MultipartFile file) throws IOException, StorageSizeException {

        Attachment attachment = new Attachment();
        attachment.setContent(file.getBytes());
        attachment.setFilename(file.getName());
        attachment.setSize(file.getSize());
        attachment.setFilename(file.getOriginalFilename());
        attachment.setCreationDate(new Date());

        attachmentService.createAttachment(attachment);

        log.debug("Created attachment : " + attachment.getAttachmentId());

        List<UploadedFile> uploadedFiles = new ArrayList<UploadedFile>();
        UploadedFile uploadedFile = new UploadedFile(
                attachment.getAttachmentId(),
                file.getOriginalFilename(),
                Long.valueOf(file.getSize()).intValue(),
                tatamiUrl + "/tatami/file/" + attachment.getAttachmentId() + "/" + file.getOriginalFilename());

        uploadedFiles.add(uploadedFile);
        return uploadedFiles;
    }

    @RequestMapping(value = "/file/{attachmentId}/*",
            method = RequestMethod.GET)
    public void download(@PathVariable("attachmentId") String attachmentId,
                         HttpServletRequest request,
                         HttpServletResponse response) throws IOException {

        // Cache the file in the browser
        response.setDateHeader(HEADER_EXPIRES, System.currentTimeMillis() + CACHE_SECONDS * 1000L);
        response.setHeader(HEADER_CACHE_CONTROL, "max-age=" + CACHE_SECONDS + ", must-revalidate");

        // Put the file in the response
        Attachment attachment = attachmentService.getAttachmentById(attachmentId);
        if (attachment == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.sendRedirect("/tatami/file/file_not_found");
        } else {
            // ETag support
            response.setHeader(HEADER_ETAG, attachmentId); // The attachmentId is unique and should not be modified
            String requestETag = request.getHeader(HEADER_IF_NONE_MATCH);
            if (requestETag != null && requestETag.equals(attachmentId)) {
                response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
            } else {
                try {
                    byte[] fileContent = attachment.getContent();
                    response.getOutputStream().write(fileContent);
                } catch (IOException e) {
                    log.info("Error writing file to output stream. " + e.getMessage());
                }
            }
        }

        try {
            response.flushBuffer();
        } catch (IOException e) {

            log.info("Error flushing the output stream. " + e.getMessage());
        }

    }

    @RequestMapping(value = "/file/file_not_found",
            method = RequestMethod.GET)
    public ModelAndView FileNotFound() {
        if (log.isDebugEnabled()) {
            log.debug("File not found !");
        }
        ModelAndView mv = new ModelAndView("errors/file_not_found");
        return mv;
    }
}