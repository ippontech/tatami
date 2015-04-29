/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.Filter.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.GML.v2, OpenLayers.Format.Filter.v1, {
    
        VERSION: "1.0.0",
    
        schemaLocation: "http://www.opengis.net/ogc/filter/1.0.0/filter.xsd",

        initialize: function(options) {
        OpenLayers.Format.GML.v2.prototype.initialize.apply(
            this, [options]
        );
    },

        readers: {
        "ogc": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsNotEqualTo": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLike": function(node, obj) {
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE
                });
                this.readChildNodes(node, filter);
                var wildCard = node.getAttribute("wildCard");
                var singleChar = node.getAttribute("singleChar");
                var esc = node.getAttribute("escape");
                filter.value2regex(wildCard, singleChar, esc);
                obj.filters.push(filter);
            }
        }, OpenLayers.Format.Filter.v1.prototype.readers["ogc"]),
        "gml": OpenLayers.Format.GML.v2.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v2.prototype.readers["feature"]        
    },

        writers: {
        "ogc": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsEqualTo");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsNotEqualTo": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsNotEqualTo");
                this.writeNode("PropertyName", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsLike": function(filter) {
                var node = this.createElementNSPlus("ogc:PropertyIsLike", {
                    attributes: {
                        wildCard: "*", singleChar: ".", escape: "!"
                    }
                });
                this.writeNode("PropertyName", filter, node);
                this.writeNode("Literal", filter.regex2value(), node);
                return node;
            },
            "BBOX": function(filter) {
                var node = this.createElementNSPlus("ogc:BBOX");
                filter.property && this.writeNode("PropertyName", filter, node);
                var box = this.writeNode("gml:Box", filter.value, node);
                if(filter.projection) {
                    box.setAttribute("srsName", filter.projection);
                }
                return node;
            }
        }, OpenLayers.Format.Filter.v1.prototype.writers["ogc"]),
        "gml": OpenLayers.Format.GML.v2.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v2.prototype.writers["feature"]
    },

        writeSpatial: function(filter, name) {
        var node = this.createElementNSPlus("ogc:"+name);
        this.writeNode("PropertyName", filter, node);
        if(filter.value instanceof OpenLayers.Filter.Function) {
            this.writeNode("Function", filter.value, node);
        } else {
        var child;
        if(filter.value instanceof OpenLayers.Geometry) {
            child = this.writeNode("feature:_geometry", filter.value).firstChild;
        } else {
            child = this.writeNode("gml:Box", filter.value);
        }
        if(filter.projection) {
            child.setAttribute("srsName", filter.projection);
        }
        node.appendChild(child);
        }
        return node;
    },


    CLASS_NAME: "OpenLayers.Format.Filter.v1_0_0" 

});