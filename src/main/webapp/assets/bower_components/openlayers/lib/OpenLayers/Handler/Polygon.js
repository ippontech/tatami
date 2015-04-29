/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Handler.Polygon = OpenLayers.Class(OpenLayers.Handler.Path, {
    
        holeModifier: null,
    
        drawingHole: false,
    
        polygon: null,

        
        createFeature: function(pixel) {
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel);
        var geometry = new OpenLayers.Geometry.Point(
            lonlat.lon, lonlat.lat
        );
        this.point = new OpenLayers.Feature.Vector(geometry);
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LinearRing([this.point.geometry])
        );
        this.polygon = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Polygon([this.line.geometry])
        );
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.polygon, this.point], {silent: true});
    },

        addPoint: function(pixel) {
        if(!this.drawingHole && this.holeModifier &&
           this.evt && this.evt[this.holeModifier]) {
            var geometry = this.point.geometry;
            var features = this.control.layer.features;
            var candidate, polygon;
            for (var i=features.length-1; i>=0; --i) {
                candidate = features[i].geometry;
                if ((candidate instanceof OpenLayers.Geometry.Polygon || 
                    candidate instanceof OpenLayers.Geometry.MultiPolygon) && 
                    candidate.intersects(geometry)) {
                    polygon = features[i];
                    this.control.layer.removeFeatures([polygon], {silent: true});
                    this.control.layer.events.registerPriority(
                        "sketchcomplete", this, this.finalizeInteriorRing
                    );
                    this.control.layer.events.registerPriority(
                        "sketchmodified", this, this.enforceTopology
                    );
                    polygon.geometry.addComponent(this.line.geometry);
                    this.polygon = polygon;
                    this.drawingHole = true;
                    break;
                }
            }
        }
        OpenLayers.Handler.Path.prototype.addPoint.apply(this, arguments);
    },

        getCurrentPointIndex: function() {
        return this.line.geometry.components.length - 2;
    },

        enforceTopology: function(event) {
        var point = event.vertex;
        var components = this.line.geometry.components;
        if (!this.polygon.geometry.intersects(point)) {
            var last = components[components.length-3];
            point.x = last.x;
            point.y = last.y;
        }
    },

        finishGeometry: function() {
        var index = this.line.geometry.components.length - 2;
        this.line.geometry.removeComponent(this.line.geometry.components[index]);
        this.removePoint();
        this.finalize();
    },

        finalizeInteriorRing: function() {
        var ring = this.line.geometry;
        var modified = (ring.getArea() !== 0);
        if (modified) {
            var rings = this.polygon.geometry.components;
            for (var i=rings.length-2; i>=0; --i) {
                if (ring.intersects(rings[i])) {
                    modified = false;
                    break;
                }
            }
            if (modified) {
                var target;
                outer: for (var i=rings.length-2; i>0; --i) {
                    var points = rings[i].components;
                    for (var j=0, jj=points.length; j<jj; ++j) {
                        if (ring.containsPoint(points[j])) {
                            modified = false;
                            break outer;
                        }
                    }
                }
            }
        }
        if (modified) {
            if (this.polygon.state !== OpenLayers.State.INSERT) {
                this.polygon.state = OpenLayers.State.UPDATE;
            }
        } else {
            this.polygon.geometry.removeComponent(ring);
        }
        this.restoreFeature();
        return false;
    },

        cancel: function() {
        if (this.drawingHole) {
            this.polygon.geometry.removeComponent(this.line.geometry);
            this.restoreFeature(true);
        }
        return OpenLayers.Handler.Path.prototype.cancel.apply(this, arguments);
    },
    
        restoreFeature: function(cancel) {
        this.control.layer.events.unregister(
            "sketchcomplete", this, this.finalizeInteriorRing
        );
        this.control.layer.events.unregister(
            "sketchmodified", this, this.enforceTopology
        );
        this.layer.removeFeatures([this.polygon], {silent: true});
        this.control.layer.addFeatures([this.polygon], {silent: true});
        this.drawingHole = false;
        if (!cancel) {
            this.control.layer.events.triggerEvent(
                "sketchcomplete", {feature : this.polygon}
            );
        }
    },

        destroyFeature: function(force) {
        OpenLayers.Handler.Path.prototype.destroyFeature.call(
            this, force);
        this.polygon = null;
    },

        drawFeature: function() {
        this.layer.drawFeature(this.polygon, this.style);
        this.layer.drawFeature(this.point, this.style);
    },
    
        getSketch: function() {
        return this.polygon;
    },

        getGeometry: function() {
        var geometry = this.polygon && this.polygon.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiPolygon([geometry]);
        }
        return geometry;
    },

    CLASS_NAME: "OpenLayers.Handler.Polygon"
});
