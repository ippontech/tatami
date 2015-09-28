/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.OWSContext = OpenLayers.Class(OpenLayers.Format.Context,{
    
        defaultVersion: "0.3.1",

        
        getVersion: function(root, options) {
        var version = OpenLayers.Format.XML.VersionedOGC.prototype.getVersion.apply(
            this, arguments);
        if (version === "0.3.0") {
            version = this.defaultVersion;
        }
        return version;
    },

        toContext: function(obj) {
        var context = {};
        if(obj.CLASS_NAME == "OpenLayers.Map") {
            context.bounds = obj.getExtent();
            context.maxExtent = obj.maxExtent;
            context.projection = obj.projection;
            context.size = obj.getSize();
            context.layers = obj.layers;
        }
        return context;
    },

    CLASS_NAME: "OpenLayers.Format.OWSContext" 

});
