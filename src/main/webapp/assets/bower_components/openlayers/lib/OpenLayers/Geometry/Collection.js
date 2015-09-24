/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Geometry.Collection = OpenLayers.Class(OpenLayers.Geometry, {

        components: null,
    
        componentTypes: null,

        initialize: function (components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },

        destroy: function () {
        this.components.length = 0;
        this.components = null;
        OpenLayers.Geometry.prototype.destroy.apply(this, arguments);
    },

        clone: function() {
        var Constructor = OpenLayers.Util.getConstructor(this.CLASS_NAME);
        var geometry = new Constructor();
        for(var i=0, len=this.components.length; i<len; i++) {
            geometry.addComponent(this.components[i].clone());
        }
        OpenLayers.Util.applyDefaults(geometry, this);
        
        return geometry;
    },

        getComponentsString: function(){
        var strings = [];
        for(var i=0, len=this.components.length; i<len; i++) {
            strings.push(this.components[i].toShortString()); 
        }
        return strings.join(",");
    },

        calculateBounds: function() {
        this.bounds = null;
        var bounds = new OpenLayers.Bounds();
        var components = this.components;
        if (components) {
            for (var i=0, len=components.length; i<len; i++) {
                bounds.extend(components[i].getBounds());
            }
        }
        if (bounds.left != null && bounds.bottom != null && 
            bounds.right != null && bounds.top != null) {
            this.setBounds(bounds);
        }
    },

        addComponents: function(components){
        if(!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for(var i=0, len=components.length; i<len; i++) {
            this.addComponent(components[i]);
        }
    },

        removeComponents: function(components) {
        var removed = false;

        if(!(OpenLayers.Util.isArray(components))) {
            components = [components];
        }
        for(var i=components.length-1; i>=0; --i) {
            removed = this.removeComponent(components[i]) || removed;
        }
        return removed;
    },
    
        removeComponent: function(component) {
        
        OpenLayers.Util.removeItem(this.components, component);
        this.clearBounds();
        return true;
    },

        getLength: function() {
        var length = 0.0;
        for (var i=0, len=this.components.length; i<len; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },
    
        getArea: function() {
        var area = 0.0;
        for (var i=0, len=this.components.length; i<len; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },

        getGeodesicArea: function(projection) {
        var area = 0.0;
        for(var i=0, len=this.components.length; i<len; i++) {
            area += this.components[i].getGeodesicArea(projection);
        }
        return area;
    },
    
        getCentroid: function(weighted) {
        if (!weighted) {
            return this.components.length && this.components[0].getCentroid();
        }
        var len = this.components.length;
        if (!len) {
            return false;
        }
        
        var areas = [];
        var centroids = [];
        var areaSum = 0;
        var minArea = Number.MAX_VALUE;
        var component;
        for (var i=0; i<len; ++i) {
            component = this.components[i];
            var area = component.getArea();
            var centroid = component.getCentroid(true);
            if (isNaN(area) || isNaN(centroid.x) || isNaN(centroid.y)) {
                continue;
            }
            areas.push(area);
            areaSum += area;
            minArea = (area < minArea && area > 0) ? area : minArea;
            centroids.push(centroid);
        }
        len = areas.length;
        if (areaSum === 0) {
            for (var i=0; i<len; ++i) {
                areas[i] = 1;
            }
            areaSum = areas.length;
        } else {
            for (var i=0; i<len; ++i) {
                areas[i] /= minArea;
            }
            areaSum /= minArea;
        }
        
        var xSum = 0, ySum = 0, centroid, area;
        for (var i=0; i<len; ++i) {
            centroid = centroids[i];
            area = areas[i];
            xSum += centroid.x * area;
            ySum += centroid.y * area;
        }
        
        return new OpenLayers.Geometry.Point(xSum/areaSum, ySum/areaSum);
    },

        getGeodesicLength: function(projection) {
        var length = 0.0;
        for(var i=0, len=this.components.length; i<len; i++) {
            length += this.components[i].getGeodesicLength(projection);
        }
        return length;
    },

        move: function(x, y) {
        for(var i=0, len=this.components.length; i<len; i++) {
            this.components[i].move(x, y);
        }
    },

        rotate: function(angle, origin) {
        for(var i=0, len=this.components.length; i<len; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },

        resize: function(scale, origin, ratio) {
        for(var i=0; i<this.components.length; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },

        distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best, distance;
        var min = Number.POSITIVE_INFINITY;
        for(var i=0, len=this.components.length; i<len; ++i) {
            result = this.components[i].distanceTo(geometry, options);
            distance = details ? result.distance : result;
            if(distance < min) {
                min = distance;
                best = result;
                if(min == 0) {
                    break;
                }
            }
        }
        return best;
    },

        equals: function(geometry) {
        var equivalent = true;
        if(!geometry || !geometry.CLASS_NAME ||
           (this.CLASS_NAME != geometry.CLASS_NAME)) {
            equivalent = false;
        } else if(!(OpenLayers.Util.isArray(geometry.components)) ||
                  (geometry.components.length != this.components.length)) {
            equivalent = false;
        } else {
            for(var i=0, len=this.components.length; i<len; ++i) {
                if(!this.components[i].equals(geometry.components[i])) {
                    equivalent = false;
                    break;
                }
            }
        }
        return equivalent;
    },

        transform: function(source, dest) {
        if (source && dest) {
            for (var i=0, len=this.components.length; i<len; i++) {  
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },

        intersects: function(geometry) {
        var intersect = false;
        for(var i=0, len=this.components.length; i<len; ++ i) {
            intersect = geometry.intersects(this.components[i]);
            if(intersect) {
                break;
            }
        }
        return intersect;
    },

        getVertices: function(nodes) {
        var vertices = [];
        for(var i=0, len=this.components.length; i<len; ++i) {
            Array.prototype.push.apply(
                vertices, this.components[i].getVertices(nodes)
            );
        }
        return vertices;
    },


    CLASS_NAME: "OpenLayers.Geometry.Collection"
});
