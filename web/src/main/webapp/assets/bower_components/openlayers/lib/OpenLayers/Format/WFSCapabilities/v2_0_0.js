/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFSCapabilities.v2_0_0 = OpenLayers.Class(
    OpenLayers.Format.XML, {

        namespaces: {
        wfs: "http://www.opengis.net/wfs/2.0",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        ows: "http://www.opengis.net/ows/1.1"
    },

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

        errorProperty: "featureTypeList",

        defaultPrefix: "wfs",
    
    
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

        readers: {
        "wfs": {
            "WFS_Capabilities": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "FeatureTypeList": function(node, request) {
                request.featureTypeList = {
                    featureTypes: []
                };
                this.readChildNodes(node, request.featureTypeList);
            },
            "FeatureType": function(node, featureTypeList) {
                var featureType = {};
                this.readChildNodes(node, featureType);
                featureTypeList.featureTypes.push(featureType);
            },
            "Name": function(node, obj) {
                var name = this.getChildValue(node);
                if(name) {
                    var parts = name.split(":");
                    obj.name = parts.pop();
                    if(parts.length > 0) {
                        obj.featureNS = this.lookupNamespaceURI(node, parts[0]);
                    }
                }
            },
            "Title": function(node, obj) {
                var title = this.getChildValue(node);
                if(title) {
                    obj.title = title;
                }
            },
            "Abstract": function(node, obj) {
                var abst = this.getChildValue(node);
                if(abst) {
                    obj["abstract"] = abst;
                }
            },
            "DefaultCRS": function(node, obj) {
                var defaultCRS = this.getChildValue(node);
                if (defaultCRS) {
                    obj.srs = defaultCRS;
                }
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows
    },

    CLASS_NAME: "OpenLayers.Format.WFSCapabilities.v2_0_0" 

});
