/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.GeoRSS = OpenLayers.Class(OpenLayers.Format.XML, {
    
        rssns: "http://backend.userland.com/rss2",
    
        featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
        georssns: "http://www.georss.org/georss",

        geons: "http://www.w3.org/2003/01/geo/wgs84_pos#",
    
        featureTitle: "Untitled",
    
        featureDescription: "No Description",
    
        gmlParser: null,

        
        createGeometryFromItem: function(item) {
        var point = this.getElementsByTagNameNS(item, this.georssns, "point");
        var lat = this.getElementsByTagNameNS(item, this.geons, 'lat');
        var lon = this.getElementsByTagNameNS(item, this.geons, 'long');
        
        var line = this.getElementsByTagNameNS(item,
                                                this.georssns,
                                                "line");
        var polygon = this.getElementsByTagNameNS(item,
                                                this.georssns,
                                                "polygon");
        var where = this.getElementsByTagNameNS(item, 
                                                this.georssns, 
                                                "where");
        var box = this.getElementsByTagNameNS(item, 
                                              this.georssns, 
                                              "box");

        if (point.length > 0 || (lat.length > 0 && lon.length > 0)) {
            var location;
            if (point.length > 0) {
                location = OpenLayers.String.trim(
                                point[0].firstChild.nodeValue).split(/\s+/);
                if (location.length !=2) {
                    location = OpenLayers.String.trim(
                                point[0].firstChild.nodeValue).split(/\s*,\s*/);
                }
            } else {
                location = [parseFloat(lat[0].firstChild.nodeValue),
                                parseFloat(lon[0].firstChild.nodeValue)];
            }    

            var geometry = new OpenLayers.Geometry.Point(location[1], location[0]);
              
        } else if (line.length > 0) {
            var coords = OpenLayers.String.trim(this.getChildValue(line[0])).split(/\s+/);
            var components = []; 
            var point;
            for (var i=0, len=coords.length; i<len; i+=2) {
                point = new OpenLayers.Geometry.Point(coords[i+1], coords[i]);
                components.push(point);
            }
            geometry = new OpenLayers.Geometry.LineString(components);
        } else if (polygon.length > 0) { 
            var coords = OpenLayers.String.trim(this.getChildValue(polygon[0])).split(/\s+/);
            var components = []; 
            var point;
            for (var i=0, len=coords.length; i<len; i+=2) {
                point = new OpenLayers.Geometry.Point(coords[i+1], coords[i]);
                components.push(point);
            }
            geometry = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(components)]);
        } else if (where.length > 0) { 
            if (!this.gmlParser) {
              this.gmlParser = new OpenLayers.Format.GML({'xy': this.xy});
            }
            var feature = this.gmlParser.parseFeature(where[0]);
            geometry = feature.geometry;
        } else if (box.length  > 0) {
            var coords = OpenLayers.String.trim(box[0].firstChild.nodeValue).split(/\s+/);
            var components = [];
            var point;
            if (coords.length > 3) {
                point = new OpenLayers.Geometry.Point(coords[1], coords[0]);
                components.push(point);
                point = new OpenLayers.Geometry.Point(coords[1], coords[2]);
                components.push(point);
                point = new OpenLayers.Geometry.Point(coords[3], coords[2]);
                components.push(point);
                point = new OpenLayers.Geometry.Point(coords[3], coords[0]);
                components.push(point);
                point = new OpenLayers.Geometry.Point(coords[1], coords[0]);
                components.push(point);
            }
            geometry = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(components)]);
        }
        
        if (geometry && this.internalProjection && this.externalProjection) {
            geometry.transform(this.externalProjection, 
                               this.internalProjection);
        }

        return geometry;
    },        

        createFeatureFromItem: function(item) {
        var geometry = this.createGeometryFromItem(item);
     
        /* Provide defaults for title and description */
        var title = this._getChildValue(item, "*", "title", this.featureTitle);
       
        /* First try RSS descriptions, then Atom summaries */
        var description = this._getChildValue(
            item, "*", "description",
            this._getChildValue(item, "*", "content",
                this._getChildValue(item, "*", "summary", this.featureDescription)));

        /* If no link URL is found in the first child node, try the
           href attribute */
        var link = this._getChildValue(item, "*", "link");
        if(!link) {
            try {
                link = this.getElementsByTagNameNS(item, "*", "link")[0].getAttribute("href");
            } catch(e) {
                link = null;
            }
        }

        var id = this._getChildValue(item, "*", "id", null);
        
        var data = {
            "title": title,
            "description": description,
            "link": link
        };
        var feature = new OpenLayers.Feature.Vector(geometry, data);
        feature.fid = id;
        return feature;
    },        
    
        _getChildValue: function(node, nsuri, name, def) {
        var value;
        var eles = this.getElementsByTagNameNS(node, nsuri, name);
        if(eles && eles[0] && eles[0].firstChild
            && eles[0].firstChild.nodeValue) {
            value = this.getChildValue(eles[0]);
        } else {
            value = (def == undefined) ? "" : def;
        }
        return value;
    },
    
        read: function(doc) {
        if (typeof doc == "string") { 
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }

        /* Try RSS items first, then Atom entries */
        var itemlist = null;
        itemlist = this.getElementsByTagNameNS(doc, '*', 'item');
        if (itemlist.length == 0) {
            itemlist = this.getElementsByTagNameNS(doc, '*', 'entry');
        }
        
        var numItems = itemlist.length;
        var features = new Array(numItems);
        for(var i=0; i<numItems; i++) {
            features[i] = this.createFeatureFromItem(itemlist[i]);
        }
        return features;
    },
    

        write: function(features) {
        var georss;
        if(OpenLayers.Util.isArray(features)) {
            georss = this.createElementNS(this.rssns, "rss");
            for(var i=0, len=features.length; i<len; i++) {
                georss.appendChild(this.createFeatureXML(features[i]));
            }
        } else {
            georss = this.createFeatureXML(features);
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [georss]);
    },

        createFeatureXML: function(feature) {
        var geometryNode = this.buildGeometryNode(feature.geometry);
        var featureNode = this.createElementNS(this.rssns, "item");
        var titleNode = this.createElementNS(this.rssns, "title");
        titleNode.appendChild(this.createTextNode(feature.attributes.title ? feature.attributes.title : ""));
        var descNode = this.createElementNS(this.rssns, "description");
        descNode.appendChild(this.createTextNode(feature.attributes.description ? feature.attributes.description : ""));
        featureNode.appendChild(titleNode);
        featureNode.appendChild(descNode);
        if (feature.attributes.link) {
            var linkNode = this.createElementNS(this.rssns, "link");
            linkNode.appendChild(this.createTextNode(feature.attributes.link));
            featureNode.appendChild(linkNode);
        }    
        for(var attr in feature.attributes) {
            if (attr == "link" || attr == "title" || attr == "description") { continue; } 
            var attrText = this.createTextNode(feature.attributes[attr]); 
            var nodename = attr;
            if (attr.search(":") != -1) {
                nodename = attr.split(":")[1];
            }    
            var attrContainer = this.createElementNS(this.featureNS, "feature:"+nodename);
            attrContainer.appendChild(attrText);
            featureNode.appendChild(attrContainer);
        }    
        featureNode.appendChild(geometryNode);
        return featureNode;
    },    
    
        buildGeometryNode: function(geometry) {
        if (this.internalProjection && this.externalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, 
                               this.externalProjection);
        }
        var node;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
            node = this.createElementNS(this.georssns, 'georss:polygon');
            
            node.appendChild(this.buildCoordinatesNode(geometry.components[0]));
        }
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            node = this.createElementNS(this.georssns, 'georss:line');
            
            node.appendChild(this.buildCoordinatesNode(geometry));
        }
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            node = this.createElementNS(this.georssns, 'georss:point');
            node.appendChild(this.buildCoordinatesNode(geometry));
        } else {
            throw "Couldn't parse " + geometry.CLASS_NAME;
        }  
        return node;         
    },
    
        buildCoordinatesNode: function(geometry) {
        var points = null;
        
        if (geometry.components) {
            points = geometry.components;
        }

        var path;
        if (points) {
            var numPoints = points.length;
            var parts = new Array(numPoints);
            for (var i = 0; i < numPoints; i++) {
                parts[i] = points[i].y + " " + points[i].x;
            }
            path = parts.join(" ");
        } else {
            path = geometry.y + " " + geometry.x;
        }
        return this.createTextNode(path);
    },

    CLASS_NAME: "OpenLayers.Format.GeoRSS" 
});     
