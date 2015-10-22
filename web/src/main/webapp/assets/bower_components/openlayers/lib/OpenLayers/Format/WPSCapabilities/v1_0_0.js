/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WPSCapabilities.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.XML, {

        namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        wps: "http://www.opengis.net/wps/1.0.0",
        xlink: "http://www.w3.org/1999/xlink"
    },

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
        initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var capabilities = {};
        this.readNode(data, capabilities);
        return capabilities;
    },

        readers: {
        "wps": {
            "Capabilities": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "ProcessOfferings": function(node, obj) {
                obj.processOfferings = {};
                this.readChildNodes(node, obj.processOfferings);
            },
            "Process": function(node, processOfferings) {
                var processVersion = this.getAttributeNS(node, this.namespaces.wps, "processVersion");
                var process = {processVersion: processVersion};
                this.readChildNodes(node, process);
                processOfferings[process.identifier] = process;
            },
            "Languages": function(node, obj) {
                obj.languages = [];
                this.readChildNodes(node, obj.languages);
            },
            "Default": function(node, languages) {
                var language = {isDefault: true};
                this.readChildNodes(node, language);
                languages.push(language);
            },
            "Supported": function(node, languages) {
                var language = {};
                this.readChildNodes(node, language);     
                languages.push(language);
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]
    },    
    
    CLASS_NAME: "OpenLayers.Format.WPSCapabilities.v1_0_0" 

});
