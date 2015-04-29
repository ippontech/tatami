/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Split = OpenLayers.Class(OpenLayers.Control, {

        
        layer: null,
    
        source: null,
    
        sourceOptions: null,

        tolerance: null,
    
        edge: true,
    
        deferDelete: false,
    
        mutual: true,
    
        targetFilter: null,
    
        sourceFilter: null,
    
        handler: null,

        initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.options = options || {}; // TODO: this could be done by the super
        if(this.options.source) {
            this.setSource(this.options.source);
        }
    },
    
        setSource: function(layer) {
        if(this.active) {
            this.deactivate();
            if(this.handler) {
                this.handler.destroy();
                delete this.handler;
            }
            this.source = layer;
            this.activate();
        } else {
            this.source = layer;
        }
    },
    
        activate: function() {
        var activated = OpenLayers.Control.prototype.activate.call(this);
        if(activated) {
            if(!this.source) {
                if(!this.handler) {
                    this.handler = new OpenLayers.Handler.Path(this,
                        {done: function(geometry) {
                            this.onSketchComplete({
                                feature: new OpenLayers.Feature.Vector(geometry)
                            });
                        }},
                        {layerOptions: this.sourceOptions}
                    );
                }
                this.handler.activate();
            } else if(this.source.events) {
                this.source.events.on({
                    sketchcomplete: this.onSketchComplete,
                    afterfeaturemodified: this.afterFeatureModified,
                    scope: this
                });
            }
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Control.prototype.deactivate.call(this);
        if(deactivated) {
            if(this.source && this.source.events) {
                this.source.events.un({
                    sketchcomplete: this.onSketchComplete,
                    afterfeaturemodified: this.afterFeatureModified,
                    scope: this
                });
            }
        }
        return deactivated;
    },
    
        onSketchComplete: function(event) {
        this.feature = null;
        return !this.considerSplit(event.feature);
    },
    
        afterFeatureModified: function(event) {
        if(event.modified) {
            var feature = event.feature;
            if (typeof feature.geometry.split === "function") {
                this.feature = event.feature;
                this.considerSplit(event.feature);
            }
        }
    },
    
        removeByGeometry: function(features, geometry) {
        for(var i=0, len=features.length; i<len; ++i) {
            if(features[i].geometry === geometry) {
                features.splice(i, 1);
                break;
            }
        }
    },
    
        isEligible: function(target) {
        if (!target.geometry) {
            return false;
        } else {
            return (
                target.state !== OpenLayers.State.DELETE
            ) && (
                typeof target.geometry.split === "function"
            ) && (
                this.feature !== target
            ) && (
                !this.targetFilter ||
                this.targetFilter.evaluate(target.attributes)
            );
        }
    },

        considerSplit: function(feature) {
        var sourceSplit = false;
        var targetSplit = false;
        if(!this.sourceFilter ||
           this.sourceFilter.evaluate(feature.attributes)) {
            var features = this.layer && this.layer.features || [];
            var target, results, proceed;
            var additions = [], removals = [];
            var mutual = (this.layer === this.source) && this.mutual;
            var options = {
                edge: this.edge,
                tolerance: this.tolerance,
                mutual: mutual
            };
            var sourceParts = [feature.geometry];
            var targetFeature, targetParts;
            var source, parts;
            for(var i=0, len=features.length; i<len; ++i) {
                targetFeature = features[i];
                if(this.isEligible(targetFeature)) {
                    targetParts = [targetFeature.geometry];
                    for(var j=0; j<sourceParts.length; ++j) { 
                        source = sourceParts[j];
                        for(var k=0; k<targetParts.length; ++k) {
                            target = targetParts[k];
                            if(source.getBounds().intersectsBounds(target.getBounds())) {
                                results = source.split(target, options);
                                if(results) {
                                    proceed = this.events.triggerEvent(
                                        "beforesplit", {source: feature, target: targetFeature}
                                    );
                                    if(proceed !== false) {
                                        if(mutual) {
                                            parts = results[0];
                                            if(parts.length > 1) {
                                                parts.unshift(j, 1); // add args for splice below
                                                Array.prototype.splice.apply(sourceParts, parts);
                                                j += parts.length - 3;
                                            }
                                            results = results[1];
                                        }
                                        if(results.length > 1) {
                                            results.unshift(k, 1); // add args for splice below
                                            Array.prototype.splice.apply(targetParts, results);
                                            k += results.length - 3;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(targetParts && targetParts.length > 1) {
                        this.geomsToFeatures(targetFeature, targetParts);
                        this.events.triggerEvent("split", {
                            original: targetFeature,
                            features: targetParts
                        });
                        Array.prototype.push.apply(additions, targetParts);
                        removals.push(targetFeature);
                        targetSplit = true;
                    }
                }
            }
            if(sourceParts && sourceParts.length > 1) {
                this.geomsToFeatures(feature, sourceParts);
                this.events.triggerEvent("split", {
                    original: feature,
                    features: sourceParts
                });
                Array.prototype.push.apply(additions, sourceParts);
                removals.push(feature);
                sourceSplit = true;
            }
            if(sourceSplit || targetSplit) {
                if(this.deferDelete) {
                    var feat, destroys = [];
                    for(var i=0, len=removals.length; i<len; ++i) {
                        feat = removals[i];
                        if(feat.state === OpenLayers.State.INSERT) {
                            destroys.push(feat);
                        } else {
                            feat.state = OpenLayers.State.DELETE;
                            this.layer.drawFeature(feat);
                        }
                    }
                    this.layer.destroyFeatures(destroys, {silent: true});
                    for(var i=0, len=additions.length; i<len; ++i) {
                        additions[i].state = OpenLayers.State.INSERT;
                    }
                } else {
                    this.layer.destroyFeatures(removals, {silent: true});
                }
                this.layer.addFeatures(additions, {silent: true});
                this.events.triggerEvent("aftersplit", {
                    source: feature,
                    features: additions
                });
            }
        }
        return sourceSplit;
    },
    
        geomsToFeatures: function(feature, geoms) {
        var clone = feature.clone();
        delete clone.geometry;
        var newFeature;
        for(var i=0, len=geoms.length; i<len; ++i) {
            newFeature = clone.clone();
            newFeature.geometry = geoms[i];
            newFeature.state = OpenLayers.State.INSERT;
            geoms[i] = newFeature;
        }
    },
    
        destroy: function() {
        if(this.active) {
            this.deactivate(); // TODO: this should be handled by the super
        }
        OpenLayers.Control.prototype.destroy.call(this);
    },

    CLASS_NAME: "OpenLayers.Control.Split"
});
