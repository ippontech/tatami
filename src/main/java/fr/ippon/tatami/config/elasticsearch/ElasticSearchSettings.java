package fr.ippon.tatami.config.elasticsearch;

import static org.elasticsearch.common.settings.ImmutableSettings.settingsBuilder;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.common.settings.Settings;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

/**
 * Tatami ElasticSearch configuration wrapper.
 * @author dmartin
 */
@Component
public class ElasticSearchSettings {

    private static final Log LOG = LogFactory.getLog(ElasticSearchSettings.class);

    public static final String DEFAULT_SETTINGS_RESOURCE_PATH = "META-INF/elasticsearch/elasticsearch.yml";
    public static final String DEFAULT_TYPES_DEFINITION_RESOURCE_PATH = "META-INF/elasticsearch/types/";

    private final ObjectMapper mapper = new ObjectMapper();
    private final Settings settings;
    private final String typesMappingResourcePath;

    /**
     * Default constructor
     */
    public ElasticSearchSettings() {
        this(DEFAULT_SETTINGS_RESOURCE_PATH, DEFAULT_TYPES_DEFINITION_RESOURCE_PATH);
    }

    /**
     * You can only provide a path for ES settings.
     * @param settingsResourcePath a valid path in the classpath or null (in this case, the default value is used)
     */
    public ElasticSearchSettings(final String settingsResourcePath) {
        this((settingsResourcePath == null) ? DEFAULT_SETTINGS_RESOURCE_PATH : settingsResourcePath, DEFAULT_TYPES_DEFINITION_RESOURCE_PATH);
    }

    /**
     * Initialize the settings wrapper with two resources paths : main configuration and optional types mappings definition.<br>
     * @param settingsResourcePath
     * @param typesResourcePath : must ends with a slash '/' character.
     */
    public ElasticSearchSettings(final String settingsResourcePath, final String typesResourcePath) {
        Assert.notNull(settingsResourcePath, "Mandatory parameter");
        Assert.notNull(typesResourcePath, "Mandatory parameter");
        if (!typesResourcePath.endsWith("/")) {
            throw new IllegalArgumentException("Last character must be '/'");
        }

        LOG.debug("Elastic Search settings are read from: " + settingsResourcePath + ", types mapping from: " + typesResourcePath);
        this.settings = settingsBuilder()
                .loadFromClasspath(settingsResourcePath)
                .build();
        this.typesMappingResourcePath = typesResourcePath;
    }

    /**
     * Return ElasticSearch settings, read from either the default or a specified location
     * @return the settings
     */
    public Settings getSettings() {
        return this.settings;
    }

    /**
     * Return some types mapping, if any from a specified (or the default) location
     * @return a Map containing the type as the key and its definition as the value, or an empty map if any
     */
    public Map<String, String> getTypesMapping() {
        final Map<String, String> typesMapping = new HashMap<String, String>();

        List<String> typesMappingDef = null;
        try {
            typesMappingDef = getResourceListing(this.typesMappingResourcePath);
        } catch (URISyntaxException e) {
            LOG.error("Unable to load types mapping from the path: " + this.typesMappingResourcePath, e);
        } catch (IOException e) {
            LOG.error("Can't read types mapping from this location: " + this.typesMappingResourcePath, e);
        }

        if (typesMappingDef != null) {
            JsonNode jsonNode = null;
            String dataType = null;

            String resourceContent = null;
            for (String resource : typesMappingDef) {
                resourceContent = loadFromClasspath(this.typesMappingResourcePath + resource);
                try {
                    jsonNode = this.mapper.readTree(resourceContent);
                    dataType = jsonNode.getFields().next().getKey();
                    typesMapping.put(dataType, resourceContent);
                } catch (JsonProcessingException e) {
                    LOG.warn("Resource " + resource + " may not be a valid JSON file : ignored", e);
                } catch (IOException e) {
                    LOG.warn("Error while accessing to resource " + resource, e);
                }
            }
        }
        return typesMapping;
    }

    /**
     * List directory content for a resource folder.<br>
     * Note : This is not recursive<br>
     * Should work for regular files and also JARs.
     * 
     * @param path to look into. Please note it must end with "/", but not start with one.
     * @return the name of each child item.
     * @throws URISyntaxException
     * @throws IOException
     */
    private List<String> getResourceListing(final String path) throws URISyntaxException, IOException {
        final Class<ElasticSearchSettings> clazz = ElasticSearchSettings.class;
        URL dirURL = clazz.getClassLoader().getResource(path);
        if (dirURL != null && dirURL.getProtocol().equals("file")) {
            /* A file path: easy enough */
            final String[] files = new File(dirURL.toURI()).list();
            return Arrays.asList(files);
        }

        if (dirURL == null) {
            /*
             * In case of a jar file, we can't actually find a directory.
             * Have to assume the same jar as clazz.
             */
            String me = clazz.getName().replace(".", "/") + ".class";
            dirURL = clazz.getClassLoader().getResource(me);
        }

        if (dirURL.getProtocol().equals("jar")) {
            /* A JAR path */
            String jarPath = dirURL.getPath().substring(5, dirURL.getPath().indexOf("!"));
            JarFile jar = new JarFile(URLDecoder.decode(jarPath, "UTF-8"));
            Enumeration<JarEntry> entries = jar.entries();
            List<String> result = new ArrayList<String>();
            String name = null;
            String entry = null;
            while (entries.hasMoreElements()) {
                name = entries.nextElement().getName();
                if (name.startsWith(path)) {
                    entry = name.substring(path.length());
                    int checkSubdir = entry.indexOf("/");
                    if (checkSubdir >= 0) {
                        entry = entry.substring(0, checkSubdir);
                    }
                    result.add(entry);
                }
            }
            return result;
        }

        throw new UnsupportedOperationException("Cannot list files for URL "  + dirURL);
    }

    /**
     * Return the content of a resource in the classpath
     * @param resourceName the resource name (and path)
     * @return the resource's content as a string
     */
    public String loadFromClasspath(final String resourceName) {
        final ClassLoader classLoader = ElasticSearchSettings.class.getClassLoader();
        final InputStream is = classLoader.getResourceAsStream(resourceName);
        String source = null;
        try {
            source = IOUtils.toString(is);
        } catch (IOException e) {
            LOG.warn("Unable to load content of the resource: " + resourceName, e);
        } finally {
            IOUtils.closeQuietly(is);
        }
        return source;
    }


}
