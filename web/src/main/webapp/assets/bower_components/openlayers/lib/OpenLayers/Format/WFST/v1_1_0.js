/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFST.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.Filter.v1_1_0, OpenLayers.Format.WFST.v1, {
    
        version: "1.1.0",
    
        schemaLocations: {
        "wfs": "http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
    },
    
        initialize: function(options) {
        OpenLayers.Format.Filter.v1_1_0.prototype.initialize.apply(this, [options]);
        OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [options]);
    },
    
        readNode: function(node, obj, first) {
        return OpenLayers.Format.GML.v3.prototype.readNode.apply(this, arguments);
    },
    
        readers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "FeatureCollection": function(node, obj) {
                obj.numberOfFeatures = parseInt(node.getAttribute(
                    "numberOfFeatures"));
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
            }
        }, OpenLayers.Format.WFST.v1.prototype.readers["wfs"]),
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.readers["feature"],
        "ogc": OpenLayers.Format.Filter.v1_1_0.prototype.readers["ogc"],
        "ows": OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers["ows"]
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
                        typeName: (prefix ? prefix + ":" : "") +
                            options.featureType,
                        srsName: options.srsName
                    }
                });
                if(options.featureNS) {
                    this.setAttributeNS(node, this.namespaces.xmlns,
                        "xmlns:" + prefix, options.featureNS);
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
                    OpenLayers.Format.WFST.v1_1_0.prototype.setFilterProperty.call(this, options.filter);
                    this.writeNode("ogc:Filter", options.filter, node);
                }
                return node;
            },
            "PropertyName": function(obj) {
                return this.createElementNSPlus("wfs:PropertyName", {
                    value: obj.property
                });
            }            
        }, OpenLayers.Format.WFST.v1.prototype.writers["wfs"]),
        "gml": OpenLayers.Format.GML.v3.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.writers["feature"],
        "ogc": OpenLayers.Format.Filter.v1_1_0.prototype.writers["ogc"]
    },

    CLASS_NAME: "OpenLayers.Format.WFST.v1_1_0" 
});
