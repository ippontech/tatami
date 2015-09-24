/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFSCapabilities.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.WFSCapabilities.v1, {

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
    
        readers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "DefaultSRS": function(node, obj) {
                var defaultSRS = this.getChildValue(node);
                if (defaultSRS) {
                    obj.srs = defaultSRS;
                }
            }
        }, OpenLayers.Format.WFSCapabilities.v1.prototype.readers["wfs"]),
        "ows": OpenLayers.Format.OWSCommon.v1.prototype.readers.ows
    },

    CLASS_NAME: "OpenLayers.Format.WFSCapabilities.v1_1_0" 

});
