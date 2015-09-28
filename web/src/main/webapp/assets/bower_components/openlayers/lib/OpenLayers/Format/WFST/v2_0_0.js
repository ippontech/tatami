/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFST.v2_0_0 = OpenLayers.Class(
    OpenLayers.Format.Filter.v2_0_0, OpenLayers.Format.WFST.v1, {
    
        namespaces: {
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs/2.0",
        gml: "http://www.opengis.net/gml/3.2",
        fes: "http://www.opengis.net/fes/2.0",
        xmlns: "http://www.w3.org/2000/xmlns/"
    },
        
        version: "2.0.0",
    
        schemaLocations: {
        "wfs": "http://schemas.opengis.net/wfs/2.0/wfs.xsd"
    },

        initialize: function(options) {
        OpenLayers.Format.Filter.v2_0_0.prototype.initialize.apply(this, [options]);
        OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [options]);
    },
    
        readNode: function(node, obj, first) {
        return OpenLayers.Format.GML.v3.prototype.readNode.apply(this, arguments);
    },
    
        readers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "FeatureCollection": function(node, obj) {
                obj.numberReturned = parseInt(node.getAttribute(
                    "numberReturned"));
                obj.numberMatched = parseInt(node.getAttribute(
                "numberMatched"));
                OpenLayers.Format.WFST.v1.prototype.readers["wfs"]["FeatureCollection"].apply(
                    this, arguments);
            },
            "TransactionResponse": function(node, obj) {
                obj.insertIds = [];
                obj.success = false;
                this.readChildNodes(node, obj);
            },
            "TransactionSummary": function(node, obj) {
                obj.success = true;
            },
            "InsertResults": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Feature": function(node, container) {
                var obj = {fids: []};
                this.readChildNodes(node, obj);
                container.insertIds.push(obj.fids[0]);
            },
            "member": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "boundedBy": function(node, obj) {
                var container = {};
                this.readChildNodes(node, container);
                if(container.components && container.components.length > 0) {
                    obj.bounds = container.components[0];
                }
            }

        }, OpenLayers.Format.WFST.v1.prototype.readers["wfs"]),
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.readers["feature"],
        "ows": OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers["ows"],
        "fes": OpenLayers.Format.Filter.v2_0_0.prototype.readers["fes"]
    },

        writers: {
        "wfs": OpenLayers.Util.applyDefaults({
        	"GetFeature": function(options) {
                var node = OpenLayers.Format.WFST.v1.prototype.writers["wfs"]["GetFeature"].apply(this, arguments);
                options && this.setAttributes(node, {
                    resultType: options.resultType,
                    startIndex: options.startIndex,
                    count: options.count
                });
                return node;
            },
            "Query": function(options) {
                options = OpenLayers.Util.extend({
                    featureNS: this.featureNS,
                    featurePrefix: this.featurePrefix,
                    featureType: this.featureType,
                    srsName: this.srsName
                }, options);
                var prefix = options.featurePrefix;
                var node = this.createElementNSPlus("wfs:Query", {
                    attributes: {
                        typeNames: (prefix ? prefix + ":" : "") +
                            options.featureType,
                        srsName: options.srsName
                    }
                });
                if(options.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + prefix, options.featureNS
                    );
                }
                if(options.propertyNames) {
                    for(var i=0,len = options.propertyNames.length; i<len; i++) {
                        this.writeNode(
                            "wfs:PropertyName", 
                            {property: options.propertyNames[i]},
                            node
                        );
                    }
                }
                if(options.filter) {
                    this.setFilterProperty(options.filter);
                    this.writeNode("fes:Filter", options.filter, node);
                }
                return node;
            },
            "Update": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Update", {
                    attributes: {
                        handle: options && options.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
                            this.featureType
                    }
                });
                if(this.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + this.featurePrefix, this.featureNS
                    );
                }
                var modified = feature.modified;
                if (this.geometryName !== null && (!modified || modified.geometry !== undefined)) {
                    this.srsName = this.getSrsName(feature);
                    this.writeNode(
                        "Property", {name: this.geometryName, value: feature.geometry}, node
                    );
                }
                for(var key in feature.attributes) {
                    if(feature.attributes[key] !== undefined &&
                                (!modified || !modified.attributes ||
                                (modified.attributes && (key in modified.attributes)))) {
                        this.writeNode(
                            "Property", {name: key, value: feature.attributes[key]}, node
                        );
                    }
                }
                this.writeNode("fes:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [feature.fid]
                }), node);
        
                return node;
            },
            "Property": function(obj) {
                var node = this.createElementNSPlus("wfs:Property");
                this.writeNode("ValueReference", obj.name, node);
                if(obj.value !== null) {
                    this.writeNode("Value", obj.value, node);
                }
                return node;
            },
            "PropertyName": function(obj) {
                return this.createElementNSPlus("wfs:PropertyName", {
                    value: obj.property
                });
            },
            "ValueReference": function(name) {
                return this.createElementNSPlus("wfs:ValueReference", {value: name});
            },
            "Delete": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Delete", {
                    attributes: {
                        handle: options && options.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
                            this.featureType
                    }
                });
                if(this.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + this.featurePrefix, this.featureNS
                    );
                }
                this.writeNode("fes:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [feature.fid]
                }), node);
                return node;
            }
        }, OpenLayers.Format.WFST.v1.prototype.writers["wfs"]),
        "gml": OpenLayers.Format.GML.v3.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.writers["feature"],
        "fes": OpenLayers.Format.Filter.v2_0_0.prototype.writers["fes"]
    },
   
    CLASS_NAME: "OpenLayers.Format.WFST.v2_0_0" 
});
