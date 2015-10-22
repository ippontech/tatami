/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.GML.v2 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
    
        schemaLocation: "http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd",

        initialize: function(options) {
        OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [options]);
    },

        readers: {
        "gml": OpenLayers.Util.applyDefaults({
            "outerBoundaryIs": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.outer = obj.components[0];
            },
            "innerBoundaryIs": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.inner.push(obj.components[0]);
            },
            "Box": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                var min = obj.points[0];
                var max = obj.points[1];
                container.components.push(
                    new OpenLayers.Bounds(min.x, min.y, max.x, max.y)
                );
            }
        }, OpenLayers.Format.GML.Base.prototype.readers["gml"]),
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.readers["wfs"]
    },

        write: function(features) {
        var name;
        if(OpenLayers.Util.isArray(features)) {
            name = "wfs:FeatureCollection";
        } else {
            name = "gml:featureMember";
        }
        var root = this.writeNode(name, features);
        this.setAttributeNS(
            root, this.namespaces["xsi"],
            "xsi:schemaLocation", this.schemaLocation
        );

        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },

        writers: {
        "gml": OpenLayers.Util.applyDefaults({
            "Point": function(geometry) {
                var node = this.createElementNSPlus("gml:Point");
                this.writeNode("coordinates", [geometry], node);
                return node;
            },
            "coordinates": function(points) {
                var numPoints = points.length;
                var parts = new Array(numPoints);
                var point;
                for(var i=0; i<numPoints; ++i) {
                    point = points[i];
                    if(this.xy) {
                        parts[i] = point.x + "," + point.y;
                    } else {
                        parts[i] = point.y + "," + point.x;
                    }
                    if(point.z != undefined) { // allow null or undefined
                        parts[i] += "," + point.z;
                    }
                }
                return this.createElementNSPlus("gml:coordinates", {
                    attributes: {
                        decimal: ".", cs: ",", ts: " "
                    },
                    value: (numPoints == 1) ? parts[0] : parts.join(" ")
                });
            },
            "LineString": function(geometry) {
                var node = this.createElementNSPlus("gml:LineString");
                this.writeNode("coordinates", geometry.components, node);
                return node;
            },
            "Polygon": function(geometry) {
                var node = this.createElementNSPlus("gml:Polygon");
                this.writeNode("outerBoundaryIs", geometry.components[0], node);
                for(var i=1; i<geometry.components.length; ++i) {
                    this.writeNode(
                        "innerBoundaryIs", geometry.components[i], node
                    );
                }
                return node;
            },
            "outerBoundaryIs": function(ring) {
                var node = this.createElementNSPlus("gml:outerBoundaryIs");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "innerBoundaryIs": function(ring) {
                var node = this.createElementNSPlus("gml:innerBoundaryIs");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "LinearRing": function(ring) {
                var node = this.createElementNSPlus("gml:LinearRing");
                this.writeNode("coordinates", ring.components, node);
                return node;
            },
            "Box": function(bounds) {
                var node = this.createElementNSPlus("gml:Box");
                this.writeNode("coordinates", [
                    {x: bounds.left, y: bounds.bottom},
                    {x: bounds.right, y: bounds.top}
                ], node);
                if(this.srsName) {
                    node.setAttribute("srsName", this.srsName);
                }
                return node;
            }
        }, OpenLayers.Format.GML.Base.prototype.writers["gml"]),
        "feature": OpenLayers.Format.GML.Base.prototype.writers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.writers["wfs"]
    },
    
    CLASS_NAME: "OpenLayers.Format.GML.v2" 

});
