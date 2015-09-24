/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFST.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.Filter.v1_0_0, OpenLayers.Format.WFST.v1, {
    
        version: "1.0.0",

        srsNameInQuery: false,
    
        schemaLocations: {
        "wfs": "http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd"
    },

        initialize: function(options) {
        OpenLayers.Format.Filter.v1_0_0.prototype.initialize.apply(this, [options]);
        OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [options]);
    },
    
        readNode: function(node, obj, first) {
        return OpenLayers.Format.GML.v2.prototype.readNode.apply(this, arguments);
    },
    
        readers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "WFS_TransactionResponse": function(node, obj) {
                obj.insertIds = [];
                obj.success = false;
                this.readChildNodes(node, obj);
            },
            "InsertResult": function(node, container) {
                var obj = {fids: []};
                this.readChildNodes(node, obj);
                container.insertIds = container.insertIds.concat(obj.fids);
            },
            "TransactionResult": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Status": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "SUCCESS": function(node, obj) {
                obj.success = true;
            }
        }, OpenLayers.Format.WFST.v1.prototype.readers["wfs"]),
        "gml": OpenLayers.Format.GML.v2.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v2.prototype.readers["feature"],
        "ogc": OpenLayers.Format.Filter.v1_0_0.prototype.readers["ogc"]
    },

        writers: {
        "wfs": OpenLayers.Util.applyDefaults({
            "Query": function(options) {
                options = OpenLayers.Util.extend({
                    featureNS: this.featureNS,
                    featurePrefix: this.featurePrefix,
                    featureType: this.featureType,
                    srsName: this.srsName,
                    srsNameInQuery: this.srsNameInQuery
                }, options);
                var prefix = options.featurePrefix;
                var node = this.createElementNSPlus("wfs:Query", {
                    attributes: {
                        typeName: (prefix ? prefix + ":" : "") +
                            options.featureType
                    }
                });
                if(options.srsNameInQuery && options.srsName) {
                    node.setAttribute("srsName", options.srsName);
                }
                if(options.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + prefix, options.featureNS
                    );
                }
                if(options.propertyNames) {
                    for(var i=0,len = options.propertyNames.length; i<len; i++) {
                        this.writeNode(
                            "ogc:PropertyName", 
                            {property: options.propertyNames[i]},
                            node
                        );
                    }
                }
                if(options.filter) {
                    this.setFilterProperty(options.filter);
                    this.writeNode("ogc:Filter", options.filter, node);
                }
                return node;
            }
        }, OpenLayers.Format.WFST.v1.prototype.writers["wfs"]),
        "gml": OpenLayers.Format.GML.v2.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v2.prototype.writers["feature"],
        "ogc": OpenLayers.Format.Filter.v1_0_0.prototype.writers["ogc"]
    },
   
    CLASS_NAME: "OpenLayers.Format.WFST.v1_0_0" 
});
