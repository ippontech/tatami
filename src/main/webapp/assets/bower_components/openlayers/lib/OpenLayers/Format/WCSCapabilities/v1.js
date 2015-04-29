/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WCSCapabilities.v1 = OpenLayers.Class(
    OpenLayers.Format.XML, {

    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        splitSpace: (/\s+/)
    },

        defaultPrefix: "wcs",

        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var raw = data;
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var capabilities = {};
        this.readNode(data, capabilities);
        return capabilities;
    },

    CLASS_NAME: "OpenLayers.Format.WCSCapabilities.v1" 

});