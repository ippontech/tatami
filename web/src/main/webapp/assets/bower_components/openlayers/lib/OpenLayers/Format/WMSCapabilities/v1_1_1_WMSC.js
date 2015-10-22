/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMSCapabilities.v1_1_1_WMSC = OpenLayers.Class(
    OpenLayers.Format.WMSCapabilities.v1_1_1, {
    
        version: "1.1.1",
    
        profile: "WMSC",
    
    
        readers: {
        "wms": OpenLayers.Util.applyDefaults({
            "VendorSpecificCapabilities": function(node, obj) {
                obj.vendorSpecific = {tileSets: []};
                this.readChildNodes(node, obj.vendorSpecific);
            },
            "TileSet": function(node, vendorSpecific) {
                var tileset = {srs: {}, bbox: {}, resolutions: []};
                this.readChildNodes(node, tileset);
                vendorSpecific.tileSets.push(tileset);
            },
            "Resolutions": function(node, tileset) {
                var res = this.getChildValue(node).split(" ");
                for (var i=0, len=res.length; i<len; i++) {
                    if (res[i] != "") {
                        tileset.resolutions.push(parseFloat(res[i]));
                    }
                }
            },
            "Width": function(node, tileset) {
                tileset.width = parseInt(this.getChildValue(node));
            },
            "Height": function(node, tileset) {
                tileset.height = parseInt(this.getChildValue(node));
            },
            "Layers": function(node, tileset) {
                tileset.layers = this.getChildValue(node);
            },
            "Styles": function(node, tileset) {
                tileset.styles = this.getChildValue(node);
            }
        }, OpenLayers.Format.WMSCapabilities.v1_1_1.prototype.readers["wms"])
    },

    CLASS_NAME: "OpenLayers.Format.WMSCapabilities.v1_1_1_WMSC" 

});
