/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Control.ModifyFeature.BySegment = {

        hoverTolerance: 25,

        collectVertices: OpenLayers.Function.Void,

        setMap: function(map) {
        OpenLayers.Control.ModifyFeature.prototype.setMap.apply(this, arguments);
        if (!this.handlers.hover) {
            this.handlers.hover = new OpenLayers.Handler.Hover(this, { 
                move: this.onHoverMove
            });
        }
        this.handlers.hover.setMap(map);
        this.layer.events.on({
            beforefeaturemodified: this.createSpatialIndex,
            afterfeaturemodified: this.deactivateHover,
            scope: this
       });
    },

        deactivateHover: function() {
        this.handlers.hover.deactivate();
    },

        destroy: function() {
        if (this.layer) {
            this.layer.events.un({
                beforefeaturemodified: this.createSpatialIndex,
                afterfeaturemodified: this.deactivateHover,
                scope: this
            });
        }
        OpenLayers.Control.ModifyFeature.prototype.destroy.apply(this, []);
    },

        dragStart: function(feature) {
        OpenLayers.Control.ModifyFeature.prototype.dragStart.apply(this, arguments);
        this.vertexGeom = feature.geometry.clone();
        if (this.handlers.drag.stopDown) {
            this.handlers.hover.deactivate();
        }
    },

        dragComplete: function(vertex) {
        this.updateSpatialIndex(vertex);
        OpenLayers.Control.ModifyFeature.prototype.dragComplete.apply(this, arguments);
        this.handlers.hover.activate();
    },

        onHoverMove: function(evt) {
        if(this.vertices.length > 0) {
            this.layer.removeFeatures(this.vertices, {silent: true});
            this.vertices = [];
        }
        if(this.virtualVertices.length > 0) {
            this.layer.removeFeatures(this.virtualVertices, {silent: true});
            this.virtualVertices = [];
        }
        var pixel = evt.xy;
        var llPx = pixel.add(-this.hoverTolerance/2, this.hoverTolerance/2);
        var urPx = pixel.add(this.hoverTolerance/2, -this.hoverTolerance/2);
        var ll = this.map.getLonLatFromPixel(llPx);
        var ur = this.map.getLonLatFromPixel(urPx);
        var hits = this.tree.search([ll.lon, ll.lat, ur.lon, ur.lat]);
        if (hits.length > 0) {
            var center = this.map.getLonLatFromPixel(pixel);
            var centerPt = new OpenLayers.Geometry.Point(center.lon, center.lat);
            var d = Number.MAX_VALUE;
            var closestHit;
            for (var i=0, ii = hits.length; i<ii; ++i) {
                var hit = hits[i];
                var distance = OpenLayers.Geometry.distanceSquaredToSegment(centerPt, {
                    x1: hit.point1.x,
                    x2: hit.point2.x,
                    y1: hit.point1.y,
                    y2: hit.point2.y
                }).distance;
                if (distance < d) {
                    closestHit = hit;
                }
                d = distance;
            }
            var createVertex = function(geom) {
                var vertex = new OpenLayers.Feature.Vector(geom);
                vertex._sketch = true;
                vertex.renderIntent = this.vertexRenderIntent;
                this.vertices.push(vertex);
            };
            createVertex.call(this, closestHit.point1);
            createVertex.call(this, closestHit.point2);
            var point = this.createVirtualVertex(closestHit.point1, closestHit.point2);
            point._previous = closestHit.point1;
            point._next = closestHit.point2;
            point._index = -1;
            point.geometry.parent = closestHit.point1.parent;
            this.virtualVertices.push(point);
        }
        this.layer.addFeatures(this.vertices, {silent: true});
        this.layer.addFeatures(this.virtualVertices, {silent: true});
    },

        createSpatialIndex: function(evt) {
        var feature = evt.feature;
        var data = [];
        function collectComponentVertices(geometry) {
            var i, vertex, component, nextComponent, len;
            if (geometry.CLASS_NAME !== "OpenLayers.Geometry.Point") {
                var numVert = geometry.components.length;
                if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing"
                || geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                    numVert -= 1;
                }
                nextComponent = geometry.components[0];
                for (i=1; i<=numVert; ++i) {
                    component = nextComponent;
                    nextComponent = geometry.components[i];
                    if (component.CLASS_NAME == "OpenLayers.Geometry.Point") {
                        var bbox = this.createBBOX(component, nextComponent);
                        bbox.point1 = component;
                        bbox.point2 = nextComponent;
                        data.push(bbox);
                    } else {
                        collectComponentVertices.call(this, component);
                    }
                }
            }
        }
        collectComponentVertices.call(this, feature.geometry);
        this.tree = window.rbush();
        this.tree.load(data);
        this.handlers.hover.activate();
    },

        createBBOX: function(point1, point2) {
        return [
            point1.x < point2.x ? point1.x : point2.x,
            point1.y < point2.y ? point1.y : point2.y,
            point1.x < point2.x ? point2.x : point1.x,
            point1.y < point2.y ? point2.y : point1.y
        ];
    },

        updateSpatialIndex: function(vertex) {
        var hits = this.tree.search([
            this.vertexGeom.x, 
            this.vertexGeom.y, 
            this.vertexGeom.x, 
            this.vertexGeom.y
        ]);
        var bbox, i, ii;
        if (vertex._previous) {
            bbox = this.createBBOX(vertex._previous, vertex.geometry);
            bbox.point1 = vertex._previous;
            bbox.point2 = vertex.geometry;
            this.tree.insert(bbox);
            bbox = this.createBBOX(vertex.geometry, vertex._next);
            bbox.point1 = vertex.geometry;
            bbox.point2 = vertex._next;
            this.tree.insert(bbox);
            this.tree.remove(hits[0]);
            delete vertex._next;
            delete vertex._previous;
        } else { // normal vertex
            for (i=0, ii=hits.length; i<ii; ++i) {
                var hit = hits[i];
                if (this.vertexGeom.equals(hit.point1)) {
                    bbox = this.createBBOX(vertex.geometry, hit.point2);
                    bbox.point1 = vertex.geometry;
                    bbox.point2 = hit.point2;
                } else {
                    bbox = this.createBBOX(vertex.geometry, hit.point1);
                    bbox.point1 = hit.point1;
                    bbox.point2 = vertex.geometry;
                }
                this.tree.insert(bbox);
                this.tree.remove(hit);
            }
        }
        this.vertexGeom.destroy();
        this.vertexGeom = null;
    }

};
