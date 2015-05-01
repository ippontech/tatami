/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Protocol.WFS.v2_0_0 = OpenLayers.Class(OpenLayers.Protocol.WFS.v1, {
    
        version: "2.0.0",
    
        initialize: function(options) {
        OpenLayers.Protocol.WFS.v1.prototype.initialize.apply(this, arguments);
        if (this.outputFormat && !this.readFormat) {
            if (this.outputFormat.toLowerCase() == "gml3") {
                this.readFormat = new OpenLayers.Format.GML.v3({
                    featureType: this.featureType,
                    featureNS: this.featureNS,
                    geometryName: this.geometryName
                });
            } else if (this.outputFormat.toLowerCase() == "json") {
                this.readFormat = new OpenLayers.Format.GeoJSON();
            }
        }
    },
   
    CLASS_NAME: "OpenLayers.Protocol.WFS.v2_0_0"
});
