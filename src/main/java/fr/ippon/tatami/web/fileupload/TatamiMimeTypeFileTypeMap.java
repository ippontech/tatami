package fr.ippon.tatami.web.fileupload;

import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;
import org.springframework.stereotype.Service;

import javax.activation.MimetypesFileTypeMap;

@Service
public class TatamiMimeTypeFileTypeMap extends MimetypesFileTypeMap {

}
