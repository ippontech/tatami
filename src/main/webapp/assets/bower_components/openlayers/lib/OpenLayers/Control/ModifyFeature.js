/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.ModifyFeature = OpenLayers.Class(OpenLayers.Control, {

        bySegment: false,

        documentDrag: false,

        geometryTypes: null,

        clickout: true,

        toggle: true,

        standalone: false,

        layer: null,

        feature: null,

        vertex: null,

        vertices: null,

        virtualVertices: null,

        handlers: null,

        deleteCodes: null,

        virtualStyle: null,

        vertexRenderIntent: null,

        mode: null,

        createVertices: true,

        modified: false,

        radiusHandle: null,

        dragHandle: null,

        onModificationStart: function() {},

        onModification: function() {},

        onModificationEnd: function() {},

        initialize: function(layer, options) {
        options = options || {};
        this.layer = layer;
        this.vertices = [];
        this.virtualVertices = [];
        this.virtualStyle = OpenLayers.Util.extend({},
            this.layer.style ||
            this.layer.styleMap.createSymbolizer(null, options.vertexRenderIntent)
        );
        this.virtualStyle.fillOpacity = 0.3;
        this.virtualStyle.strokeOpacity = 0.3;
        this.deleteCodes = [46, 68];
        this.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        if(!(OpenLayers.Util.isArray(this.deleteCodes))) {
            this.deleteCodes = [this.deleteCodes];
        }
        var dragCallbacks = {
            down: function(pixel) {
                this.vertex = null;
                var feature = this.layer.getFeatureFromEvent(
                        this.handlers.drag.evt);
                if (feature) {
                    this.dragStart(feature);
                } else if (this.clickout) {
                    this._unselect = this.feature;
                }
            },
            move: function(pixel) {
                delete this._unselect;
                if (this.vertex) {
                    this.dragVertex(this.vertex, pixel);
                }
            },
            up: function() {
                this.handlers.drag.stopDown = false;
                if (this._unselect) {
                    this.unselectFeature(this._unselect);
                    delete this._unselect;
                }
            },
            done: function(pixel) {
                if (this.vertex) {
                    this.dragComplete(this.vertex);
                }
            }
        };
        var _self = this;
        var dragOptions = {
            documentDrag: this.documentDrag,
            setEvent: function(evt) {
                var feature = _self.feature;
                _self._lastVertex = feature ?
                                  feature.layer.getFeatureFromEvent(evt) : null;
                OpenLayers.Handler.Drag.prototype.setEvent.apply(
                                                               this, arguments);
            },
            stopDown: false
        };
        var keyboardOptions = {
            keydown: this.handleKeypress
        };
        this.handlers = {
            keyboard: new OpenLayers.Handler.Keyboard(this, keyboardOptions),
            drag: new OpenLayers.Handler.Drag(this, dragCallbacks, dragOptions)
        };

        if (this.bySegment) {
            if (!window.rbush) {
                throw new Error("The rbush library is required");
            }
            if (!OpenLayers.Control.ModifyFeature.BySegment) {
                throw new Error("OpenLayers.Control.ModifyFeature.BySegment is missing from the build");
            } else {
                OpenLayers.Util.extend(this, OpenLayers.Control.ModifyFeature.BySegment);
            }
        }
    },

        createVirtualVertex: function(point1, point2) {
        var x = (point1.x + point2.x) / 2;
        var y = (point1.y + point2.y) / 2;
        var point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(x, y),
            null, this.virtualStyle
        );
        point._sketch = true;
        return point;
    },

        destroy: function() {
        if (this.map) {
            this.map.events.un({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
        }
        this.layer = null;
        OpenLayers.Control.prototype.destroy.apply(this, []);
    },

        activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.moveLayerToTop();
            this.map.events.on({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            this._lastVertex = null;
            return this.handlers.keyboard.activate() &&
                    this.handlers.drag.activate();
        }
        return false;
    },

        deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.moveLayerBack();
            this.map.events.un({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            this.layer.removeFeatures(this.vertices, {silent: true});
            this.layer.removeFeatures(this.virtualVertices, {silent: true});
            this.vertices = [];
            this.handlers.drag.deactivate();
            this.handlers.keyboard.deactivate();
            var feature = this.feature;
            if (feature && feature.geometry && feature.layer) {
                this.unselectFeature(feature);
            }
            deactivated = true;
        }
        return deactivated;
    },

        beforeSelectFeature: function(feature) {
        return this.layer.events.triggerEvent(
            "beforefeaturemodified", {feature: feature}
        );
    },

        selectFeature: function(feature) {
        var indexOf = OpenLayers.Util.indexOf;

        if (this.feature === feature ||
           (this.geometryTypes && indexOf(this.geometryTypes,
           feature.geometry.CLASS_NAME) == -1)) {
            return;
        }
        if (this.beforeSelectFeature(feature) !== false) {
            if (this.feature) {
                this.unselectFeature(this.feature);
            }
            this.feature = feature;

            if(indexOf(this.layer.selectedFeatures, feature) == -1){
                this.layer.selectedFeatures.push(feature);
            }

            this.layer.drawFeature(feature, 'select');
            this.modified = false;
            this.resetVertices();
            this.onModificationStart(this.feature);
        }
        var modified = feature.modified;
        if (feature.geometry && !(modified && modified.geometry)) {
            this._originalGeometry = feature.geometry.clone();
        }
    },

        unselectFeature: function(feature) {
        this.layer.removeFeatures(this.vertices, {silent: true});
        this.vertices = [];
        this.layer.destroyFeatures(this.virtualVertices, {silent: true});
        this.virtualVertices = [];
        if(this.dragHandle) {
            this.layer.destroyFeatures([this.dragHandle], {silent: true});
            delete this.dragHandle;
        }
        if(this.radiusHandle) {
            this.layer.destroyFeatures([this.radiusHandle], {silent: true});
            delete this.radiusHandle;
        }
        this.layer.drawFeature(this.feature, 'default');
        this.feature = null;
        OpenLayers.Util.removeItem(this.layer.selectedFeatures, feature);
        this.onModificationEnd(feature);
        this.layer.events.triggerEvent("afterfeaturemodified", {
            feature: feature,
            modified: this.modified
        });
        this.modified = false;
    },


        dragStart: function(feature) {
        var isPoint = feature.geometry.CLASS_NAME ==
                'OpenLayers.Geometry.Point';
        if (!this.standalone &&
                ((!feature._sketch && isPoint) || !feature._sketch)) {
            if (this.toggle && this.feature === feature) {
                this._unselect = feature;
            }
            this.selectFeature(feature);
        }
        if (this.feature &&
                (feature._sketch || isPoint && feature === this.feature)) {
            this.vertex = feature;
            this.handlers.drag.stopDown = true;
        }
    },

        dragVertex: function(vertex, pixel) {
        var pos = this.map.getLonLatFromViewPortPx(pixel);
        var geom = vertex.geometry;
        geom.move(pos.lon - geom.x, pos.lat - geom.y);
        this.modified = true;
                if(this.feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            this.layer.events.triggerEvent("vertexmodified", {
                vertex: vertex.geometry,
                feature: this.feature,
                pixel: pixel
            });
        } else {
            if(vertex._index) {
                if (vertex._index == -1) {
                    vertex._index = OpenLayers.Util.indexOf(vertex.geometry.parent.components, vertex._next);
                }
                vertex.geometry.parent.addComponent(vertex.geometry,
                                                    vertex._index);
                delete vertex._index;
                OpenLayers.Util.removeItem(this.virtualVertices, vertex);
                this.vertices.push(vertex);
            } else if(vertex == this.dragHandle) {
                this.layer.removeFeatures(this.vertices, {silent: true});
                this.vertices = [];
                if(this.radiusHandle) {
                    this.layer.destroyFeatures([this.radiusHandle], {silent: true});
                    this.radiusHandle = null;
                }
            } else if(vertex !== this.radiusHandle) {
                this.layer.events.triggerEvent("vertexmodified", {
                    vertex: vertex.geometry,
                    feature: this.feature,
                    pixel: pixel
                });
            }
            if(this.virtualVertices.length > 0) {
                this.layer.destroyFeatures(this.virtualVertices, {silent: true});
                this.virtualVertices = [];
            }
            this.layer.drawFeature(this.feature, this.standalone ? undefined :
                                            'select');
        }
        this.layer.drawFeature(vertex);
    },

        dragComplete: function(vertex) {
        this.resetVertices();
        this.setFeatureState();
        this.onModification(this.feature);
        this.layer.events.triggerEvent("featuremodified",
                                       {feature: this.feature});
    },

        setFeatureState: function() {
        if(this.feature.state != OpenLayers.State.INSERT &&
           this.feature.state != OpenLayers.State.DELETE) {
            this.feature.state = OpenLayers.State.UPDATE;
            if (this.modified && this._originalGeometry) {
                var feature = this.feature;
                feature.modified = OpenLayers.Util.extend(feature.modified, {
                    geometry: this._originalGeometry
                });
                delete this._originalGeometry;
            }
        }
    },

        resetVertices: function() {
        if(this.vertices.length > 0) {
            this.layer.removeFeatures(this.vertices, {silent: true});
            this.vertices = [];
        }
        if(this.virtualVertices.length > 0) {
            this.layer.removeFeatures(this.virtualVertices, {silent: true});
            this.virtualVertices = [];
        }
        if(this.dragHandle) {
            this.layer.destroyFeatures([this.dragHandle], {silent: true});
            this.dragHandle = null;
        }
        if(this.radiusHandle) {
            this.layer.destroyFeatures([this.radiusHandle], {silent: true});
            this.radiusHandle = null;
        }
        if(this.feature &&
           this.feature.geometry.CLASS_NAME != "OpenLayers.Geometry.Point") {
            if((this.mode & OpenLayers.Control.ModifyFeature.DRAG)) {
                this.collectDragHandle();
            }
            if((this.mode & (OpenLayers.Control.ModifyFeature.ROTATE |
                             OpenLayers.Control.ModifyFeature.RESIZE))) {
                this.collectRadiusHandle();
            }
            if(this.mode & OpenLayers.Control.ModifyFeature.RESHAPE){
                if (!(this.mode & OpenLayers.Control.ModifyFeature.RESIZE)){
                    this.collectVertices();
                }
            }
        }
    },

        handleKeypress: function(evt) {
        var code = evt.keyCode;
        if(this.feature &&
           OpenLayers.Util.indexOf(this.deleteCodes, code) != -1) {
            var vertex = this._lastVertex;
            if (vertex &&
                    OpenLayers.Util.indexOf(this.vertices, vertex) != -1 &&
                    !this.handlers.drag.dragging && vertex.geometry.parent) {
                vertex.geometry.parent.removeComponent(vertex.geometry);
                this.layer.events.triggerEvent("vertexremoved", {
                    vertex: vertex.geometry,
                    feature: this.feature,
                    pixel: evt.xy
                });
                this.layer.drawFeature(this.feature, this.standalone ?
                                       undefined : 'select');
                this.modified = true;
                this.resetVertices();
                this.setFeatureState();
                this.onModification(this.feature);
                this.layer.events.triggerEvent("featuremodified",
                                               {feature: this.feature});
            }
        }
    },

        collectVertices: function() {
        this.vertices = [];
        this.virtualVertices = [];
        var control = this;
        function collectComponentVertices(geometry) {
            var i, vertex, component, len;
            if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                vertex = new OpenLayers.Feature.Vector(geometry);
                vertex._sketch = true;
                vertex.renderIntent = control.vertexRenderIntent;
                control.vertices.push(vertex);
            } else {
                var numVert = geometry.components.length;
                if(geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                    numVert -= 1;
                }
                for(i=0; i<numVert; ++i) {
                    component = geometry.components[i];
                    if(component.CLASS_NAME == "OpenLayers.Geometry.Point") {
                        vertex = new OpenLayers.Feature.Vector(component);
                        vertex._sketch = true;
                        vertex.renderIntent = control.vertexRenderIntent;
                        control.vertices.push(vertex);
                    } else {
                        collectComponentVertices(component);
                    }
                }
                if (control.createVertices && geometry.CLASS_NAME != "OpenLayers.Geometry.MultiPoint") {
                    for(i=0, len=geometry.components.length; i<len-1; ++i) {
                        var prevVertex = geometry.components[i];
                        var nextVertex = geometry.components[i + 1];
                        if(prevVertex.CLASS_NAME == "OpenLayers.Geometry.Point" &&
                           nextVertex.CLASS_NAME == "OpenLayers.Geometry.Point") {
                            var point = control.createVirtualVertex.call(control, prevVertex, nextVertex);
                            point.geometry.parent = geometry;
                            point._index = i + 1;
                            control.virtualVertices.push(point);
                        }
                    }
                }
            }
        }
        collectComponentVertices.call(this, this.feature.geometry);
        this.layer.addFeatures(this.virtualVertices, {silent: true});
        this.layer.addFeatures(this.vertices, {silent: true});
    },

        collectDragHandle: function() {
        var geometry = this.feature.geometry;
        var center = geometry.getBounds().getCenterLonLat();
        var originGeometry = new OpenLayers.Geometry.Point(
            center.lon, center.lat
        );
        var origin = new OpenLayers.Feature.Vector(originGeometry);
        originGeometry.move = function(x, y) {
            OpenLayers.Geometry.Point.prototype.move.call(this, x, y);
            geometry.move(x, y);
        };
        origin._sketch = true;
        this.dragHandle = origin;
        this.dragHandle.renderIntent = this.vertexRenderIntent;
        this.layer.addFeatures([this.dragHandle], {silent: true});
    },

        collectRadiusHandle: function() {
        var geometry = this.feature.geometry;
        var bounds = geometry.getBounds();
        var center = bounds.getCenterLonLat();
        var originGeometry = new OpenLayers.Geometry.Point(
            center.lon, center.lat
        );
        var radiusGeometry = new OpenLayers.Geometry.Point(
            bounds.right, bounds.bottom
        );
        var radius = new OpenLayers.Feature.Vector(radiusGeometry);
        var resize = (this.mode & OpenLayers.Control.ModifyFeature.RESIZE);
        var reshape = (this.mode & OpenLayers.Control.ModifyFeature.RESHAPE);
        var rotate = (this.mode & OpenLayers.Control.ModifyFeature.ROTATE);

        radiusGeometry.move = function(x, y) {
            OpenLayers.Geometry.Point.prototype.move.call(this, x, y);
            var dx1 = this.x - originGeometry.x;
            var dy1 = this.y - originGeometry.y;
            var dx0 = dx1 - x;
            var dy0 = dy1 - y;
            if(rotate) {
                var a0 = Math.atan2(dy0, dx0);
                var a1 = Math.atan2(dy1, dx1);
                var angle = a1 - a0;
                angle *= 180 / Math.PI;
                geometry.rotate(angle, originGeometry);
            }
            if(resize) {
                var scale, ratio;
                if (reshape) {
                    scale = dy1 / dy0;
                    ratio = (dx1 / dx0) / scale;
                } else {
                    var l0 = Math.sqrt((dx0 * dx0) + (dy0 * dy0));
                    var l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
                    scale = l1 / l0;
                }
                geometry.resize(scale, originGeometry, ratio);
            }
        };
        radius._sketch = true;
        this.radiusHandle = radius;
        this.radiusHandle.renderIntent = this.vertexRenderIntent;
        this.layer.addFeatures([this.radiusHandle], {silent: true});
    },

        setMap: function(map) {
        this.handlers.drag.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

        handleMapEvents: function(evt) {
        if (evt.type == "removelayer" || evt.property == "order") {
            this.moveLayerToTop();
        }
    },

        moveLayerToTop: function() {
        var index = Math.max(this.map.Z_INDEX_BASE['Feature'] - 1,
            this.layer.getZIndex()) + 1;
        this.layer.setZIndex(index);

    },

        moveLayerBack: function() {
        var index = this.layer.getZIndex() - 1;
        if (index >= this.map.Z_INDEX_BASE['Feature']) {
            this.layer.setZIndex(index);
        } else {
            this.map.setLayerZIndex(this.layer,
                this.map.getLayerIndex(this.layer));
        }
    },

    CLASS_NAME: "OpenLayers.Control.ModifyFeature"
});

OpenLayers.Control.ModifyFeature.RESHAPE = 1;
OpenLayers.Control.ModifyFeature.RESIZE = 2;
OpenLayers.Control.ModifyFeature.ROTATE = 4;
OpenLayers.Control.ModifyFeature.DRAG = 8;
