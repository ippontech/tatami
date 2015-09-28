/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.GeoJSON = OpenLayers.Class(OpenLayers.Format.JSON, {

    
        read: function(json, type, filter) {
        type = (type) ? type : "FeatureCollection";
        var results = null;
        var obj = null;
        if (typeof json == "string") {
            obj = OpenLayers.Format.JSON.prototype.read.apply(this,
                                                              [json, filter]);
        } else { 
            obj = json;
        }    
        if(!obj) {
            OpenLayers.Console.error("Bad JSON: " + json);
        } else if(typeof(obj.type) != "string") {
            OpenLayers.Console.error("Bad GeoJSON - no type: " + json);
        } else if(this.isValidType(obj, type)) {
            switch(type) {
                case "Geometry":
                    try {
                        results = this.parseGeometry(obj);
                    } catch(err) {
                        OpenLayers.Console.error(err);
                    }
                    break;
                case "Feature":
                    try {
                        results = this.parseFeature(obj);
                        results.type = "Feature";
                    } catch(err) {
                        OpenLayers.Console.error(err);
                    }
                    break;
                case "FeatureCollection":
                    results = [];
                    switch(obj.type) {
                        case "Feature":
                            try {
                                results.push(this.parseFeature(obj));
                            } catch(err) {
                                results = null;
                                OpenLayers.Console.error(err);
                            }
                            break;
                        case "FeatureCollection":
                            for(var i=0, len=obj.features.length; i<len; ++i) {
                                try {
                                    results.push(this.parseFeature(obj.features[i]));
                                } catch(err) {
                                    results = null;
                                    OpenLayers.Console.error(err);
                                }
                            }
                            break;
                        default:
                            try {
                                var geom = this.parseGeometry(obj);
                                results.push(new OpenLayers.Feature.Vector(geom));
                            } catch(err) {
                                results = null;
                                OpenLayers.Console.error(err);
                            }
                    }
                break;
            }
        }
        return results;
    },
    
        isValidType: function(obj, type) {
        var valid = false;
        switch(type) {
            case "Geometry":
                if(OpenLayers.Util.indexOf(
                    ["Point", "MultiPoint", "LineString", "MultiLineString",
                     "Polygon", "MultiPolygon", "Box", "GeometryCollection"],
                    obj.type) == -1) {
                    OpenLayers.Console.error("Unsupported geometry type: " +
                                              obj.type);
                } else {
                    valid = true;
                }
                break;
            case "FeatureCollection":
                valid = true;
                break;
            default:
                if(obj.type == type) {
                    valid = true;
                } else {
                    OpenLayers.Console.error("Cannot convert types from " +
                                              obj.type + " to " + type);
                }
        }
        return valid;
    },
    
        parseFeature: function(obj) {
        var feature, geometry, attributes, bbox;
        attributes = (obj.properties) ? obj.properties : {};
        bbox = (obj.geometry && obj.geometry.bbox) || obj.bbox;
        try {
            geometry = this.parseGeometry(obj.geometry);
        } catch(err) {
            throw err;
        }
        feature = new OpenLayers.Feature.Vector(geometry, attributes);
        if(bbox) {
            feature.bounds = OpenLayers.Bounds.fromArray(bbox);
        }
        if(obj.id) {
            feature.fid = obj.id;
        }
        return feature;
    },
    
        parseGeometry: function(obj) {
        if (obj == null) {
            return null;
        }
        var geometry, collection = false;
        if(obj.type == "GeometryCollection") {
            if(!(OpenLayers.Util.isArray(obj.geometries))) {
                throw "GeometryCollection must have geometries array: " + obj;
            }
            var numGeom = obj.geometries.length;
            var components = new Array(numGeom);
            for(var i=0; i<numGeom; ++i) {
                components[i] = this.parseGeometry.apply(
                    this, [obj.geometries[i]]
                );
            }
            geometry = new OpenLayers.Geometry.Collection(components);
            collection = true;
        } else {
            if(!(OpenLayers.Util.isArray(obj.coordinates))) {
                throw "Geometry must have coordinates array: " + obj;
            }
            if(!this.parseCoords[obj.type.toLowerCase()]) {
                throw "Unsupported geometry type: " + obj.type;
            }
            try {
                geometry = this.parseCoords[obj.type.toLowerCase()].apply(
                    this, [obj.coordinates]
                );
            } catch(err) {
                throw err;
            }
        }
        if (this.internalProjection && this.externalProjection && !collection) {
            geometry.transform(this.externalProjection, 
                               this.internalProjection); 
        }                       
        return geometry;
    },
    
        parseCoords: {
                "point": function(array) {
            if (this.ignoreExtraDims == false && 
                  array.length != 2) {
                    throw "Only 2D points are supported: " + array;
            }
            return new OpenLayers.Geometry.Point(array[0], array[1]);
        },
        
                "multipoint": function(array) {
            var points = [];
            var p = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    p = this.parseCoords["point"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                points.push(p);
            }
            return new OpenLayers.Geometry.MultiPoint(points);
        },

                "linestring": function(array) {
            var points = [];
            var p = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    p = this.parseCoords["point"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                points.push(p);
            }
            return new OpenLayers.Geometry.LineString(points);
        },
        
                "multilinestring": function(array) {
            var lines = [];
            var l = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    l = this.parseCoords["linestring"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                lines.push(l);
            }
            return new OpenLayers.Geometry.MultiLineString(lines);
        },
        
                "polygon": function(array) {
            var rings = [];
            var r, l;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    l = this.parseCoords["linestring"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                r = new OpenLayers.Geometry.LinearRing(l.components);
                rings.push(r);
            }
            return new OpenLayers.Geometry.Polygon(rings);
        },

                "multipolygon": function(array) {
            var polys = [];
            var p = null;
            for(var i=0, len=array.length; i<len; ++i) {
                try {
                    p = this.parseCoords["polygon"].apply(this, [array[i]]);
                } catch(err) {
                    throw err;
                }
                polys.push(p);
            }
            return new OpenLayers.Geometry.MultiPolygon(polys);
        },

                "box": function(array) {
            if(array.length != 2) {
                throw "GeoJSON box coordinates must have 2 elements";
            }
            return new OpenLayers.Geometry.Polygon([
                new OpenLayers.Geometry.LinearRing([
                    new OpenLayers.Geometry.Point(array[0][0], array[0][1]),
                    new OpenLayers.Geometry.Point(array[1][0], array[0][1]),
                    new OpenLayers.Geometry.Point(array[1][0], array[1][1]),
                    new OpenLayers.Geometry.Point(array[0][0], array[1][1]),
                    new OpenLayers.Geometry.Point(array[0][0], array[0][1])
                ])
            ]);
        }

    },

        write: function(obj, pretty) {
        var geojson = {
            "type": null
        };
        if(OpenLayers.Util.isArray(obj)) {
            geojson.type = "FeatureCollection";
            var numFeatures = obj.length;
            geojson.features = new Array(numFeatures);
            for(var i=0; i<numFeatures; ++i) {
                var element = obj[i];
                if(!element instanceof OpenLayers.Feature.Vector) {
                    var msg = "FeatureCollection only supports collections " +
                              "of features: " + element;
                    throw msg;
                }
                geojson.features[i] = this.extract.feature.apply(
                    this, [element]
                );
            }
        } else if (obj.CLASS_NAME.indexOf("OpenLayers.Geometry") == 0) {
            geojson = this.extract.geometry.apply(this, [obj]);
        } else if (obj instanceof OpenLayers.Feature.Vector) {
            geojson = this.extract.feature.apply(this, [obj]);
            if(obj.layer && obj.layer.projection) {
                geojson.crs = this.createCRSObject(obj);
            }
        }
        return OpenLayers.Format.JSON.prototype.write.apply(this,
                                                            [geojson, pretty]);
    },

        createCRSObject: function(object) {
       var proj = object.layer.projection.toString();
       var crs = {};
       if (proj.match(/epsg:/i)) {
           var code = parseInt(proj.substring(proj.indexOf(":") + 1));
           if (code == 4326) {
               crs = {
                   "type": "name",
                   "properties": {
                       "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                   }
               };
           } else {    
               crs = {
                   "type": "name",
                   "properties": {
                       "name": "EPSG:" + code
                   }
               };
           }    
       }
       return crs;
    },
    
        extract: {
                'feature': function(feature) {
            var geom = this.extract.geometry.apply(this, [feature.geometry]);
            var json = {
                "type": "Feature",
                "properties": feature.attributes,
                "geometry": geom
            };
            if (feature.fid != null) {
                json.id = feature.fid;
            }
            return json;
        },
        
                'geometry': function(geometry) {
            if (geometry == null) {
                return null;
            }
            if (this.internalProjection && this.externalProjection) {
                geometry = geometry.clone();
                geometry.transform(this.internalProjection, 
                                   this.externalProjection);
            }                       
            var geometryType = geometry.CLASS_NAME.split('.')[2];
            var data = this.extract[geometryType.toLowerCase()].apply(this, [geometry]);
            var json;
            if(geometryType == "Collection") {
                json = {
                    "type": "GeometryCollection",
                    "geometries": data
                };
            } else {
                json = {
                    "type": geometryType,
                    "coordinates": data
                };
            }
            
            return json;
        },

                'point': function(point) {
            return [point.x, point.y];
        },

                'multipoint': function(multipoint) {
            var array = [];
            for(var i=0, len=multipoint.components.length; i<len; ++i) {
                array.push(this.extract.point.apply(this, [multipoint.components[i]]));
            }
            return array;
        },
        
                'linestring': function(linestring) {
            var array = [];
            for(var i=0, len=linestring.components.length; i<len; ++i) {
                array.push(this.extract.point.apply(this, [linestring.components[i]]));
            }
            return array;
        },

                'multilinestring': function(multilinestring) {
            var array = [];
            for(var i=0, len=multilinestring.components.length; i<len; ++i) {
                array.push(this.extract.linestring.apply(this, [multilinestring.components[i]]));
            }
            return array;
        },
        
                'polygon': function(polygon) {
            var array = [];
            for(var i=0, len=polygon.components.length; i<len; ++i) {
                array.push(this.extract.linestring.apply(this, [polygon.components[i]]));
            }
            return array;
        },

                'multipolygon': function(multipolygon) {
            var array = [];
            for(var i=0, len=multipolygon.components.length; i<len; ++i) {
                array.push(this.extract.polygon.apply(this, [multipolygon.components[i]]));
            }
            return array;
        },
        
                'collection': function(collection) {
            var len = collection.components.length;
            var array = new Array(len);
            for(var i=0; i<len; ++i) {
                array[i] = this.extract.geometry.apply(
                    this, [collection.components[i]]
                );
            }
            return array;
        }
        

    },

    CLASS_NAME: "OpenLayers.Format.GeoJSON" 

});     
