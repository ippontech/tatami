/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WKT = OpenLayers.Class(OpenLayers.Format, {
    
        initialize: function(options) {
        this.regExes = {
            'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
            'spaces': /\s+/,
            'parenComma': /\)\s*,\s*\(/,
            'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,  // can't use {2} here
            'trimParens': /^\s*\(?(.*?)\)?\s*$/
        };
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
    },

        read: function(wkt) {
        var features, type, str;
        wkt = wkt.replace(/[\n\r]/g, " ");
        var matches = this.regExes.typeStr.exec(wkt);
        if(matches) {
            type = matches[1].toLowerCase();
            str = matches[2];
            if(this.parse[type]) {
                features = this.parse[type].apply(this, [str]);
            }
            if (this.internalProjection && this.externalProjection) {
                if (features && 
                    features.CLASS_NAME == "OpenLayers.Feature.Vector") {
                    features.geometry.transform(this.externalProjection,
                                                this.internalProjection);
                } else if (features &&
                           type != "geometrycollection" &&
                           typeof features == "object") {
                    for (var i=0, len=features.length; i<len; i++) {
                        var component = features[i];
                        component.geometry.transform(this.externalProjection,
                                                     this.internalProjection);
                    }
                }
            }
        }    
        return features;
    },

        write: function(features) {
        var collection, geometry, isCollection;
        if (features.constructor == Array) {
            collection = features;
            isCollection = true;
        } else {
            collection = [features];
            isCollection = false;
        }
        var pieces = [];
        if (isCollection) {
            pieces.push('GEOMETRYCOLLECTION(');
        }
        for (var i=0, len=collection.length; i<len; ++i) {
            if (isCollection && i>0) {
                pieces.push(',');
            }
            geometry = collection[i].geometry;
            pieces.push(this.extractGeometry(geometry));
        }
        if (isCollection) {
            pieces.push(')');
        }
        return pieces.join('');
    },

        extractGeometry: function(geometry) {
        var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
        if (!this.extract[type]) {
            return null;
        }
        if (this.internalProjection && this.externalProjection) {
            geometry = geometry.clone();
            geometry.transform(this.internalProjection, this.externalProjection);
        }                       
        var wktType = type == 'collection' ? 'GEOMETRYCOLLECTION' : type.toUpperCase();
        var data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
        return data;
    },
    
        extract: {
                'point': function(point) {
            return point.x + ' ' + point.y;
        },

                'multipoint': function(multipoint) {
            var array = [];
            for(var i=0, len=multipoint.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.point.apply(this, [multipoint.components[i]]) +
                           ')');
            }
            return array.join(',');
        },
        
                'linestring': function(linestring) {
            var array = [];
            for(var i=0, len=linestring.components.length; i<len; ++i) {
                array.push(this.extract.point.apply(this, [linestring.components[i]]));
            }
            return array.join(',');
        },

                'multilinestring': function(multilinestring) {
            var array = [];
            for(var i=0, len=multilinestring.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.linestring.apply(this, [multilinestring.components[i]]) +
                           ')');
            }
            return array.join(',');
        },
        
                'polygon': function(polygon) {
            var array = [];
            for(var i=0, len=polygon.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.linestring.apply(this, [polygon.components[i]]) +
                           ')');
            }
            return array.join(',');
        },

                'multipolygon': function(multipolygon) {
            var array = [];
            for(var i=0, len=multipolygon.components.length; i<len; ++i) {
                array.push('(' +
                           this.extract.polygon.apply(this, [multipolygon.components[i]]) +
                           ')');
            }
            return array.join(',');
        },

                'collection': function(collection) {
            var array = [];
            for(var i=0, len=collection.components.length; i<len; ++i) {
                array.push(this.extractGeometry.apply(this, [collection.components[i]]));
            }
            return array.join(',');
        }

    },

        parse: {
                'point': function(str) {
            var coords = OpenLayers.String.trim(str).split(this.regExes.spaces);
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(coords[0], coords[1])
            );
        },

                'multipoint': function(str) {
            var point;
            var points = OpenLayers.String.trim(str).split(',');
            var components = [];
            for(var i=0, len=points.length; i<len; ++i) {
                point = points[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.point.apply(this, [point]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiPoint(components)
            );
        },
        
                'linestring': function(str) {
            var points = OpenLayers.String.trim(str).split(',');
            var components = [];
            for(var i=0, len=points.length; i<len; ++i) {
                components.push(this.parse.point.apply(this, [points[i]]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.LineString(components)
            );
        },

                'multilinestring': function(str) {
            var line;
            var lines = OpenLayers.String.trim(str).split(this.regExes.parenComma);
            var components = [];
            for(var i=0, len=lines.length; i<len; ++i) {
                line = lines[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.linestring.apply(this, [line]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiLineString(components)
            );
        },
        
                'polygon': function(str) {
            var ring, linestring, linearring;
            var rings = OpenLayers.String.trim(str).split(this.regExes.parenComma);
            var components = [];
            for(var i=0, len=rings.length; i<len; ++i) {
                ring = rings[i].replace(this.regExes.trimParens, '$1');
                linestring = this.parse.linestring.apply(this, [ring]).geometry;
                linearring = new OpenLayers.Geometry.LinearRing(linestring.components);
                components.push(linearring);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Polygon(components)
            );
        },

                'multipolygon': function(str) {
            var polygon;
            var polygons = OpenLayers.String.trim(str).split(this.regExes.doubleParenComma);
            var components = [];
            for(var i=0, len=polygons.length; i<len; ++i) {
                polygon = polygons[i].replace(this.regExes.trimParens, '$1');
                components.push(this.parse.polygon.apply(this, [polygon]).geometry);
            }
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.MultiPolygon(components)
            );
        },

                'geometrycollection': function(str) {
            str = str.replace(/,\s*([A-Za-z])/g, '|$1');
            var wktArray = OpenLayers.String.trim(str).split('|');
            var components = [];
            for(var i=0, len=wktArray.length; i<len; ++i) {
                components.push(OpenLayers.Format.WKT.prototype.read.apply(this,[wktArray[i]]));
            }
            return components;
        }

    },

    CLASS_NAME: "OpenLayers.Format.WKT" 
});     
