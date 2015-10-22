/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Handler.Point = OpenLayers.Class(OpenLayers.Handler, {
    
        point: null,

        layer: null,
    
        multi: false,
    
        citeCompliant: false,
    
        mouseDown: false,

        stoppedDown: null,

        lastDown: null,

        lastUp: null,

        persist: false,

        stopDown: false,

        stopUp: false,

        layerOptions: null,
    
        pixelTolerance: 5,

        lastTouchPx: null,

        initialize: function(control, callbacks, options) {
        if(!(options && options.layerOptions && options.layerOptions.styleMap)) {
            this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style['default'], {});
        }

        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
    },
    
        activate: function() {
        if(!OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            return false;
        }
        var options = OpenLayers.Util.extend({
            displayInLayerSwitcher: false,
            calculateInRange: OpenLayers.Function.True,
            wrapDateLine: this.citeCompliant
        }, this.layerOptions);
        this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
        this.map.addLayer(this.layer);
        return true;
    },
    
        createFeature: function(pixel) {
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel); 
        var geometry = new OpenLayers.Geometry.Point(
            lonlat.lon, lonlat.lat
        );
        this.point = new OpenLayers.Feature.Vector(geometry);
        this.callback("create", [this.point.geometry, this.point]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.point], {silent: true});
    },

        deactivate: function() {
        if(!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            return false;
        }
        this.cancel();
        if (this.layer.map != null) {
            this.destroyFeature(true);
            this.layer.destroy(false);
        }
        this.layer = null;
        return true;
    },
    
        destroyFeature: function(force) {
        if(this.layer && (force || !this.persist)) {
            this.layer.destroyFeatures();
        }
        this.point = null;
    },

        destroyPersistedFeature: function() {
        var layer = this.layer;
        if(layer && layer.features.length > 1) {
            this.layer.features[0].destroy();
        }
    },

        finalize: function(cancel) {
        var key = cancel ? "cancel" : "done";
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.lastTouchPx = null;
        this.callback(key, [this.geometryClone()]);
        this.destroyFeature(cancel);
    },

        cancel: function() {
        this.finalize(true);
    },

        click: function(evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },

        dblclick: function(evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },
    
        modifyFeature: function(pixel) {
        if(!this.point) {
            this.createFeature(pixel);
        }
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel); 
        this.point.geometry.x = lonlat.lon;
        this.point.geometry.y = lonlat.lat;
        this.callback("modify", [this.point.geometry, this.point, false]);
        this.point.geometry.clearBounds();
        this.drawFeature();
    },

        drawFeature: function() {
        this.layer.drawFeature(this.point, this.style);
    },
    
        getGeometry: function() {
        var geometry = this.point && this.point.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiPoint([geometry]);
        }
        return geometry;
    },

        geometryClone: function() {
        var geom = this.getGeometry();
        return geom && geom.clone();
    },

        mousedown: function(evt) {
        return this.down(evt);
    },

        touchstart: function(evt) {
        this.startTouch();
        this.lastTouchPx = evt.xy;
        return this.down(evt);
    },

        mousemove: function(evt) {
        return this.move(evt);
    },

        touchmove: function(evt) {
        this.lastTouchPx = evt.xy;
        return this.move(evt);
    },

        mouseup: function(evt) {
        return this.up(evt);
    },

        touchend: function(evt) {
        evt.xy = this.lastTouchPx;
        return this.up(evt);
    },
  
        down: function(evt) {
        this.mouseDown = true;
        this.lastDown = evt.xy;
        if(!this.touch) { // no point displayed until up on touch devices
            this.modifyFeature(evt.xy);
        }
        this.stoppedDown = this.stopDown;
        return !this.stopDown;
    },

        move: function (evt) {
        if(!this.touch // no point displayed until up on touch devices
           && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(evt.xy);
        }
        return true;
    },

        up: function (evt) {
        this.mouseDown = false;
        this.stoppedDown = this.stopDown;
        if(!this.checkModifiers(evt)) {
            return true;
        }
        if (this.lastUp && this.lastUp.equals(evt.xy)) {
            return true;
        }
        if (this.lastDown && this.passesTolerance(this.lastDown, evt.xy,
                                                  this.pixelTolerance)) {
            if (this.touch) {
                this.modifyFeature(evt.xy);
            }
            if(this.persist) {
                this.destroyPersistedFeature();
            }
            this.lastUp = evt.xy;
            this.finalize();
            return !this.stopUp;
        } else {
            return true;
        }
    },

        mouseout: function(evt) {
        if(OpenLayers.Util.mouseLeft(evt, this.map.viewPortDiv)) {
            this.stoppedDown = this.stopDown;
            this.mouseDown = false;
        }
    },

        passesTolerance: function(pixel1, pixel2, tolerance) {
        var passes = true;

        if (tolerance != null && pixel1 && pixel2) {
            var dist = pixel1.distanceTo(pixel2);
            if (dist > tolerance) {
                passes = false;
            }
        }
        return passes;
    },
    
    CLASS_NAME: "OpenLayers.Handler.Point"
});
