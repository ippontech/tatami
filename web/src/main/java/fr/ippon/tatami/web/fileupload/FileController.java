package fr.ippon.tatami.web.fileupload;

import com.yammer.metrics.annotation.Timed;

import fr.ippon.tatami.domain.Attachment;
import fr.ippon.tatami.domain.Avatar;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.UserRepository;
import fr.ippon.tatami.security.AuthenticationService;
import fr.ippon.tatami.service.AttachmentService;
import fr.ippon.tatami.service.AvatarService;
import fr.ippon.tatami.service.UserService;
import fr.ippon.tatami.service.exception.StorageSizeException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);


    private static final String HEADER_EXPIRES = "Expires";

    private static final String HEADER_CACHE_CONTROL = "Cache-Control";

    private static final int CACHE_SECONDS = 60 * 60 * 24 * 30;

    private static final String HEADER_ETAG = "ETag";

    private static final String HEADER_IF_NONE_MATCH = "If-None-Match";

    private String tatamiUrl;

    @Inject
    private Environment env;

    @Inject
    private AttachmentService attachmentService;

    @Inject
    private AvatarService avatarService;

    @Inject
    private UserService userService;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthenticationService authenticationService;

    @PostConstruct
    public void init() {
        this.tatamiUrl = env.getProperty("tatami.url");
    }

    @RequestMapping(value = "/file/{attachmentId}/*",
            method = RequestMethod.GET)
    @Timed
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
                    log.info("Error writing file to output stream. {}", e.getMessage());
                }
            }
        }

        try {
            response.flushBuffer();
        } catch (IOException e) {
            log.info("Error flushing the output stream. {}", e.getMessage());
        }

    }
    
    @RequestMapping(value = "/thumbnail/{attachmentId}/*",
			method = RequestMethod.GET)
    @Timed
    public void thumbnail(@PathVariable("attachmentId") String attachmentId,
            			  HttpServletRequest request,
            			  HttpServletResponse response) throws IOException {
    	// Cache the file in the browser
        response.setDateHeader(HEADER_EXPIRES, System.currentTimeMillis() + CACHE_SECONDS * 1000L);
        response.setHeader(HEADER_CACHE_CONTROL, "max-age=" + CACHE_SECONDS + ", must-revalidate");

        // Put the file in the response
        Attachment attachment = attachmentService.getAttachmentById(attachmentId);
        if (attachment == null || attachment.getThumbnail().length == 0) {
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
                    byte[] fileContent = attachment.getThumbnail();
                    response.getOutputStream().write(fileContent);
                } catch (IOException e) {
                    log.info("Error writing file to output stream. {}", e.getMessage());
                }
            }
        }

        try {
            response.flushBuffer();
        } catch (IOException e) {
            log.info("Error flushing the output stream. {}", e.getMessage());
        }
    }



    @RequestMapping(value = "/avatar/{avatarId}/*",
            method = RequestMethod.GET)
    @Timed
    public void getAvatar(@PathVariable("avatarId") String avatarId,
                          HttpServletRequest request,
                          HttpServletResponse response) throws IOException {

        // Cache the file in the browser
        response.setDateHeader(HEADER_EXPIRES, System.currentTimeMillis() + CACHE_SECONDS * 1000L);
        response.setHeader(HEADER_CACHE_CONTROL, "max-age=" + CACHE_SECONDS + ", must-revalidate");

        // Put the file in the response
        Avatar avatar = avatarService.getAvatarById(avatarId);
        if (avatarId == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        } else {
            // ETag support
            response.setHeader(HEADER_ETAG, avatarId); // The attachmentId is unique and should not be modified
            String requestETag = request.getHeader(HEADER_IF_NONE_MATCH);
            if (requestETag != null && requestETag.equals(avatarId)) {
                response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
            } else {
                try {
                    byte[] fileContent = avatar.getContent();
                    response.getOutputStream().write(fileContent);
                } catch (IOException e) {
                    log.info("Error writing file to output stream. {}", e.getMessage());
                }
            }
        }
        try {
            response.flushBuffer();

        } catch (IOException e) {
            log.info("Error flushing the output stream. {}", e.getMessage());
        }
    }

    @RequestMapping(value = "/rest/fileupload/avatar",
            method = RequestMethod.POST)
    @ResponseBody
    @Timed
    public List<UploadedFile> uploadAvatar(
            @RequestParam("uploadFile") MultipartFile file) throws IOException {

        Avatar avatar = new Avatar();
        avatar.setContent(file.getBytes());
        avatar.setFilename(file.getOriginalFilename());
        avatar.setSize(file.getSize());
        avatar.setCreationDate(new Date());

        avatarService.createAvatar(avatar);

        List<UploadedFile> uploadedFiles = new ArrayList<UploadedFile>();
        UploadedFile uploadedFile = new UploadedFile(
                avatar.getAvatarId(),
                file.getOriginalFilename(),
                Long.valueOf(file.getSize()).intValue(),
                tatamiUrl + "/tatami/avatar/" + avatar.getAvatarId() + "/" + file.getOriginalFilename());

        log.info("Avatar url : {}/tatami/avatar/{}/{}", tatamiUrl, avatar.getAvatarId(), file.getOriginalFilename());

        uploadedFiles.add(uploadedFile);

        User user = authenticationService.getCurrentUser();
        user.setAvatar(avatar.getAvatarId());

        userRepository.updateUser(user);

        return uploadedFiles;

    }
	
	    @RequestMapping(value = "/rest/fileupload/avatarIE", headers = "content-type=multipart/*",
            method = RequestMethod.POST)
    @ResponseBody
    @Timed
    public void uploadAvatarIE(
            @RequestParam("uploadFile") MultipartFile file) throws IOException {

        Avatar avatar = new Avatar();
        avatar.setContent(file.getBytes());
        avatar.setFilename(file.getOriginalFilename());
        avatar.setSize(file.getSize());
        avatar.setCreationDate(new Date());

        avatarService.createAvatar(avatar);

        log.info("Avatar url : {}/tatami/avatar/{}/{}", tatamiUrl, avatar.getAvatarId(), file.getOriginalFilename());

        User user = authenticationService.getCurrentUser();
        user.setAvatar(avatar.getAvatarId());

        userRepository.updateUser(user);

    }


    @RequestMapping(value = "/rest/fileupload", method = RequestMethod.POST)
    @ResponseBody
    @Timed
    public List<UploadedFile> upload(@RequestParam("uploadFile") MultipartFile file)
            throws IOException, StorageSizeException {

        Attachment attachment = new Attachment();
        attachment.setContent(file.getBytes());
        attachment.setFilename(file.getName());
        attachment.setSize(file.getSize());
        attachment.setFilename(file.getOriginalFilename());
        attachment.setCreationDate(new Date());

        attachmentService.createAttachment(attachment);

        log.debug("Created attachment : {}", attachment.getAttachmentId());

        List<UploadedFile> uploadedFiles = new ArrayList<UploadedFile>();
        UploadedFile uploadedFile = new UploadedFile(
                attachment.getAttachmentId(),
                file.getOriginalFilename(),
                Long.valueOf(file.getSize()).intValue(),
                tatamiUrl + "/tatami/file/" + attachment.getAttachmentId() + "/" + file.getOriginalFilename());

        uploadedFiles.add(uploadedFile);
        return uploadedFiles;
    }
	
	@RequestMapping(value = "/rest/fileuploadIE", headers = "content-type=multipart/*",
    		method = RequestMethod.POST, produces = "text/html")
    @ResponseBody
    @Timed
    public String uploadIE(@RequestParam("uploadFile") MultipartFile file)
            throws IOException, StorageSizeException {

        Attachment attachment = new Attachment();
        attachment.setContent(file.getBytes());
        attachment.setFilename(file.getName());
        attachment.setSize(file.getSize());
        attachment.setFilename(file.getOriginalFilename());
        attachment.setCreationDate(new Date());

        attachmentService.createAttachment(attachment);

        log.debug("Created attachment : {}", attachment.getAttachmentId());
        
        String result = attachment.getAttachmentId()+":::"+file.getOriginalFilename()+":::"+file.getSize(); 
        
        return URLEncoder.encode(result, "UTF-8");
		
    }

    @RequestMapping(value = "/file/file_not_found",
            method = RequestMethod.GET)
    @Timed
    public ModelAndView FileNotFound() {
        log.debug("File not found !");
        return new ModelAndView("errors/file_not_found");
    }


}