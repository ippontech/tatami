/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Handler.Path = OpenLayers.Class(OpenLayers.Handler.Point, {
    
        line: null,

        maxVertices: null,

        doubleTouchTolerance: 20,

        freehand: false,
    
        freehandToggle: 'shiftKey',

        timerId: null,

        redoStack: null,

    
        createFeature: function(pixel) {
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel); 
        var geometry = new OpenLayers.Geometry.Point(
            lonlat.lon, lonlat.lat
        );
        this.point = new OpenLayers.Feature.Vector(geometry);
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([this.point.geometry])
        );
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.line, this.point], {silent: true});
    },
        
        destroyFeature: function(force) {
        OpenLayers.Handler.Point.prototype.destroyFeature.call(
            this, force);
        this.line = null;
    },

        destroyPersistedFeature: function() {
        var layer = this.layer;
        if(layer && layer.features.length > 2) {
            this.layer.features[0].destroy();
        }
    },

        removePoint: function() {
        if(this.point) {
            this.layer.removeFeatures([this.point]);
        }
    },
    
        addPoint: function(pixel) {
        this.layer.removeFeatures([this.point]);
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel); 
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line.geometry.addComponent(
            this.point.geometry, this.line.geometry.components.length
        );
        this.layer.addFeatures([this.point]);
        this.callback("point", [this.point.geometry, this.getGeometry()]);
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        this.drawFeature();
        delete this.redoStack;
    },
    
        insertXY: function(x, y) {
        this.line.geometry.addComponent(
            new OpenLayers.Geometry.Point(x, y), 
            this.getCurrentPointIndex()
        );
        this.drawFeature();
        delete this.redoStack;
    },

        insertDeltaXY: function(dx, dy) {
        var previousIndex = this.getCurrentPointIndex() - 1;
        var p0 = this.line.geometry.components[previousIndex];
        if (p0 && !isNaN(p0.x) && !isNaN(p0.y)) {
            this.insertXY(p0.x + dx, p0.y + dy);
        }
    },

        insertDirectionLength: function(direction, length) {
        direction *= Math.PI / 180;
        var dx = length * Math.cos(direction);
        var dy = length * Math.sin(direction);
        this.insertDeltaXY(dx, dy);
    },

        insertDeflectionLength: function(deflection, length) {
        var previousIndex = this.getCurrentPointIndex() - 1;
        if (previousIndex > 0) {
            var p1 = this.line.geometry.components[previousIndex];
            var p0 = this.line.geometry.components[previousIndex-1];
            var theta = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            this.insertDirectionLength(
                (theta * 180 / Math.PI) + deflection, length
            );
        }
    },

        getCurrentPointIndex: function() {
        return this.line.geometry.components.length - 1;
    },
    
    
        undo: function() {
        var geometry = this.line.geometry;
        var components = geometry.components;
        var index = this.getCurrentPointIndex() - 1;
        var target = components[index];
        var undone = geometry.removeComponent(target);
        if (undone) {
            if (this.touch && index > 0) {
                components = geometry.components; // safety
                var lastpt = components[index - 1];
                var curptidx = this.getCurrentPointIndex();
                var curpt = components[curptidx];
                curpt.x = lastpt.x;
                curpt.y = lastpt.y;
            }
            if (!this.redoStack) {
                this.redoStack = [];
            }
            this.redoStack.push(target);
            this.drawFeature();
        }
        return undone;
    },
    
        redo: function() {
        var target = this.redoStack && this.redoStack.pop();
        if (target) {
            this.line.geometry.addComponent(target, this.getCurrentPointIndex());
            this.drawFeature();
        }
        return !!target;
    },
    
        freehandMode: function(evt) {
        return (this.freehandToggle && evt[this.freehandToggle]) ?
                    !this.freehand : this.freehand;
    },

        modifyFeature: function(pixel, drawing) {
        if(!this.line) {
            this.createFeature(pixel);
        }
        var lonlat = this.layer.getLonLatFromViewPortPx(pixel); 
        this.point.geometry.x = lonlat.lon;
        this.point.geometry.y = lonlat.lat;
        this.callback("modify", [this.point.geometry, this.getSketch(), drawing]);
        this.point.geometry.clearBounds();
        this.drawFeature();
    },

        drawFeature: function() {
        this.layer.drawFeature(this.line, this.style);
        this.layer.drawFeature(this.point, this.style);
    },

        getSketch: function() {
        return this.line;
    },

        getGeometry: function() {
        var geometry = this.line && this.line.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiLineString([geometry]);
        }
        return geometry;
    },

        touchstart: function(evt) {
        if (this.timerId &&
            this.passesTolerance(this.lastTouchPx, evt.xy,
                                 this.doubleTouchTolerance)) {
            this.finishGeometry();
            window.clearTimeout(this.timerId);
            this.timerId = null;
            return false;
        } else {
            if (this.timerId) {
                window.clearTimeout(this.timerId);
                this.timerId = null;
            }
            this.timerId = window.setTimeout(
                OpenLayers.Function.bind(function() {
                    this.timerId = null;
                }, this), 300);
            return OpenLayers.Handler.Point.prototype.touchstart.call(this, evt);
        }
    },

        down: function(evt) {
        var stopDown = this.stopDown;
        if(this.freehandMode(evt)) {
            stopDown = true;
            if (this.touch) {
                this.modifyFeature(evt.xy, !!this.lastUp);
                OpenLayers.Event.stop(evt);
            }
        }
        if (!this.touch && (!this.lastDown ||
                            !this.passesTolerance(this.lastDown, evt.xy,
                                                  this.pixelTolerance))) {
            this.modifyFeature(evt.xy, !!this.lastUp);
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
        this.stoppedDown = stopDown;
        return !stopDown;
    },

        move: function (evt) {
        if(this.stoppedDown && this.freehandMode(evt)) {
            if(this.persist) {
                this.destroyPersistedFeature();
            }
            if(this.maxVertices && this.line &&
                    this.line.geometry.components.length === this.maxVertices) {
                this.removePoint();
                this.finalize();
            } else {
                this.addPoint(evt.xy);
            }
            return false;
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(evt.xy, !!this.lastUp);
        }
        return true;
    },
    
        up: function (evt) {
        if (this.mouseDown && (!this.lastUp || !this.lastUp.equals(evt.xy))) {
            if(this.stoppedDown && this.freehandMode(evt)) {
                if (this.persist) {
                    this.destroyPersistedFeature();
                }
                this.removePoint();
                this.finalize();
            } else {
                if (this.passesTolerance(this.lastDown, evt.xy,
                                         this.pixelTolerance)) {
                    if (this.touch) {
                        this.modifyFeature(evt.xy);
                    }
                    if(this.lastUp == null && this.persist) {
                        this.destroyPersistedFeature();
                    }
                    this.addPoint(evt.xy);
                    this.lastUp = evt.xy;
                    if(this.line.geometry.components.length === this.maxVertices + 1) {
                        this.finishGeometry();
                    }
                }
            }
        }
        this.stoppedDown = this.stopDown;
        this.mouseDown = false;
        return !this.stopUp;
    },

        finishGeometry: function() {
        var index = this.line.geometry.components.length - 1;
        this.line.geometry.removeComponent(this.line.geometry.components[index]);
        this.removePoint();
        this.finalize();
    },
  
        dblclick: function(evt) {
        if(!this.freehandMode(evt)) {
            this.finishGeometry();
        }
        return false;
    },

    CLASS_NAME: "OpenLayers.Handler.Path"
});
