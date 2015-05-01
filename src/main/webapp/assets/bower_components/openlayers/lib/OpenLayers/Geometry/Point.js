/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry, {

        x: null,

        y: null,

        initialize: function(x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },

        clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }
        OpenLayers.Util.applyDefaults(obj, this);

        return obj;
    },

        calculateBounds: function () {
        this.bounds = new OpenLayers.Bounds(this.x, this.y,
                                            this.x, this.y);
    },

        distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if(geometry instanceof OpenLayers.Geometry.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ?
                distance : {x0: x0, y0: y0, x1: x1, y1: y1, distance: distance};
        } else {
            result = geometry.distanceTo(this, options);
            if(details) {
                result = {
                    x0: result.x1, y0: result.y1,
                    x1: result.x0, y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },
    
        equals: function(geom) {
        var equals = false;
        if (geom != null) {
            equals = ((this.x == geom.x && this.y == geom.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },
    
        toShortString: function() {
        return (this.x + ", " + this.y);
    },
    
        move: function(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.clearBounds();
    },

        rotate: function(angle, origin) {
        angle *= Math.PI / 180;
        var radius = this.distanceTo(origin);
        var theta = angle + Math.atan2(this.y - origin.y, this.x - origin.x);
        this.x = origin.x + (radius * Math.cos(theta));
        this.y = origin.y + (radius * Math.sin(theta));
        this.clearBounds();
    },
    
        getCentroid: function() {
        return new OpenLayers.Geometry.Point(this.x, this.y);
    },

        resize: function(scale, origin, ratio) {
        ratio = (ratio == undefined) ? 1 : ratio;
        this.x = origin.x + (scale * ratio * (this.x - origin.x));
        this.y = origin.y + (scale * (this.y - origin.y));
        this.clearBounds();
        return this;
    },
    
        intersects: function(geometry) {
        var intersect = false;
        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    
        transform: function(source, dest) {
        if ((source && dest)) {
            OpenLayers.Projection.transform(
                this, source, dest); 
            this.bounds = null;
        }       
        return this;
    },

        getVertices: function(nodes) {
        return [this];
    },

    CLASS_NAME: "OpenLayers.Geometry.Point"
});
