/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMSCapabilities.v1_1_1 = OpenLayers.Class(
    OpenLayers.Format.WMSCapabilities.v1_1, {
    
        version: "1.1.1",
    
    
        readers: {
        "wms": OpenLayers.Util.applyDefaults({
            "SRS": function(node, obj) {
                obj.srs[this.getChildValue(node)] = true;
            }
        }, OpenLayers.Format.WMSCapabilities.v1_1.prototype.readers["wms"])
    },

    CLASS_NAME: "OpenLayers.Format.WMSCapabilities.v1_1_1" 

});
