/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.OWSCommon = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
    
        defaultVersion: "1.0.0",
    
    
        getVersion: function(root, options) {
        var version = this.version;
        if(!version) {
            var uri = root.getAttribute("xmlns:ows");
            if (uri && uri.substring(uri.lastIndexOf("/")+1) === "1.1") {
                version ="1.1.0";
            } 
            if(!version) {
                version = this.defaultVersion;
            }
        }
        return version;
    },

    
    CLASS_NAME: "OpenLayers.Format.OWSCommon" 
});
