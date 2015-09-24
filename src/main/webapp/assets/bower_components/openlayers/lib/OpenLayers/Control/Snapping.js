/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Snapping = OpenLayers.Class(OpenLayers.Control, {

        
        DEFAULTS: {
        tolerance: 10,
        node: true,
        edge: true,
        vertex: true
    },
    
        greedy: true,
    
        precedence: ["node", "vertex", "edge"],
    
        resolution: null,
    
        geoToleranceCache: null,
    
        layer: null,
    
        feature: null,
    
        point: null,

        initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.options = options || {}; // TODO: this could be done by the super
        if(this.options.layer) {
            this.setLayer(this.options.layer);
        }
        var defaults = OpenLayers.Util.extend({}, this.options.defaults);
        this.defaults = OpenLayers.Util.applyDefaults(defaults, this.DEFAULTS);
        this.setTargets(this.options.targets);
        if(this.targets.length === 0 && this.layer) {
            this.addTargetLayer(this.layer);
        }

        this.geoToleranceCache = {};
    },
    
        setLayer: function(layer) {
        if(this.active) {
            this.deactivate();
            this.layer = layer;
            this.activate();
        } else {
            this.layer = layer;
        }
    },
    
        setTargets: function(targets) {
        this.targets = [];
        if(targets && targets.length) {
            var target;
            for(var i=0, len=targets.length; i<len; ++i) {
                target = targets[i];
                if(target instanceof OpenLayers.Layer.Vector) {
                    this.addTargetLayer(target);
                } else {
                    this.addTarget(target);
                }
            }
        }
    },
    
        addTargetLayer: function(layer) {
        this.addTarget({layer: layer});
    },
    
        addTarget: function(target) {
        target = OpenLayers.Util.applyDefaults(target, this.defaults);
        target.nodeTolerance = target.nodeTolerance || target.tolerance;
        target.vertexTolerance = target.vertexTolerance || target.tolerance;
        target.edgeTolerance = target.edgeTolerance || target.tolerance;
        this.targets.push(target);
    },
    
        removeTargetLayer: function(layer) {
        var target;
        for(var i=this.targets.length-1; i>=0; --i) {
            target = this.targets[i];
            if(target.layer === layer) {
                this.removeTarget(target);
            }
        }
    },
    
        removeTarget: function(target) {
        return OpenLayers.Util.removeItem(this.targets, target);
    },
    
        activate: function() {
        var activated = OpenLayers.Control.prototype.activate.call(this);
        if(activated) {
            if(this.layer && this.layer.events) {
                this.layer.events.on({
                    sketchstarted: this.onSketchModified,
                    sketchmodified: this.onSketchModified,
                    vertexmodified: this.onVertexModified,
                    scope: this
                });
            }
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Control.prototype.deactivate.call(this);
        if(deactivated) {
            if(this.layer && this.layer.events) {
                this.layer.events.un({
                    sketchstarted: this.onSketchModified,
                    sketchmodified: this.onSketchModified,
                    vertexmodified: this.onVertexModified,
                    scope: this
                });
            }
        }
        this.feature = null;
        this.point = null;
        return deactivated;
    },
    
        onSketchModified: function(event) {
        this.feature = event.feature;
        this.considerSnapping(event.vertex, event.vertex);
    },
    
        onVertexModified: function(event) {
        this.feature = event.feature;
        var loc = this.layer.map.getLonLatFromViewPortPx(event.pixel);
        this.considerSnapping(
            event.vertex, new OpenLayers.Geometry.Point(loc.lon, loc.lat)
        );
    },

        considerSnapping: function(point, loc) {
        var best = {
            rank: Number.POSITIVE_INFINITY,
            dist: Number.POSITIVE_INFINITY,
            x: null, y: null
        };
        var snapped = false;
        var result, target;
        for(var i=0, len=this.targets.length; i<len; ++i) {
            target = this.targets[i];
            result = this.testTarget(target, loc);
            if(result) {
                if(this.greedy) {
                    best = result;
                    best.target = target; 
                    snapped = true;
                    break;
                } else {
                    if((result.rank < best.rank) ||
                       (result.rank === best.rank && result.dist < best.dist)) {
                        best = result;
                        best.target = target;
                        snapped = true;
                    }
                }
            }
        }
        if(snapped) {
            var proceed = this.events.triggerEvent("beforesnap", {
                point: point, x: best.x, y: best.y, distance: best.dist,
                layer: best.target.layer, snapType: this.precedence[best.rank]
            });
            if(proceed !== false) {
                point.x = best.x;
                point.y = best.y;
                this.point = point;
                this.events.triggerEvent("snap", {
                    point: point,
                    snapType: this.precedence[best.rank],
                    layer: best.target.layer,
                    distance: best.dist
                });
            } else {
                snapped = false;
            }
        }
        if(this.point && !snapped) {
            point.x = loc.x;
            point.y = loc.y;
            this.point = null;
            this.events.triggerEvent("unsnap", {point: point});
        }
    },
    
        testTarget: function(target, loc) {
        var resolution = this.layer.map.getResolution();
        if ("minResolution" in target) {
            if (resolution < target.minResolution) {
                return null;
            }
        }
        if ("maxResolution" in target) {
            if (resolution >= target.maxResolution) {
                return null;
            }
        }
        var tolerance = {
            node: this.getGeoTolerance(target.nodeTolerance, resolution),
            vertex: this.getGeoTolerance(target.vertexTolerance, resolution),
            edge: this.getGeoTolerance(target.edgeTolerance, resolution)
        };
        var maxTolerance = Math.max(
            tolerance.node, tolerance.vertex, tolerance.edge
        );
        var result = {
            rank: Number.POSITIVE_INFINITY, dist: Number.POSITIVE_INFINITY
        };
        var eligible = false;
        var features = target.layer.features;
        var feature, type, vertices, vertex, closest, dist, found;
        var numTypes = this.precedence.length;
        var ll = new OpenLayers.LonLat(loc.x, loc.y);
        for(var i=0, len=features.length; i<len; ++i) {
            feature = features[i];
            if(feature !== this.feature && !feature._sketch &&
               feature.state !== OpenLayers.State.DELETE &&
               (!target.filter || target.filter.evaluate(feature))) {
                if(feature.atPoint(ll, maxTolerance, maxTolerance)) {
                    for(var j=0, stop=Math.min(result.rank+1, numTypes); j<stop; ++j) {
                        type = this.precedence[j];
                        if(target[type]) {
                            if(type === "edge") {
                                closest = feature.geometry.distanceTo(loc, {details: true});
                                dist = closest.distance;
                                if(dist <= tolerance[type] && dist < result.dist) {
                                    result = {
                                        rank: j, dist: dist,
                                        x: closest.x0, y: closest.y0 // closest coords on feature
                                    };
                                    eligible = true;
                                    break;
                                }
                            } else {
                                vertices = feature.geometry.getVertices(type === "node");
                                found = false;
                                for(var k=0, klen=vertices.length; k<klen; ++k) {
                                    vertex = vertices[k];
                                    dist = vertex.distanceTo(loc);
                                    if(dist <= tolerance[type] &&
                                       (j < result.rank || (j === result.rank && dist < result.dist))) {
                                        result = {
                                            rank: j, dist: dist,
                                            x: vertex.x, y: vertex.y
                                        };
                                        eligible = true;
                                        found = true;
                                    }
                                }
                                if(found) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return eligible ? result : null;
    },
    
        getGeoTolerance: function(tolerance, resolution) {
        if(resolution !== this.resolution) {
            this.resolution = resolution;
            this.geoToleranceCache = {};
        }
        var geoTolerance = this.geoToleranceCache[tolerance];
        if(geoTolerance === undefined) {
            geoTolerance = tolerance * resolution;
            this.geoToleranceCache[tolerance] = geoTolerance;
        }
        return geoTolerance;
    },
    
        destroy: function() {
        if(this.active) {
            this.deactivate(); // TODO: this should be handled by the super
        }
        delete this.layer;
        delete this.targets;
        OpenLayers.Control.prototype.destroy.call(this);
    },

    CLASS_NAME: "OpenLayers.Control.Snapping"
});
