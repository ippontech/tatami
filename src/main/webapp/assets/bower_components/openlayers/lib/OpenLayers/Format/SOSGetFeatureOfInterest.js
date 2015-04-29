/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 

OpenLayers.Format.SOSGetFeatureOfInterest = OpenLayers.Class(
    OpenLayers.Format.XML, {
    
        VERSION: "1.0.0",

        namespaces: {
        sos: "http://www.opengis.net/sos/1.0",
        gml: "http://www.opengis.net/gml",
        sa: "http://www.opengis.net/sampling/1.0",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

        schemaLocation: "http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd",

        defaultPrefix: "sos",

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
    
        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }

        var info = {features: []};
        this.readNode(data, info);
       
        var features = [];
        for (var i=0, len=info.features.length; i<len; i++) {
            var container = info.features[i];
            if(this.internalProjection && this.externalProjection &&
                container.components[0]) {
                    container.components[0].transform(
                        this.externalProjection, this.internalProjection
                    );
            }             
            var feature = new OpenLayers.Feature.Vector(
                container.components[0], container.attributes);
            features.push(feature);
        }
        return features;
    },

        readers: {
        "sa": {
            "SamplingPoint": function(node, obj) {
                if (!obj.attributes) {
                    var feature = {attributes: {}};
                    obj.features.push(feature);
                    obj = feature;
                }
                obj.attributes.id = this.getAttributeNS(node, 
                    this.namespaces.gml, "id");
                this.readChildNodes(node, obj);
            },
            "position": function (node, obj) {
                this.readChildNodes(node, obj);
            }
        },
        "gml": OpenLayers.Util.applyDefaults({
            "FeatureCollection": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "featureMember": function(node, obj) {
                var feature = {attributes: {}};
                obj.features.push(feature);
                this.readChildNodes(node, feature);
            },
            "name": function(node, obj) {
                obj.attributes.name = this.getChildValue(node);
            },
            "pos": function(node, obj) {
                if (!this.externalProjection) {
                    this.externalProjection = new OpenLayers.Projection(
                        node.getAttribute("srsName"));
                }
             OpenLayers.Format.GML.v3.prototype.readers.gml.pos.apply(
                    this, [node, obj]);
            }
        }, OpenLayers.Format.GML.v3.prototype.readers.gml)
    },
    
        writers: {
        "sos": {
            "GetFeatureOfInterest": function(options) {
                var node = this.createElementNSPlus("GetFeatureOfInterest", {
                    attributes: {
                        version: this.VERSION,
                        service: 'SOS',
                        "xsi:schemaLocation": this.schemaLocation
                    } 
                }); 
                for (var i=0, len=options.fois.length; i<len; i++) {
                    this.writeNode("FeatureOfInterestId", {foi: options.fois[i]}, node);
                }
                return node; 
            },
            "FeatureOfInterestId": function(options) {
                var node = this.createElementNSPlus("FeatureOfInterestId", {value: options.foi});
                return node;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Format.SOSGetFeatureOfInterest" 

});
