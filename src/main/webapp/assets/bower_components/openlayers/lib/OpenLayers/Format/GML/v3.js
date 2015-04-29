/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.GML.v3 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
    
        schemaLocation: "http://www.opengis.net/gml http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/1.0.0/gmlsf.xsd",

        curve: false,
    
        multiCurve: true,
    
        surface: false,

        multiSurface: true,

        initialize: function(options) {
        OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [options]);
    },

        readers: {
        "gml": OpenLayers.Util.applyDefaults({
            "_inherit": function(node, obj, container) {
                var dim = parseInt(node.getAttribute("srsDimension"), 10) ||
                    (container && container.srsDimension);
                if (dim) {
                    obj.srsDimension = dim;
                }
            },
            "featureMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Curve": function(node, container) {
                var obj = {points: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                container.components.push(
                    new OpenLayers.Geometry.LineString(obj.points)
                );
            },
            "segments": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "LineStringSegment": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                if(obj.points) {
                    Array.prototype.push.apply(container.points, obj.points);
                }
            },
            "pos": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                var coords = str.split(this.regExes.splitSpace);
                var point;
                if(this.xy) {
                    point = new OpenLayers.Geometry.Point(
                        coords[0], coords[1], coords[2]
                    );
                } else {
                    point = new OpenLayers.Geometry.Point(
                        coords[1], coords[0], coords[2]
                    );
                }
                if(!!!obj.points) {
                    obj.points = [];
                }
                obj.points.push(point);
            },
            "posList": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                var coords = str.split(this.regExes.splitSpace);
                var dim = obj.srsDimension ||
                    parseInt(node.getAttribute("srsDimension") || node.getAttribute("dimension"), 10) || 2;
                var j, x, y, z;
                var numPoints = coords.length / dim;
                var points = new Array(numPoints);
                for(var i=0, len=coords.length; i<len; i += dim) {
                    x = coords[i];
                    y = coords[i+1];
                    z = (dim == 2) ? undefined : coords[i+2];
                    if (this.xy) {
                        points[i/dim] = new OpenLayers.Geometry.Point(x, y, z);
                    } else {
                        points[i/dim] = new OpenLayers.Geometry.Point(y, x, z);
                    }
                }
                obj.points = points;
            },
            "Surface": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "patches": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "PolygonPatch": function(node, obj) {
                this.readers.gml.Polygon.apply(this, [node, obj]);
            },
            "exterior": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.outer = obj.components[0];
            },
            "interior": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.inner.push(obj.components[0]);
            },
            "MultiCurve": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(obj.components.length > 0) {
                    container.components = [
                        new OpenLayers.Geometry.MultiLineString(obj.components)
                    ];
                }
            },
            "curveMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "MultiSurface": function(node, container) {
                var obj = {components: []};
                this.readers.gml._inherit.apply(this, [node, obj, container]);
                this.readChildNodes(node, obj);
                if(obj.components.length > 0) {
                    container.components = [
                        new OpenLayers.Geometry.MultiPolygon(obj.components)
                    ];
                }
            },
            "surfaceMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "surfaceMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "pointMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "lineStringMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "polygonMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "geometryMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Envelope": function(node, container) {
                var obj = {points: new Array(2)};
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }

                var min = obj.points[0];
                var max = obj.points[1];
                container.components.push(
                    new OpenLayers.Bounds(min.x, min.y, max.x, max.y)
                );
            },
            "lowerCorner": function(node, container) {
                var obj = {};
                this.readers.gml.pos.apply(this, [node, obj]);
                container.points[0] = obj.points[0];
            },
            "upperCorner": function(node, container) {
                var obj = {};
                this.readers.gml.pos.apply(this, [node, obj]);
                container.points[1] = obj.points[0];
            }
        }, OpenLayers.Format.GML.Base.prototype.readers["gml"]),            
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.readers["wfs"]
    },
    
        write: function(features) {
        var name;
        if(OpenLayers.Util.isArray(features)) {
            name = "featureMembers";
        } else {
            name = "featureMember";
        }
        var root = this.writeNode("gml:" + name, features);
        this.setAttributeNS(
            root, this.namespaces["xsi"],
            "xsi:schemaLocation", this.schemaLocation
        );

        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },

        writers: {
        "gml": OpenLayers.Util.applyDefaults({
            "featureMembers": function(features) {
                var node = this.createElementNSPlus("gml:featureMembers");
                for(var i=0, len=features.length; i<len; ++i) {
                    this.writeNode("feature:_typeName", features[i], node);
                }
                return node;
            },
            "Point": function(geometry) {
                var node = this.createElementNSPlus("gml:Point");
                this.writeNode("pos", geometry, node);
                return node;
            },
            "pos": function(point) {
                var pos = (this.xy) ?
                    (point.x + " " + point.y) : (point.y + " " + point.x);
                return this.createElementNSPlus("gml:pos", {
                    value: pos
                });
            },
            "LineString": function(geometry) {
                var node = this.createElementNSPlus("gml:LineString");
                this.writeNode("posList", geometry.components, node);
                return node;
            },
            "Curve": function(geometry) {
                var node = this.createElementNSPlus("gml:Curve");
                this.writeNode("segments", geometry, node);
                return node;
            },
            "segments": function(geometry) {
                var node = this.createElementNSPlus("gml:segments");
                this.writeNode("LineStringSegment", geometry, node);
                return node;
            },
            "LineStringSegment": function(geometry) {
                var node = this.createElementNSPlus("gml:LineStringSegment");
                this.writeNode("posList", geometry.components, node);
                return node;
            },
            "posList": function(points) {
                var len = points.length;
                var parts = new Array(len);
                var point;
                for(var i=0; i<len; ++i) {
                    point = points[i];
                    if(this.xy) {
                        parts[i] = point.x + " " + point.y;
                    } else {
                        parts[i] = point.y + " " + point.x;
                    }
                }
                return this.createElementNSPlus("gml:posList", {
                    value: parts.join(" ")
                }); 
            },
            "Surface": function(geometry) {
                var node = this.createElementNSPlus("gml:Surface");
                this.writeNode("patches", geometry, node);
                return node;
            },
            "patches": function(geometry) {
                var node = this.createElementNSPlus("gml:patches");
                this.writeNode("PolygonPatch", geometry, node);
                return node;
            },
            "PolygonPatch": function(geometry) {
                var node = this.createElementNSPlus("gml:PolygonPatch", {
                    attributes: {interpolation: "planar"}
                });
                this.writeNode("exterior", geometry.components[0], node);
                for(var i=1, len=geometry.components.length; i<len; ++i) {
                    this.writeNode(
                        "interior", geometry.components[i], node
                    );
                }
                return node;
            },
            "Polygon": function(geometry) {
                var node = this.createElementNSPlus("gml:Polygon");
                this.writeNode("exterior", geometry.components[0], node);
                for(var i=1, len=geometry.components.length; i<len; ++i) {
                    this.writeNode(
                        "interior", geometry.components[i], node
                    );
                }
                return node;
            },
            "exterior": function(ring) {
                var node = this.createElementNSPlus("gml:exterior");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "interior": function(ring) {
                var node = this.createElementNSPlus("gml:interior");
                this.writeNode("LinearRing", ring, node);
                return node;
            },
            "LinearRing": function(ring) {
                var node = this.createElementNSPlus("gml:LinearRing");
                this.writeNode("posList", ring.components, node);
                return node;
            },
            "MultiCurve": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiCurve");
                var components = geometry.components || [geometry];
                for(var i=0, len=components.length; i<len; ++i) {
                    this.writeNode("curveMember", components[i], node);
                }
                return node;
            },
            "curveMember": function(geometry) {
                var node = this.createElementNSPlus("gml:curveMember");
                if(this.curve) {
                    this.writeNode("Curve", geometry, node);
                } else {
                    this.writeNode("LineString", geometry, node);
                }
                return node;
            },
            "MultiSurface": function(geometry) {
                var node = this.createElementNSPlus("gml:MultiSurface");
                var components = geometry.components || [geometry];
                for(var i=0, len=components.length; i<len; ++i) {
                    this.writeNode("surfaceMember", components[i], node);
                }
                return node;
            },
            "surfaceMember": function(polygon) {
                var node = this.createElementNSPlus("gml:surfaceMember");
                if(this.surface) {
                    this.writeNode("Surface", polygon, node);
                } else {
                    this.writeNode("Polygon", polygon, node);
                }
                return node;
            },
            "Envelope": function(bounds) {
                var node = this.createElementNSPlus("gml:Envelope");
                this.writeNode("lowerCorner", bounds, node);
                this.writeNode("upperCorner", bounds, node);
                if(this.srsName) {
                    node.setAttribute("srsName", this.srsName);
                }
                return node;
            },
            "lowerCorner": function(bounds) {
                var pos = (this.xy) ?
                    (bounds.left + " " + bounds.bottom) :
                    (bounds.bottom + " " + bounds.left);
                return this.createElementNSPlus("gml:lowerCorner", {
                    value: pos
                });
            },
            "upperCorner": function(bounds) {
                var pos = (this.xy) ?
                    (bounds.right + " " + bounds.top) :
                    (bounds.top + " " + bounds.right);
                return this.createElementNSPlus("gml:upperCorner", {
                    value: pos
                });
            }
        }, OpenLayers.Format.GML.Base.prototype.writers["gml"]),
        "feature": OpenLayers.Format.GML.Base.prototype.writers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.writers["wfs"]
    },

        setGeometryTypes: function() {
        this.geometryTypes = {
            "OpenLayers.Geometry.Point": "Point",
            "OpenLayers.Geometry.MultiPoint": "MultiPoint",
            "OpenLayers.Geometry.LineString": (this.curve === true) ? "Curve": "LineString",
            "OpenLayers.Geometry.MultiLineString": (this.multiCurve === false) ? "MultiLineString" : "MultiCurve",
            "OpenLayers.Geometry.Polygon": (this.surface === true) ? "Surface" : "Polygon",
            "OpenLayers.Geometry.MultiPolygon": (this.multiSurface === false) ? "MultiPolygon" : "MultiSurface",
            "OpenLayers.Geometry.Collection": "GeometryCollection"
        };
    },
    
    CLASS_NAME: "OpenLayers.Format.GML.v3" 

});
