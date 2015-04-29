/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.Filter.v2_0_0 = OpenLayers.Class(
    OpenLayers.Format.GML.v3, OpenLayers.Format.Filter.v2, {
    
        VERSION: "2.0.0",
    
        schemaLocation: "http://schemas.opengis.net/filter/2.0/filterAll.xsd",

        initialize: function(options) {
        OpenLayers.Format.GML.v3.prototype.initialize.apply(
            this, [options]
        );
    },

        readers: {
        "fes": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function(node, obj) {
                var matchCase = node.getAttribute("matchCase");
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    matchCase: !(matchCase === "false" || matchCase === "0")
                });
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsNotEqualTo": function(node, obj) {
                var matchCase = node.getAttribute("matchCase");
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                    matchCase: !(matchCase === "false" || matchCase === "0")
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
                var esc = node.getAttribute("escapeChar");
                filter.value2regex(wildCard, singleChar, esc);
                obj.filters.push(filter);
            }
        }, OpenLayers.Format.Filter.v2.prototype.readers["fes"]),
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.readers["feature"]
    },

        writers: {
        "fes": OpenLayers.Util.applyDefaults({
            "PropertyIsEqualTo": function(filter) {
                var node = this.createElementNSPlus("fes:PropertyIsEqualTo", {
                    attributes: {matchCase: filter.matchCase}
                });
                this.writeNode("ValueReference", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsNotEqualTo": function(filter) {
                var node = this.createElementNSPlus("fes:PropertyIsNotEqualTo", {
                    attributes: {matchCase: filter.matchCase}
                });
                this.writeNode("ValueReference", filter, node);
                this.writeOgcExpression(filter.value, node);
                return node;
            },
            "PropertyIsLike": function(filter) {
                var node = this.createElementNSPlus("fes:PropertyIsLike", {
                    attributes: {
                        matchCase: filter.matchCase,
                        wildCard: "*", singleChar: ".", escapeChar: "!"
                    }
                });
                this.writeNode("ValueReference", filter, node);
                this.writeNode("Literal", filter.regex2value(), node);
                return node;
            },
            "BBOX": function(filter) {
                var node = this.createElementNSPlus("fes:BBOX");
                filter.property && this.writeNode("ValueReference", filter, node);
                var box = this.writeNode("gml:Envelope", filter.value);
                if(filter.projection) {
                    box.setAttribute("srsName", filter.projection);
                }
                node.appendChild(box); 
                return node;
            },
            "SortBy": function(sortProperties) {
                var node = this.createElementNSPlus("fes:SortBy");
                for (var i=0,l=sortProperties.length;i<l;i++) {
                    this.writeNode(
                        "fes:SortProperty",
                        sortProperties[i],
                        node
                    );
                }
                return node;
            }, 
            "SortProperty": function(sortProperty) {
                var node = this.createElementNSPlus("fes:SortProperty");
                this.writeNode(
                    "fes:ValueReference",
                    sortProperty,
                    node
                );
                this.writeNode(
                    "fes:SortOrder",
                    (sortProperty.order == 'DESC') ? 'DESC' : 'ASC',
                    node
                );
                return node;
            },
            "SortOrder": function(value) {
                var node = this.createElementNSPlus("fes:SortOrder", {
                    value: value
                });
                return node;
            }
        }, OpenLayers.Format.Filter.v2.prototype.writers["fes"]),
        "gml": OpenLayers.Format.GML.v3.prototype.writers["gml"],
        "feature": OpenLayers.Format.GML.v3.prototype.writers["feature"]
    },

        writeSpatial: function(filter, name) {
        var node = this.createElementNSPlus("fes:"+name);
        this.writeNode("ValueReference", filter, node);
        if(filter.value instanceof OpenLayers.Filter.Function) {
            this.writeNode("Function", filter.value, node);
        } else {
        var child;
        if(filter.value instanceof OpenLayers.Geometry) {
            child = this.writeNode("feature:_geometry", filter.value).firstChild;
        } else {
            child = this.writeNode("gml:Envelope", filter.value);
        }
        if(filter.projection) {
            child.setAttribute("srsName", filter.projection);
        }
        node.appendChild(child);
        }
        return node;
    },

    CLASS_NAME: "OpenLayers.Format.Filter.v2_0_0" 

});
