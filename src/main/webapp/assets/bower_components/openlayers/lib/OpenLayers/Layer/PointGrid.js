/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.PointGrid = OpenLayers.Class(OpenLayers.Layer.Vector, {

        dx: null,

        dy: null,

        ratio: 1.5,

        maxFeatures: 250,

        rotation: 0,

        origin: null,

        gridBounds: null,

        initialize: function(config) {
        config = config || {};
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, [config.name, config]);
    },
    
        setMap: function(map) {        
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
        map.events.register("moveend", this, this.onMoveEnd);
    },

        removeMap: function(map) {
        map.events.unregister("moveend", this, this.onMoveEnd);
        OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments);
    },
    
        setRatio: function(ratio) {
        this.ratio = ratio;
        this.updateGrid(true);
    },
    
        setMaxFeatures: function(maxFeatures) {
        this.maxFeatures = maxFeatures;
        this.updateGrid(true);
    },

        setSpacing: function(dx, dy) {
        this.dx = dx;
        this.dy = dy || dx;
        this.updateGrid(true);
    },
    
        setOrigin: function(origin) {
        this.origin = origin;
        this.updateGrid(true);
    },
    
        getOrigin: function() {
        if (!this.origin) {
            this.origin = this.map.getExtent().getCenterLonLat();
        }
        return this.origin;
    },
    
        setRotation: function(rotation) {
        this.rotation = rotation;
        this.updateGrid(true);
    },
    
        onMoveEnd: function() {
        this.updateGrid();
    },
    
        getViewBounds: function() {
        var bounds = this.map.getExtent();
        if (this.rotation) {
            var origin = this.getOrigin();
            var rotationOrigin = new OpenLayers.Geometry.Point(origin.lon, origin.lat);
            var rect = bounds.toGeometry();
            rect.rotate(-this.rotation, rotationOrigin);
            bounds = rect.getBounds();
        }
        return bounds;
    },
    
        updateGrid: function(force) {
        if (force || this.invalidBounds()) {
            var viewBounds = this.getViewBounds();
            var origin = this.getOrigin();
            var rotationOrigin = new OpenLayers.Geometry.Point(origin.lon, origin.lat);
            var viewBoundsWidth = viewBounds.getWidth();
            var viewBoundsHeight = viewBounds.getHeight();
            var aspectRatio = viewBoundsWidth / viewBoundsHeight;
            var maxHeight = Math.sqrt(this.dx * this.dy * this.maxFeatures / aspectRatio);
            var maxWidth = maxHeight * aspectRatio; 
            var gridWidth = Math.min(viewBoundsWidth * this.ratio, maxWidth);
            var gridHeight = Math.min(viewBoundsHeight * this.ratio, maxHeight);
            var center = viewBounds.getCenterLonLat();
            this.gridBounds = new OpenLayers.Bounds(
                center.lon - (gridWidth / 2),
                center.lat - (gridHeight / 2),
                center.lon + (gridWidth / 2),
                center.lat + (gridHeight / 2)
            );
            var rows = Math.floor(gridHeight / this.dy);
            var cols = Math.floor(gridWidth / this.dx);
            var gridLeft = origin.lon + (this.dx * Math.ceil((this.gridBounds.left - origin.lon) / this.dx));
            var gridBottom = origin.lat + (this.dy * Math.ceil((this.gridBounds.bottom - origin.lat) / this.dy));
            var features = new Array(rows * cols);
            var x, y, point;
            for (var i=0; i<cols; ++i) {
                x = gridLeft + (i * this.dx);
                for (var j=0; j<rows; ++j) {
                    y = gridBottom + (j * this.dy);
                    point = new OpenLayers.Geometry.Point(x, y);
                    if (this.rotation) {
                        point.rotate(this.rotation, rotationOrigin);
                    }
                    features[(i*rows)+j] = new OpenLayers.Feature.Vector(point);
                }
            }
            this.destroyFeatures(this.features, {silent: true});
            this.addFeatures(features, {silent: true});
        }
    },

        invalidBounds: function() {
        return !this.gridBounds || !this.gridBounds.containsBounds(this.getViewBounds());
    },

    CLASS_NAME: "OpenLayers.Layer.PointGrid"
    
});
