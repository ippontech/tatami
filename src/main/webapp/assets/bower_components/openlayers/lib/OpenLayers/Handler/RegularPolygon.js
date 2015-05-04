/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Handler.RegularPolygon = OpenLayers.Class(OpenLayers.Handler.Drag, {
    
        sides: 4,

        radius: null,
    
        snapAngle: null,
    
        snapToggle: 'shiftKey',
    
        layerOptions: null,

        persist: false,

        irregular: false,

        citeCompliant: false,

        angle: null,

        fixedRadius: false,

        feature: null,

        layer: null,

        origin: null,

        initialize: function(control, callbacks, options) {
        if(!(options && options.layerOptions && options.layerOptions.styleMap)) {
            this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style['default'], {});
        }

        OpenLayers.Handler.Drag.prototype.initialize.apply(this,
                                                [control, callbacks, options]);
        this.options = (options) ? options : {};
    },
    
        setOptions: function (newOptions) {
        OpenLayers.Util.extend(this.options, newOptions);
        OpenLayers.Util.extend(this, newOptions);
    },
    
        activate: function() {
        var activated = false;
        if(OpenLayers.Handler.Drag.prototype.activate.apply(this, arguments)) {
            var options = OpenLayers.Util.extend({
                displayInLayerSwitcher: false,
                calculateInRange: OpenLayers.Function.True,
                wrapDateLine: this.citeCompliant
            }, this.layerOptions);
            this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
            this.map.addLayer(this.layer);
            activated = true;
        }
        return activated;
    },

        deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.Drag.prototype.deactivate.apply(this, arguments)) {
            if(this.dragging) {
                this.cancel();
            }
            if (this.layer.map != null) {
                this.layer.destroy(false);
                if (this.feature) {
                    this.feature.destroy();
                }
            }
            this.layer = null;
            this.feature = null;
            deactivated = true;
        }
        return deactivated;
    },
    
        down: function(evt) {
        this.fixedRadius = !!(this.radius);
        var maploc = this.layer.getLonLatFromViewPortPx(evt.xy); 
        this.origin = new OpenLayers.Geometry.Point(maploc.lon, maploc.lat);
        if(!this.fixedRadius || this.irregular) {
            this.radius = this.map.getResolution();
        }
        if(this.persist) {
            this.clear();
        }
        this.feature = new OpenLayers.Feature.Vector();
        this.createGeometry();
        this.callback("create", [this.origin, this.feature]);
        this.layer.addFeatures([this.feature], {silent: true});
        this.layer.drawFeature(this.feature, this.style);
    },
    
        move: function(evt) {
        var maploc = this.layer.getLonLatFromViewPortPx(evt.xy); 
        var point = new OpenLayers.Geometry.Point(maploc.lon, maploc.lat);
        if(this.irregular) {
            var ry = Math.sqrt(2) * Math.abs(point.y - this.origin.y) / 2;
            this.radius = Math.max(this.map.getResolution() / 2, ry);
        } else if(this.fixedRadius) {
            this.origin = point;
        } else {
            this.calculateAngle(point, evt);
            this.radius = Math.max(this.map.getResolution() / 2,
                                   point.distanceTo(this.origin));
        }
        this.modifyGeometry();
        if(this.irregular) {
            var dx = point.x - this.origin.x;
            var dy = point.y - this.origin.y;
            var ratio;
            if(dy == 0) {
                ratio = dx / (this.radius * Math.sqrt(2));
            } else {
                ratio = dx / dy;
            }
            this.feature.geometry.resize(1, this.origin, ratio);
            this.feature.geometry.move(dx / 2, dy / 2);
        }
        this.layer.drawFeature(this.feature, this.style);
    },

        up: function(evt) {
        this.finalize();
        if (this.start == this.last) {
            this.callback("done", [evt.xy]);
        }
    },

        out: function(evt) {
        this.finalize();
    },

        createGeometry: function() {
        this.angle = Math.PI * ((1/this.sides) - (1/2));
        if(this.snapAngle) {
            this.angle += this.snapAngle * (Math.PI / 180);
        }
        this.feature.geometry = OpenLayers.Geometry.Polygon.createRegularPolygon(
            this.origin, this.radius, this.sides, this.snapAngle
        );
    },
    
        modifyGeometry: function() {
        var angle, point;
        var ring = this.feature.geometry.components[0];
        if(ring.components.length != (this.sides + 1)) {
            this.createGeometry();
            ring = this.feature.geometry.components[0];
        }
        for(var i=0; i<this.sides; ++i) {
            point = ring.components[i];
            angle = this.angle + (i * 2 * Math.PI / this.sides);
            point.x = this.origin.x + (this.radius * Math.cos(angle));
            point.y = this.origin.y + (this.radius * Math.sin(angle));
            point.clearBounds();
        }
    },
    
        calculateAngle: function(point, evt) {
        var alpha = Math.atan2(point.y - this.origin.y,
                               point.x - this.origin.x);
        if(this.snapAngle && (this.snapToggle && !evt[this.snapToggle])) {
            var snapAngleRad = (Math.PI / 180) * this.snapAngle;
            this.angle = Math.round(alpha / snapAngleRad) * snapAngleRad;
        } else {
            this.angle = alpha;
        }
    },

        cancel: function() {
        this.callback("cancel", null);
        this.finalize();
    },

        finalize: function() {
        this.origin = null;
        this.radius = this.options.radius;
    },

        clear: function() {
        if (this.layer) {
            this.layer.renderer.clear();
            this.layer.destroyFeatures();
        }
    },
    
        callback: function (name, args) {
        if (this.callbacks[name]) {
            this.callbacks[name].apply(this.control,
                                       [this.feature.geometry.clone()]);
        }
        if(!this.persist && (name == "done" || name == "cancel")) {
            this.clear();
        }
    },

    CLASS_NAME: "OpenLayers.Handler.RegularPolygon"
});
