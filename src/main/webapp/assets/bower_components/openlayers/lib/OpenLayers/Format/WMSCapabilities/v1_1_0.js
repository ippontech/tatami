/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMSCapabilities.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.WMSCapabilities.v1_1, {
    
        version: "1.1.0",
    
    
        readers: {
        "wms": OpenLayers.Util.applyDefaults({
            "SRS": function(node, obj) {
                var srs = this.getChildValue(node);
                var values = srs.split(/ +/);
                for (var i=0, len=values.length; i<len; i++) {
                    obj.srs[values[i]] = true;
                }
            }
        }, OpenLayers.Format.WMSCapabilities.v1_1.prototype.readers["wms"])
    },

    CLASS_NAME: "OpenLayers.Format.WMSCapabilities.v1_1_0" 

});
