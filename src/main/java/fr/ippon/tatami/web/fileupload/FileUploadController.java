package fr.ippon.tatami.web.fileupload;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Controller
public class FileUploadController {

    private static Logger logger = Logger.getLogger("controller");

    @RequestMapping(value = "/rest/fileupload/message", method = RequestMethod.POST)
    public
    @ResponseBody
    StatusResponse message(@RequestBody Message message) {
        // Do custom steps here
        // i.e. Persist the message to the database
        logger.debug("Service processing...done");

        return new StatusResponse(true, "Message received");
    }

    @RequestMapping(value = "/rest/fileupload", method = RequestMethod.POST)
    public
    @ResponseBody
    List<UploadedFile> upload(
            @RequestParam("uploadFile") MultipartFile file) {

        // Do custom steps here
        // i.e. Save the file to a temporary location or database
        logger.debug("Writing file to disk...done");

        List<UploadedFile> uploadedFiles = new ArrayList<UploadedFile>();
        UploadedFile u = new UploadedFile(file.getOriginalFilename(),
                Long.valueOf(file.getSize()).intValue(),
                "http://localhost:8080/spring-fileupload-tutorial/resources/" + file.getOriginalFilename());

        uploadedFiles.add(u);
        return uploadedFiles;
    }
}