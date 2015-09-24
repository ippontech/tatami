/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.GML = OpenLayers.Class(OpenLayers.Format.XML, {
    
        featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
        featurePrefix: "feature",
    
        featureName: "featureMember", 
    
        layerName: "features",
    
        geometryName: "geometry",
    
        collectionName: "FeatureCollection",
    
        gmlns: "http://www.opengis.net/gml",

        extractAttributes: true,
    
        initialize: function(options) {
        this.regExes = {
            trimSpace: (/^\s*|\s*$/g),
            removeSpace: (/\s*/g),
            splitSpace: (/\s+/),
            trimComma: (/\s*,\s*/g)
        };
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

        read: function(data) {
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var featureNodes = this.getElementsByTagNameNS(data.documentElement,
                                                       this.gmlns,
                                                       this.featureName);
        var features = [];
        for(var i=0; i<featureNodes.length; i++) {
            var feature = this.parseFeature(featureNodes[i]);
            if(feature) {
                features.push(feature);
            }
        }
        return features;
    },
    
        parseFeature: function(node) {
        var order = ["MultiPolygon", "Polygon",
                     "MultiLineString", "LineString",
                     "MultiPoint", "Point", "Envelope"];
        var type, nodeList, geometry, parser;
        for(var i=0; i<order.length; ++i) {
            type = order[i];
            nodeList = this.getElementsByTagNameNS(node, this.gmlns, type);
            if(nodeList.length > 0) {
                parser = this.parseGeometry[type.toLowerCase()];
                if(parser) {
                    geometry = parser.apply(this, [nodeList[0]]);
                    if (this.internalProjection && this.externalProjection) {
                        geometry.transform(this.externalProjection, 
                                           this.internalProjection); 
                    }                       
                } else {
                    throw new TypeError("Unsupported geometry type: " + type);
                }
                break;
            }
        }

        var bounds;
        var boxNodes = this.getElementsByTagNameNS(node, this.gmlns, "Box");
        for(i=0; i<boxNodes.length; ++i) {
            var boxNode = boxNodes[i];
            var box = this.parseGeometry["box"].apply(this, [boxNode]);
            var parentNode = boxNode.parentNode;
            var parentName = parentNode.localName ||
                             parentNode.nodeName.split(":").pop();
            if(parentName === "boundedBy") {
                bounds = box;
            } else {
                geometry = box.toGeometry();
            }
        }
        var attributes;
        if(this.extractAttributes) {
            attributes = this.parseAttributes(node);
        }
        var feature = new OpenLayers.Feature.Vector(geometry, attributes);
        feature.bounds = bounds;
        
        var firstChild = this.getFirstElementChild(node);
        feature.gml = {
            featureType: firstChild.nodeName.split(":")[1],
            featureNS: firstChild.namespaceURI,
            featureNSPrefix: firstChild.prefix
        };
        feature.type = feature.gml.featureType;
        var childNode = node.firstChild;
        var fid;
        while(childNode) {
            if(childNode.nodeType == 1) {
                fid = childNode.getAttribute("fid") ||
                      childNode.getAttribute("id");
                if(fid) {
                    break;
                }
            }
            childNode = childNode.nextSibling;
        }
        feature.fid = fid;
        return feature;
    },
    
        parseGeometry: {
        
                point: function(node) {
                        var nodeList, coordString;
            var coords = [];
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns, "pos");
            if(nodeList.length > 0) {
                coordString = nodeList[0].firstChild.nodeValue;
                coordString = coordString.replace(this.regExes.trimSpace, "");
                coords = coordString.split(this.regExes.splitSpace);
            }
            if(coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "coordinates");
                if(nodeList.length > 0) {
                    coordString = nodeList[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.removeSpace,
                                                      "");
                    coords = coordString.split(",");
                }
            }
            if(coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "coord");
                if(nodeList.length > 0) {
                    var xList = this.getElementsByTagNameNS(nodeList[0],
                                                            this.gmlns, "X");
                    var yList = this.getElementsByTagNameNS(nodeList[0],
                                                            this.gmlns, "Y");
                    if(xList.length > 0 && yList.length > 0) {
                        coords = [xList[0].firstChild.nodeValue,
                                  yList[0].firstChild.nodeValue];
                    }
                }
            }
            if(coords.length == 2) {
                coords[2] = null;
            }
            
            if (this.xy) {
                return new OpenLayers.Geometry.Point(coords[0], coords[1],
                                                 coords[2]);
            }
            else{
                return new OpenLayers.Geometry.Point(coords[1], coords[0],
                                                 coords[2]);
            }
        },
        
                multipoint: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "Point");
            var components = [];
            if(nodeList.length > 0) {
                var point;
                for(var i=0; i<nodeList.length; ++i) {
                    point = this.parseGeometry.point.apply(this, [nodeList[i]]);
                    if(point) {
                        components.push(point);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiPoint(components);
        },
        
                linestring: function(node, ring) {
                        var nodeList, coordString;
            var coords = [];
            var points = [];
            nodeList = this.getElementsByTagNameNS(node, this.gmlns, "posList");
            if(nodeList.length > 0) {
                coordString = this.getChildValue(nodeList[0]);
                coordString = coordString.replace(this.regExes.trimSpace, "");
                coords = coordString.split(this.regExes.splitSpace);
                var dim = parseInt(nodeList[0].getAttribute("dimension"));
                var j, x, y, z;
                for(var i=0; i<coords.length/dim; ++i) {
                    j = i * dim;
                    x = coords[j];
                    y = coords[j+1];
                    z = (dim == 2) ? null : coords[j+2];
                    if (this.xy) {
                        points.push(new OpenLayers.Geometry.Point(x, y, z));
                    } else {
                        points.push(new OpenLayers.Geometry.Point(y, x, z));
                    }
                }
            }
            if(coords.length == 0) {
                nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "coordinates");
                if(nodeList.length > 0) {
                    coordString = this.getChildValue(nodeList[0]);
                    coordString = coordString.replace(this.regExes.trimSpace,
                                                      "");
                    coordString = coordString.replace(this.regExes.trimComma,
                                                      ",");
                    var pointList = coordString.split(this.regExes.splitSpace);
                    for(var i=0; i<pointList.length; ++i) {
                        coords = pointList[i].split(",");
                        if(coords.length == 2) {
                            coords[2] = null;
                        }
                        if (this.xy) {
                            points.push(new OpenLayers.Geometry.Point(coords[0],
                                                                  coords[1],
                                                                  coords[2]));
                        } else {
                            points.push(new OpenLayers.Geometry.Point(coords[1],
                                                                  coords[0],
                                                                  coords[2]));
                        }
                    }
                }
            }

            var line = null;
            if(points.length != 0) {
                if(ring) {
                    line = new OpenLayers.Geometry.LinearRing(points);
                } else {
                    line = new OpenLayers.Geometry.LineString(points);
                }
            }
            return line;
        },
        
                multilinestring: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "LineString");
            var components = [];
            if(nodeList.length > 0) {
                var line;
                for(var i=0; i<nodeList.length; ++i) {
                    line = this.parseGeometry.linestring.apply(this,
                                                               [nodeList[i]]);
                    if(line) {
                        components.push(line);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiLineString(components);
        },
        
                polygon: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "LinearRing");
            var components = [];
            if(nodeList.length > 0) {
                var ring;
                for(var i=0; i<nodeList.length; ++i) {
                    ring = this.parseGeometry.linestring.apply(this,
                                                        [nodeList[i], true]);
                    if(ring) {
                        components.push(ring);
                    }
                }
            }
            return new OpenLayers.Geometry.Polygon(components);
        },
        
                multipolygon: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                       "Polygon");
            var components = [];
            if(nodeList.length > 0) {
                var polygon;
                for(var i=0; i<nodeList.length; ++i) {
                    polygon = this.parseGeometry.polygon.apply(this,
                                                               [nodeList[i]]);
                    if(polygon) {
                        components.push(polygon);
                    }
                }
            }
            return new OpenLayers.Geometry.MultiPolygon(components);
        },
        
        envelope: function(node) {
            var components = [];
            var coordString;
            var envelope;
            
            var lpoint = this.getElementsByTagNameNS(node, this.gmlns, "lowerCorner");
            if (lpoint.length > 0) {
                var coords = [];
                
                if(lpoint.length > 0) {
                    coordString = lpoint[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coords = coordString.split(this.regExes.splitSpace);
                }
                
                if(coords.length == 2) {
                    coords[2] = null;
                }
                if (this.xy) {
                    var lowerPoint = new OpenLayers.Geometry.Point(coords[0], coords[1],coords[2]);
                } else {
                    var lowerPoint = new OpenLayers.Geometry.Point(coords[1], coords[0],coords[2]);
                }
            }
            
            var upoint = this.getElementsByTagNameNS(node, this.gmlns, "upperCorner");
            if (upoint.length > 0) {
                var coords = [];
                
                if(upoint.length > 0) {
                    coordString = upoint[0].firstChild.nodeValue;
                    coordString = coordString.replace(this.regExes.trimSpace, "");
                    coords = coordString.split(this.regExes.splitSpace);
                }
                
                if(coords.length == 2) {
                    coords[2] = null;
                }
                if (this.xy) {
                    var upperPoint = new OpenLayers.Geometry.Point(coords[0], coords[1],coords[2]);
                } else {
                    var upperPoint = new OpenLayers.Geometry.Point(coords[1], coords[0],coords[2]);
                }
            }
            
            if (lowerPoint && upperPoint) {
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, lowerPoint.y));
                components.push(new OpenLayers.Geometry.Point(upperPoint.x, lowerPoint.y));
                components.push(new OpenLayers.Geometry.Point(upperPoint.x, upperPoint.y));
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, upperPoint.y));
                components.push(new OpenLayers.Geometry.Point(lowerPoint.x, lowerPoint.y));
                
                var ring = new OpenLayers.Geometry.LinearRing(components);
                envelope = new OpenLayers.Geometry.Polygon([ring]);
            }
            return envelope; 
        },

                box: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.gmlns,
                                                   "coordinates");
            var coordString;
            var coords, beginPoint = null, endPoint = null;
            if (nodeList.length > 0) {
                coordString = nodeList[0].firstChild.nodeValue;
                coords = coordString.split(" ");
                if (coords.length == 2) {
                    beginPoint = coords[0].split(",");
                    endPoint = coords[1].split(",");
                }
            }
            if (beginPoint !== null && endPoint !== null) {
                return new OpenLayers.Bounds(parseFloat(beginPoint[0]),
                    parseFloat(beginPoint[1]),
                    parseFloat(endPoint[0]),
                    parseFloat(endPoint[1]) );
            }
        }
        
    },
    
        parseAttributes: function(node) {
        var attributes = {};
        var childNode = node.firstChild;
        var children, i, child, grandchildren, grandchild, name, value;
        while(childNode) {
            if(childNode.nodeType == 1) {
                children = childNode.childNodes;
                for(i=0; i<children.length; ++i) {
                    child = children[i];
                    if(child.nodeType == 1) {
                        grandchildren = child.childNodes;
                        if(grandchildren.length == 1) {
                            grandchild = grandchildren[0];
                            if(grandchild.nodeType == 3 ||
                               grandchild.nodeType == 4) {
                                name = (child.prefix) ?
                                        child.nodeName.split(":")[1] :
                                        child.nodeName;
                                value = grandchild.nodeValue.replace(
                                                this.regExes.trimSpace, "");
                                attributes[name] = value;
                            }
                        } else {
                            attributes[child.nodeName.split(":").pop()] = null;
                        }
                    }
                }
                break;
            }
            childNode = childNode.nextSibling;
        }
        return attributes;
    },
    
        write: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        var gml = this.createElementNS("http://www.opengis.net/wfs",
                                       "wfs:" + this.collectionName);
        for(var i=0; i<features.length; i++) {
            gml.appendChild(this.createFeatureXML(features[i]));
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [gml]);
    },

        createFeatureXML: function(feature) {
        var geometry = feature.geometry;
        var geometryNode = this.buildGeometryNode(geometry);
        var geomContainer = this.createElementNS(this.featureNS,
                                                 this.featurePrefix + ":" +
                                                 this.geometryName);
        geomContainer.appendChild(geometryNode);
        var featureNode = this.createElementNS(this.gmlns,
                                               "gml:" + this.featureName);
        var featureContainer = this.createElementNS(this.featureNS,
                                                    this.featurePrefix + ":" +
                                                    this.layerName);
        var fid = feature.fid || feature.id;
        featureContainer.setAttribute("fid", fid);
        featureContainer.appendChild(geomContainer);
        for(var attr in feature.attributes) {
            var attrText = this.createTextNode(feature.attributes[attr]); 
            var nodename = attr.substring(attr.lastIndexOf(":") + 1);
            var attrContainer = this.createElementNS(this.featureNS,
                                                     this.featurePrefix + ":" +
                                                     nodename);
            attrContainer.appendChild(attrText);
            featureContainer.appendChild(attrContainer);
        }    
        featureNode.appendChild(featureContainer);
        return featureNode;
    },
    
        buildGeometryNode: function(geometry) {
        if (this.externalProjection && this.internalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, 
                               this.externalProjection);
        }    
        var className = geometry.CLASS_NAME;
        var type = className.substring(className.lastIndexOf(".") + 1);
        var builder = this.buildGeometry[type.toLowerCase()];
        return builder.apply(this, [geometry]);
    },

        buildGeometry: {

                point: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:Point");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        
                multipoint: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiPoint");
            var points = geometry.components;
            var pointMember, pointGeom;
            for(var i=0; i<points.length; i++) { 
                pointMember = this.createElementNS(this.gmlns,
                                                   "gml:pointMember");
                pointGeom = this.buildGeometry.point.apply(this,
                                                               [points[i]]);
                pointMember.appendChild(pointGeom);
                gml.appendChild(pointMember);
            }
            return gml;            
        },
        
                linestring: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:LineString");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        
                multilinestring: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiLineString");
            var lines = geometry.components;
            var lineMember, lineGeom;
            for(var i=0; i<lines.length; ++i) {
                lineMember = this.createElementNS(this.gmlns,
                                                  "gml:lineStringMember");
                lineGeom = this.buildGeometry.linestring.apply(this,
                                                                   [lines[i]]);
                lineMember.appendChild(lineGeom);
                gml.appendChild(lineMember);
            }
            return gml;
        },
        
                linearring: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:LinearRing");
            gml.appendChild(this.buildCoordinatesNode(geometry));
            return gml;
        },
        
                polygon: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:Polygon");
            var rings = geometry.components;
            var ringMember, ringGeom, type;
            for(var i=0; i<rings.length; ++i) {
                type = (i==0) ? "outerBoundaryIs" : "innerBoundaryIs";
                ringMember = this.createElementNS(this.gmlns,
                                                  "gml:" + type);
                ringGeom = this.buildGeometry.linearring.apply(this,
                                                                   [rings[i]]);
                ringMember.appendChild(ringGeom);
                gml.appendChild(ringMember);
            }
            return gml;
        },
        
                multipolygon: function(geometry) {
            var gml = this.createElementNS(this.gmlns, "gml:MultiPolygon");
            var polys = geometry.components;
            var polyMember, polyGeom;
            for(var i=0; i<polys.length; ++i) {
                polyMember = this.createElementNS(this.gmlns,
                                                  "gml:polygonMember");
                polyGeom = this.buildGeometry.polygon.apply(this,
                                                                [polys[i]]);
                polyMember.appendChild(polyGeom);
                gml.appendChild(polyMember);
            }
            return gml;

        },
 
                bounds: function(bounds) {
            var gml = this.createElementNS(this.gmlns, "gml:Box");
            gml.appendChild(this.buildCoordinatesNode(bounds));
            return gml;
        }
    },

        buildCoordinatesNode: function(geometry) {
        var coordinatesNode = this.createElementNS(this.gmlns,
                                                   "gml:coordinates");
        coordinatesNode.setAttribute("decimal", ".");
        coordinatesNode.setAttribute("cs", ",");
        coordinatesNode.setAttribute("ts", " ");

        var parts = [];

        if(geometry instanceof OpenLayers.Bounds){
            parts.push(geometry.left + "," + geometry.bottom);
            parts.push(geometry.right + "," + geometry.top);
        } else {
            var points = (geometry.components) ? geometry.components : [geometry];
            for(var i=0; i<points.length; i++) {
                parts.push(points[i].x + "," + points[i].y);                
            }            
        }

        var txtNode = this.createTextNode(parts.join(" "));
        coordinatesNode.appendChild(txtNode);
        
        return coordinatesNode;
    },

    CLASS_NAME: "OpenLayers.Format.GML" 
});
