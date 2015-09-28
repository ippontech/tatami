/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.GPX = OpenLayers.Class(OpenLayers.Format.XML, {
    

        defaultDesc: "No description available",

       extractWaypoints: true,
    
       extractTracks: true,
    
       extractRoutes: true,
    
        extractAttributes: true,

        namespaces: {
        gpx: "http://www.topografix.com/GPX/1/1",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

        schemaLocation: "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",

        creator: "OpenLayers",
    
        initialize: function(options) {
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");

        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    
        read: function(doc) {
        if (typeof doc == "string") { 
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }
        var features = [];
        
        if(this.extractTracks) {
            var tracks = doc.getElementsByTagName("trk");
            for (var i=0, len=tracks.length; i<len; i++) {
                var attrs = {};
                if(this.extractAttributes) {
                    attrs = this.parseAttributes(tracks[i]);
                }
                
                var segs = this.getElementsByTagNameNS(tracks[i], tracks[i].namespaceURI, "trkseg");
                for (var j = 0, seglen = segs.length; j < seglen; j++) {
                    var track = this.extractSegment(segs[j], "trkpt");
                    features.push(new OpenLayers.Feature.Vector(track, attrs));
                }
            }
        }
        
        if(this.extractRoutes) {
            var routes = doc.getElementsByTagName("rte");
            for (var k=0, klen=routes.length; k<klen; k++) {
                var attrs = {};
                if(this.extractAttributes) {
                    attrs = this.parseAttributes(routes[k]);
                }
                var route = this.extractSegment(routes[k], "rtept");
                features.push(new OpenLayers.Feature.Vector(route, attrs));
            }
        }
        
        if(this.extractWaypoints) {
            var waypoints = doc.getElementsByTagName("wpt");
            for (var l = 0, len = waypoints.length; l < len; l++) {
                var attrs = {};
                if(this.extractAttributes) {
                    attrs = this.parseAttributes(waypoints[l]);
                }
                var wpt = new OpenLayers.Geometry.Point(waypoints[l].getAttribute("lon"), waypoints[l].getAttribute("lat"));
                features.push(new OpenLayers.Feature.Vector(wpt, attrs));
            }
        }
        
        if (this.internalProjection && this.externalProjection) {
            for (var g = 0, featLength = features.length; g < featLength; g++) {
                features[g].geometry.transform(this.externalProjection,
                                    this.internalProjection);
            }
        }
        
        return features;
    },
    
       extractSegment: function(segment, segmentType) {
        var points = this.getElementsByTagNameNS(segment, segment.namespaceURI, segmentType);
        var point_features = [];
        for (var i = 0, len = points.length; i < len; i++) {
            point_features.push(new OpenLayers.Geometry.Point(points[i].getAttribute("lon"), points[i].getAttribute("lat")));
        }
        return new OpenLayers.Geometry.LineString(point_features);
    },
    
        parseAttributes: function(node) {
        var attributes = {};
        var attrNode = node.firstChild, value, name;
        while(attrNode) {
            if(attrNode.nodeType == 1 && attrNode.firstChild) {
                value = attrNode.firstChild;
                if(value.nodeType == 3 || value.nodeType == 4) {
                    name = (attrNode.prefix) ?
                        attrNode.nodeName.split(":")[1] :
                        attrNode.nodeName;
                    if(name != "trkseg" && name != "rtept") {
                        attributes[name] = value.nodeValue;
                    }
                }
            }
            attrNode = attrNode.nextSibling;
        }
        return attributes;
    },

        write: function(features, metadata) {
        features = OpenLayers.Util.isArray(features) ?
            features : [features];
        var gpx = this.createElementNS(this.namespaces.gpx, "gpx");
        gpx.setAttribute("version", "1.1");
        gpx.setAttribute("creator", this.creator);
        this.setAttributes(gpx, {
            "xsi:schemaLocation": this.schemaLocation
        });

        if (metadata && typeof metadata == 'object') {
            gpx.appendChild(this.buildMetadataNode(metadata));
        }
        for(var i=0, len=features.length; i<len; i++) {
            gpx.appendChild(this.buildFeatureNode(features[i]));
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [gpx]);
    },

        buildMetadataNode: function(metadata) {
        var types = ['name', 'desc', 'author'],
            node = this.createElementNS(this.namespaces.gpx, 'metadata');
        for (var i=0; i < types.length; i++) {
            var type = types[i];
            if (metadata[type]) {
                var n = this.createElementNS(this.namespaces.gpx, type);
                n.appendChild(this.createTextNode(metadata[type]));
                node.appendChild(n);
            }
        }
        return node;
    },

        buildFeatureNode: function(feature) {
        var geometry = feature.geometry;
            geometry = geometry.clone();
        if (this.internalProjection && this.externalProjection) {
            geometry.transform(this.internalProjection, 
                               this.externalProjection);
        }
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            var wpt = this.buildWptNode(geometry);
            this.appendAttributesNode(wpt, feature);
            return wpt;
        } else {
            var trkNode = this.createElementNS(this.namespaces.gpx, "trk");
            this.appendAttributesNode(trkNode, feature);
            var trkSegNodes = this.buildTrkSegNode(geometry);
            trkSegNodes = OpenLayers.Util.isArray(trkSegNodes) ?
                trkSegNodes : [trkSegNodes];
            for (var i = 0, len = trkSegNodes.length; i < len; i++) {
                trkNode.appendChild(trkSegNodes[i]);
            }
            return trkNode;
        }
    },

        buildTrkSegNode: function(geometry) {
        var node,
            i,
            len,
            point,
            nodes;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString" ||
            geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            node = this.createElementNS(this.namespaces.gpx, "trkseg");
            for (i = 0, len=geometry.components.length; i < len; i++) {
                point = geometry.components[i];
                node.appendChild(this.buildTrkPtNode(point));
            }
            return node;
        } else {
            nodes = [];
            for (i = 0, len = geometry.components.length; i < len; i++) {
                nodes.push(this.buildTrkSegNode(geometry.components[i]));
            }
            return nodes;
        }
    },
    
        buildTrkPtNode: function(point) {
        var node = this.createElementNS(this.namespaces.gpx, "trkpt");
        node.setAttribute("lon", point.x);
        node.setAttribute("lat", point.y);
        return node;
    },

        buildWptNode: function(geometry) {
        var node = this.createElementNS(this.namespaces.gpx, "wpt");
        node.setAttribute("lon", geometry.x);
        node.setAttribute("lat", geometry.y);
        return node;
    },

        appendAttributesNode: function(node, feature) {
        var name = this.createElementNS(this.namespaces.gpx, 'name');
        name.appendChild(this.createTextNode(
            feature.attributes.name || feature.id));
        node.appendChild(name);
        var desc = this.createElementNS(this.namespaces.gpx, 'desc');
        desc.appendChild(this.createTextNode(
            feature.attributes.description || feature.attributes.desc || this.defaultDesc));
        node.appendChild(desc);
    },

    CLASS_NAME: "OpenLayers.Format.GPX"
});
