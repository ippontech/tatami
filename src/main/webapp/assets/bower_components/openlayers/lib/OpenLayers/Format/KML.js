/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.KML = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        kml: "http://www.opengis.net/kml/2.2",
        gx: "http://www.google.com/kml/ext/2.2"
    },

        kmlns: "http://earth.google.com/kml/2.0",
    
        placemarksDesc: "No description available",
    
        foldersName: "OpenLayers export",
    
        foldersDesc: "Exported on " + new Date(),
    
        extractAttributes: true,
    
        kvpAttributes: false,
    
        extractStyles: false,
    
        extractTracks: false,
    
        trackAttributes: null,
    
        internalns: null,

        features: null,

        styles: null,
    
        styleBaseUrl: "",

        fetched: null,

        maxDepth: 0,

        initialize: function(options) {
        this.regExes = {
            trimSpace: (/^\s*|\s*$/g),
            removeSpace: (/\s*/g),
            splitSpace: (/\s+/),
            trimComma: (/\s*,\s*/g),
            kmlColor: (/(\w{2})(\w{2})(\w{2})(\w{2})/),
            kmlIconPalette: (/root:\/\/icons\/palette-(\d+)(\.\w+)/),
            straightBracket: (/\$\[(.*?)\]/g)
        };
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");

        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

        read: function(data) {
        this.features = [];
        this.styles   = {};
        this.fetched  = {};
        var options = {
            depth: 0,
            styleBaseUrl: this.styleBaseUrl
        };

        return this.parseData(data, options);
    },

        parseData: function(data, options) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var types = ["Link", "NetworkLink", "Style", "StyleMap", "Placemark"];
        for(var i=0, len=types.length; i<len; ++i) {
            var type = types[i];

            var nodes = this.getElementsByTagNameNS(data, "*", type);
            if(nodes.length == 0) { 
                continue;
            }

            switch (type.toLowerCase()) {
                case "link":
                case "networklink":
                    this.parseLinks(nodes, options);
                    break;
                case "style":
                    if (this.extractStyles) {
                        this.parseStyles(nodes, options);
                    }
                    break;
                case "stylemap":
                    if (this.extractStyles) {
                        this.parseStyleMaps(nodes, options);
                    }
                    break;
                case "placemark":
                    this.parseFeatures(nodes, options);
                    break;
            }
        }
        
        return this.features;
    },

        parseLinks: function(nodes, options) {
        if (options.depth >= this.maxDepth) {
            return false;
        }
        var newOptions = OpenLayers.Util.extend({}, options);
        newOptions.depth++;

        for(var i=0, len=nodes.length; i<len; i++) {
            var href = this.parseProperty(nodes[i], "*", "href");
            if(href && !this.fetched[href]) {
                this.fetched[href] = true; // prevent reloading the same urls
                var data = this.fetchLink(href);
                if (data) {
                    this.parseData(data, newOptions);
                }
            } 
        }

    },

        fetchLink: function(href) {
        var request = OpenLayers.Request.GET({url: href, async: false});
        if (request) {
            return request.responseText;
        }
    },

        parseStyles: function(nodes, options) {
        for(var i=0, len=nodes.length; i<len; i++) {
            var style = this.parseStyle(nodes[i]);
            if(style) {
                var styleName = (options.styleBaseUrl || "") + "#" + style.id;
                
                this.styles[styleName] = style;
            }
        }
    },

        parseKmlColor: function(kmlColor) {
        var color = null;
        if (kmlColor) {
            var matches = kmlColor.match(this.regExes.kmlColor);
            if (matches) {
                color = {
                    color: '#' + matches[4] + matches[3] + matches[2],
                    opacity: parseInt(matches[1], 16) / 255
                };
            }
        }
        return color;
    },

        parseStyle: function(node) {
        var style = {};
        
        var types = ["LineStyle", "PolyStyle", "IconStyle", "BalloonStyle", 
                     "LabelStyle"];
        var type, styleTypeNode, nodeList, geometry, parser;
        for(var i=0, len=types.length; i<len; ++i) {
            type = types[i];
            styleTypeNode = this.getElementsByTagNameNS(node, "*", type)[0];
            if(!styleTypeNode) { 
                continue;
            }
            switch (type.toLowerCase()) {
                case "linestyle":
                    var kmlColor = this.parseProperty(styleTypeNode, "*", "color");
                    var color = this.parseKmlColor(kmlColor);
                    if (color) {
                        style["strokeColor"] = color.color;
                        style["strokeOpacity"] = color.opacity;
                    }
                    
                    var width = this.parseProperty(styleTypeNode, "*", "width");
                    if (width) {
                        style["strokeWidth"] = width;
                    }
                    break;

                case "polystyle":
                    var kmlColor = this.parseProperty(styleTypeNode, "*", "color");
                    var color = this.parseKmlColor(kmlColor);
                    if (color) {
                        style["fillOpacity"] = color.opacity;
                        style["fillColor"] = color.color;
                    }
                    var fill = this.parseProperty(styleTypeNode, "*", "fill");
                    if (fill == "0") {
                        style["fillColor"] = "none";
                    }
                    var outline = this.parseProperty(styleTypeNode, "*", "outline");
                    if (outline == "0") {
                        style["strokeWidth"] = "0";
                    }
                   
                    break;

                case "iconstyle":
                    var scale = parseFloat(this.parseProperty(styleTypeNode, 
                                                          "*", "scale") || 1);
                    var width = 32 * scale;
                    var height = 32 * scale;

                    var iconNode = this.getElementsByTagNameNS(styleTypeNode, 
                                               "*", 
                                               "Icon")[0];
                    if (iconNode) {
                        var href = this.parseProperty(iconNode, "*", "href");
                        if (href) {                                                   

                            var w = this.parseProperty(iconNode, "*", "w");
                            var h = this.parseProperty(iconNode, "*", "h");
                            var google = "http://maps.google.com/mapfiles/kml";
                            if (OpenLayers.String.startsWith(
                                                 href, google) && !w && !h) {
                                w = 64;
                                h = 64;
                                scale = scale / 2;
                            }
                            w = w || h;
                            h = h || w;

                            if (w) {
                                width = parseInt(w) * scale;
                            }

                            if (h) {
                                height = parseInt(h) * scale;
                            }
                            var matches = href.match(this.regExes.kmlIconPalette);
                            if (matches)  {
                                var palette = matches[1];
                                var file_extension = matches[2];

                                var x = this.parseProperty(iconNode, "*", "x");
                                var y = this.parseProperty(iconNode, "*", "y");

                                var posX = x ? x/32 : 0;
                                var posY = y ? (7 - y/32) : 7;

                                var pos = posY * 8 + posX;
                                href = "http://maps.google.com/mapfiles/kml/pal" 
                                     + palette + "/icon" + pos + file_extension;
                            }

                            style["graphicOpacity"] = 1; // fully opaque
                            style["externalGraphic"] = href;
                        }

                    }
                    var hotSpotNode = this.getElementsByTagNameNS(styleTypeNode, 
                                               "*", 
                                               "hotSpot")[0];
                    if (hotSpotNode) {
                        var x = parseFloat(hotSpotNode.getAttribute("x"));
                        var y = parseFloat(hotSpotNode.getAttribute("y"));

                        var xUnits = hotSpotNode.getAttribute("xunits");
                        if (xUnits == "pixels") {
                            style["graphicXOffset"] = -x * scale;
                        }
                        else if (xUnits == "insetPixels") {
                            style["graphicXOffset"] = -width + (x * scale);
                        }
                        else if (xUnits == "fraction") {
                            style["graphicXOffset"] = -width * x;
                        }

                        var yUnits = hotSpotNode.getAttribute("yunits");
                        if (yUnits == "pixels") {
                            style["graphicYOffset"] = -height + (y * scale) + 1;
                        }
                        else if (yUnits == "insetPixels") {
                            style["graphicYOffset"] = -(y * scale) + 1;
                        }
                        else if (yUnits == "fraction") {
                            style["graphicYOffset"] =  -height * (1 - y) + 1;
                        }
                    }

                    style["graphicWidth"] = width;
                    style["graphicHeight"] = height;
                    break;

                case "balloonstyle":
                    var balloonStyle = OpenLayers.Util.getXmlNodeValue(
                                            styleTypeNode);
                    if (balloonStyle) {
                        style["balloonStyle"] = balloonStyle.replace(
                                       this.regExes.straightBracket, "${$1}");
                    }
                    break;
                case "labelstyle":
                    var kmlColor = this.parseProperty(styleTypeNode, "*", "color");
                    var color = this.parseKmlColor(kmlColor);
                    if (color) {
                        style["fontColor"] = color.color;
                        style["fontOpacity"] = color.opacity;
                    }
                    break;

                default:
            }
        }
        if (!style["strokeColor"] && style["fillColor"]) {
            style["strokeColor"] = style["fillColor"];
        }

        var id = node.getAttribute("id");
        if (id && style) {
            style.id = id;
        }

        return style;
    },

        parseStyleMaps: function(nodes, options) {

        for(var i=0, len=nodes.length; i<len; i++) {
            var node = nodes[i];
            var pairs = this.getElementsByTagNameNS(node, "*", 
                            "Pair");

            var id = node.getAttribute("id");
            for (var j=0, jlen=pairs.length; j<jlen; j++) {
                var pair = pairs[j];
                var key = this.parseProperty(pair, "*", "key");
                var styleUrl = this.parseProperty(pair, "*", "styleUrl");

                if (styleUrl && key == "normal") {
                    this.styles[(options.styleBaseUrl || "") + "#" + id] =
                        this.styles[(options.styleBaseUrl || "") + styleUrl];
                }

            }
        }

    },


        parseFeatures: function(nodes, options) {
        var features = [];
        for(var i=0, len=nodes.length; i<len; i++) {
            var featureNode = nodes[i];
            var feature = this.parseFeature.apply(this,[featureNode]) ;
            if(feature) {
                if (this.extractStyles && feature.attributes &&
                    feature.attributes.styleUrl) {
                    feature.style = this.getStyle(feature.attributes.styleUrl, options);
                }

                if (this.extractStyles) {
                    var inlineStyleNode = this.getElementsByTagNameNS(featureNode,
                                                        "*",
                                                        "Style")[0];
                    if (inlineStyleNode) {
                        var inlineStyle= this.parseStyle(inlineStyleNode);
                        if (inlineStyle) {
                            feature.style = OpenLayers.Util.extend(
                                feature.style, inlineStyle
                            );
                        }
                    }
                }
                if (this.extractTracks) {
                    var tracks = this.getElementsByTagNameNS(
                        featureNode, this.namespaces.gx, "Track"
                    );
                    if (tracks && tracks.length > 0) {
                        var track = tracks[0];
                        var container = {
                            features: [],
                            feature: feature
                        };
                        this.readNode(track, container);
                        if (container.features.length > 0) {
                            features.push.apply(features, container.features);
                        }
                    }
                } else {
                    features.push(feature);                    
                }
            } else {
                throw "Bad Placemark: " + i;
            }
        }
        this.features = this.features.concat(features);
    },
    
        readers: {
        "kml": {
            "when": function(node, container) {
                container.whens.push(OpenLayers.Date.parse(
                    this.getChildValue(node)
                ));
            },
            "_trackPointAttribute": function(node, container) {
                var name = node.nodeName.split(":").pop();
                container.attributes[name].push(this.getChildValue(node));
            }
        },
        "gx": {
            "Track": function(node, container) {
                var obj = {
                    whens: [],
                    points: [],
                    angles: []
                };
                if (this.trackAttributes) {
                    var name;
                    obj.attributes = {};
                    for (var i=0, ii=this.trackAttributes.length; i<ii; ++i) {
                        name = this.trackAttributes[i];
                        obj.attributes[name] = [];
                        if (!(name in this.readers.kml)) {
                            this.readers.kml[name] = this.readers.kml._trackPointAttribute;
                        }
                    }
                }
                this.readChildNodes(node, obj);
                if (obj.whens.length !== obj.points.length) {
                    throw new Error("gx:Track with unequal number of when (" +
                                    obj.whens.length + ") and gx:coord (" +
                                    obj.points.length + ") elements.");
                }
                var hasAngles = obj.angles.length > 0;
                if (hasAngles && obj.whens.length !== obj.angles.length) {
                    throw new Error("gx:Track with unequal number of when (" +
                                    obj.whens.length + ") and gx:angles (" +
                                    obj.angles.length + ") elements.");
                }
                var feature, point, angles;
                for (var i=0, ii=obj.whens.length; i<ii; ++i) {
                    feature = container.feature.clone();
                    feature.fid = container.feature.fid || container.feature.id;
                    point = obj.points[i];
                    feature.geometry = point;
                    if ("z" in point) {
                        feature.attributes.altitude = point.z;
                    }
                    if (this.internalProjection && this.externalProjection) {
                        feature.geometry.transform(
                            this.externalProjection, this.internalProjection
                        ); 
                    }
                    if (this.trackAttributes) {
                        for (var j=0, jj=this.trackAttributes.length; j<jj; ++j) {
                            var name = this.trackAttributes[j];
                            feature.attributes[name] = obj.attributes[name][i];
                        }
                    }
                    feature.attributes.when = obj.whens[i];
                    feature.attributes.trackId = container.feature.id;
                    if (hasAngles) {
                        angles = obj.angles[i];
                        feature.attributes.heading = parseFloat(angles[0]);
                        feature.attributes.tilt = parseFloat(angles[1]);
                        feature.attributes.roll = parseFloat(angles[2]);
                    }
                    container.features.push(feature);
                }
            },
            "coord": function(node, container) {
                var str = this.getChildValue(node);
                var coords = str.replace(this.regExes.trimSpace, "").split(/\s+/);
                var point = new OpenLayers.Geometry.Point(coords[0], coords[1]);
                if (coords.length > 2) {
                    point.z = parseFloat(coords[2]);
                }
                container.points.push(point);
            },
            "angles": function(node, container) {
                var str = this.getChildValue(node);
                var parts = str.replace(this.regExes.trimSpace, "").split(/\s+/);
                container.angles.push(parts);
            }
        }
    },
    
        parseFeature: function(node) {
        var order = ["MultiGeometry", "Polygon", "LineString", "Point"];
        var type, nodeList, geometry, parser;
        for(var i=0, len=order.length; i<len; ++i) {
            type = order[i];
            this.internalns = node.namespaceURI ? 
                    node.namespaceURI : this.kmlns;
            nodeList = this.getElementsByTagNameNS(node, 
                                                   this.internalns, type);
            if(nodeList.length > 0) {
                var parser = this.parseGeometry[type.toLowerCase()];
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
        var attributes;
        if(this.extractAttributes) {
            attributes = this.parseAttributes(node);
        }
        var feature = new OpenLayers.Feature.Vector(geometry, attributes);

        var fid = node.getAttribute("id") || node.getAttribute("name");
        if(fid != null) {
            feature.fid = fid;
        }

        return feature;
    },        
    
        getStyle: function(styleUrl, options) {

        var styleBaseUrl = OpenLayers.Util.removeTail(styleUrl);

        var newOptions = OpenLayers.Util.extend({}, options);
        newOptions.depth++;
        newOptions.styleBaseUrl = styleBaseUrl;
        if (!this.styles[styleUrl] 
                && !OpenLayers.String.startsWith(styleUrl, "#") 
                && newOptions.depth <= this.maxDepth
                && !this.fetched[styleBaseUrl] ) {

            var data = this.fetchLink(styleBaseUrl);
            if (data) {
                this.parseData(data, newOptions);
            }

        }
        var style = OpenLayers.Util.extend({}, this.styles[styleUrl]);
        return style;
    },
    
        parseGeometry: {
        
                point: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.internalns,
                                                       "coordinates");
            var coords = [];
            if(nodeList.length > 0) {
                var coordString = nodeList[0].firstChild.nodeValue;
                coordString = coordString.replace(this.regExes.removeSpace, "");
                coords = coordString.split(",");
            }

            var point = null;
            if(coords.length > 1) {
                if(coords.length == 2) {
                    coords[2] = null;
                }
                point = new OpenLayers.Geometry.Point(coords[0], coords[1],
                                                      coords[2]);
            } else {
                throw "Bad coordinate string: " + coordString;
            }
            return point;
        },
        
                linestring: function(node, ring) {
            var nodeList = this.getElementsByTagNameNS(node, this.internalns,
                                                       "coordinates");
            var line = null;
            if(nodeList.length > 0) {
                var coordString = this.getChildValue(nodeList[0]);

                coordString = coordString.replace(this.regExes.trimSpace,
                                                  "");
                coordString = coordString.replace(this.regExes.trimComma,
                                                  ",");
                var pointList = coordString.split(this.regExes.splitSpace);
                var numPoints = pointList.length;
                var points = new Array(numPoints);
                var coords, numCoords;
                for(var i=0; i<numPoints; ++i) {
                    coords = pointList[i].split(",");
                    numCoords = coords.length;
                    if(numCoords > 1) {
                        if(coords.length == 2) {
                            coords[2] = null;
                        }
                        points[i] = new OpenLayers.Geometry.Point(coords[0],
                                                                  coords[1],
                                                                  coords[2]);
                    } else {
                        throw "Bad LineString point coordinates: " +
                              pointList[i];
                    }
                }
                if(numPoints) {
                    if(ring) {
                        line = new OpenLayers.Geometry.LinearRing(points);
                    } else {
                        line = new OpenLayers.Geometry.LineString(points);
                    }
                } else {
                    throw "Bad LineString coordinates: " + coordString;
                }
            }

            return line;
        },
        
                polygon: function(node) {
            var nodeList = this.getElementsByTagNameNS(node, this.internalns,
                                                       "LinearRing");
            var numRings = nodeList.length;
            var components = new Array(numRings);
            if(numRings > 0) {
                var ring;
                for(var i=0, len=nodeList.length; i<len; ++i) {
                    ring = this.parseGeometry.linestring.apply(this,
                                                        [nodeList[i], true]);
                    if(ring) {
                        components[i] = ring;
                    } else {
                        throw "Bad LinearRing geometry: " + i;
                    }
                }
            }
            return new OpenLayers.Geometry.Polygon(components);
        },
        
                multigeometry: function(node) {
            var child, parser;
            var parts = [];
            var children = node.childNodes;
            for(var i=0, len=children.length; i<len; ++i ) {
                child = children[i];
                if(child.nodeType == 1) {
                    var type = (child.prefix) ?
                            child.nodeName.split(":")[1] :
                            child.nodeName;
                    var parser = this.parseGeometry[type.toLowerCase()];
                    if(parser) {
                        parts.push(parser.apply(this, [child]));
                    }
                }
            }
            return new OpenLayers.Geometry.Collection(parts);
        }
        
    },

        parseAttributes: function(node) {
        var attributes = {};
        var edNodes = node.getElementsByTagName("ExtendedData");
        if (edNodes.length) {
            attributes = this.parseExtendedData(edNodes[0]);
        }
        var child, grandchildren, grandchild;
        var children = node.childNodes;

        for(var i=0, len=children.length; i<len; ++i) {
            child = children[i];
            if(child.nodeType == 1) {
                grandchildren = child.childNodes;
                if(grandchildren.length >= 1 && grandchildren.length <= 3) {
                    var grandchild;
                    switch (grandchildren.length) {
                        case 1:
                            grandchild = grandchildren[0];
                            break;
                        case 2:
                            var c1 = grandchildren[0];
                            var c2 = grandchildren[1];
                            grandchild = (c1.nodeType == 3 || c1.nodeType == 4) ?
                                c1 : c2;
                            break;
                        case 3:
                        default:
                            grandchild = grandchildren[1];
                            break;
                    }
                    if(grandchild.nodeType == 3 || grandchild.nodeType == 4) {
                        var name = (child.prefix) ?
                                child.nodeName.split(":")[1] :
                                child.nodeName;
                        var value = OpenLayers.Util.getXmlNodeValue(grandchild);
                        if (value) {
                            value = value.replace(this.regExes.trimSpace, "");
                            attributes[name] = value;
                        }
                    }
                } 
            }
        }
        return attributes;
    },

        parseExtendedData: function(node) {
        var attributes = {};
        var i, len, data, key;
        var dataNodes = node.getElementsByTagName("Data");
        for (i = 0, len = dataNodes.length; i < len; i++) {
            data = dataNodes[i];
            key = data.getAttribute("name");
            var ed = {};
            var valueNode = data.getElementsByTagName("value");
            if (valueNode.length) {
                ed['value'] = this.getChildValue(valueNode[0]);
            }
            if (this.kvpAttributes) {
                attributes[key] = ed['value'];
            } else {
                var nameNode = data.getElementsByTagName("displayName");
                if (nameNode.length) {
                    ed['displayName'] = this.getChildValue(nameNode[0]);
                }
                attributes[key] = ed;
            } 
        }
        var simpleDataNodes = node.getElementsByTagName("SimpleData");
        for (i = 0, len = simpleDataNodes.length; i < len; i++) {
            var ed = {};
            data = simpleDataNodes[i];
            key = data.getAttribute("name");
            ed['value'] = this.getChildValue(data);
            if (this.kvpAttributes) {
                attributes[key] = ed['value'];
            } else {
                ed['displayName'] = key;
                attributes[key] = ed;
            }
        }
        
        return attributes;    
    },
    
        write: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        var kml = this.createElementNS(this.kmlns, "kml");
        var folder = this.createFolderXML();
        for(var i=0, len=features.length; i<len; ++i) {
            folder.appendChild(this.createPlacemarkXML(features[i]));
        }
        kml.appendChild(folder);
        return OpenLayers.Format.XML.prototype.write.apply(this, [kml]);
    },

        createFolderXML: function() {
        var folder = this.createElementNS(this.kmlns, "Folder");
        if (this.foldersName) {
            var folderName = this.createElementNS(this.kmlns, "name");
            var folderNameText = this.createTextNode(this.foldersName); 
            folderName.appendChild(folderNameText);
            folder.appendChild(folderName);
        }
        if (this.foldersDesc) {
            var folderDesc = this.createElementNS(this.kmlns, "description");        
            var folderDescText = this.createTextNode(this.foldersDesc); 
            folderDesc.appendChild(folderDescText);
            folder.appendChild(folderDesc);
        }

        return folder;
    },

        createPlacemarkXML: function(feature) {        
        var placemarkName = this.createElementNS(this.kmlns, "name");
        var label = (feature.style && feature.style.label) ? feature.style.label : feature.id;
        var name = feature.attributes.name || label;
        placemarkName.appendChild(this.createTextNode(name));
        var placemarkDesc = this.createElementNS(this.kmlns, "description");
        var desc = feature.attributes.description || this.placemarksDesc;
        placemarkDesc.appendChild(this.createTextNode(desc));
        var placemarkNode = this.createElementNS(this.kmlns, "Placemark");
        if(feature.fid != null) {
            placemarkNode.setAttribute("id", feature.fid);
        }
        placemarkNode.appendChild(placemarkName);
        placemarkNode.appendChild(placemarkDesc);
        if (feature.attributes) {
            var edNode = this.buildExtendedData(feature.attributes);
            if (edNode) {
                placemarkNode.appendChild(edNode);
            }
        }
        var geometryNode = this.buildGeometryNode(feature.geometry);
        placemarkNode.appendChild(geometryNode);        
        
        return placemarkNode;
    },    

        buildGeometryNode: function(geometry) {
        var className = geometry.CLASS_NAME;
        var type = className.substring(className.lastIndexOf(".") + 1);
        var builder = this.buildGeometry[type.toLowerCase()];
        var node = null;
        if(builder) {
            node = builder.apply(this, [geometry]);
        }
        return node;
    },

        buildGeometry: {

                point: function(geometry) {
            var kml = this.createElementNS(this.kmlns, "Point");
            kml.appendChild(this.buildCoordinatesNode(geometry));
            return kml;
        },
        
                multipoint: function(geometry) {
            return this.buildGeometry.collection.apply(this, [geometry]);
        },

                linestring: function(geometry) {
            var kml = this.createElementNS(this.kmlns, "LineString");
            kml.appendChild(this.buildCoordinatesNode(geometry));
            return kml;
        },
        
                multilinestring: function(geometry) {
            return this.buildGeometry.collection.apply(this, [geometry]);
        },

                linearring: function(geometry) {
            var kml = this.createElementNS(this.kmlns, "LinearRing");
            kml.appendChild(this.buildCoordinatesNode(geometry));
            return kml;
        },
        
                polygon: function(geometry) {
            var kml = this.createElementNS(this.kmlns, "Polygon");
            var rings = geometry.components;
            var ringMember, ringGeom, type;
            for(var i=0, len=rings.length; i<len; ++i) {
                type = (i==0) ? "outerBoundaryIs" : "innerBoundaryIs";
                ringMember = this.createElementNS(this.kmlns, type);
                ringGeom = this.buildGeometry.linearring.apply(this,
                                                               [rings[i]]);
                ringMember.appendChild(ringGeom);
                kml.appendChild(ringMember);
            }
            return kml;
        },
        
                multipolygon: function(geometry) {
            return this.buildGeometry.collection.apply(this, [geometry]);
        },

                collection: function(geometry) {
            var kml = this.createElementNS(this.kmlns, "MultiGeometry");
            var child;
            for(var i=0, len=geometry.components.length; i<len; ++i) {
                child = this.buildGeometryNode.apply(this,
                                                     [geometry.components[i]]);
                if(child) {
                    kml.appendChild(child);
                }
            }
            return kml;
        }
    },

        buildCoordinates: function(point) {
        if (this.internalProjection && this.externalProjection) {
            point = point.clone();
            point.transform(this.internalProjection, 
                               this.externalProjection);
        }
        return point.x + "," + point.y;                     
    },

        buildExtendedData: function(attributes) {
        var extendedData = this.createElementNS(this.kmlns, "ExtendedData");
        for (var attributeName in attributes) {
            if (attributes[attributeName] && attributeName != "name" && attributeName != "description" && attributeName != "styleUrl") {
                var data = this.createElementNS(this.kmlns, "Data");
                data.setAttribute("name", attributeName);
                var value = this.createElementNS(this.kmlns, "value");
                if (typeof attributes[attributeName] == "object") {
                    if (attributes[attributeName].value) {
                        value.appendChild(this.createTextNode(attributes[attributeName].value));
                    }
                    if (attributes[attributeName].displayName) {
                        var displayName = this.createElementNS(this.kmlns, "displayName");
                        displayName.appendChild(this.getXMLDoc().createCDATASection(attributes[attributeName].displayName));
                        data.appendChild(displayName);
                    }
                } else {
                    value.appendChild(this.createTextNode(attributes[attributeName]));
                }
                data.appendChild(value);
                extendedData.appendChild(data);
            }
        }
        if (this.isSimpleContent(extendedData)) {
            return null;
        } else {
            return extendedData;
        }
    },
    
    CLASS_NAME: "OpenLayers.Format.KML" 
});
