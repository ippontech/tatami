/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Control.DrawFeature = OpenLayers.Class(OpenLayers.Control, {
    
        layer: null,

        callbacks: null,
    
        
        multi: false,

        featureAdded: function() {},

        
        initialize: function(layer, handler, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.callbacks = OpenLayers.Util.extend(
            {
                done: this.drawFeature,
                modify: function(vertex, feature) {
                    this.layer.events.triggerEvent(
                        "sketchmodified", {vertex: vertex, feature: feature}
                    );
                },
                create: function(vertex, feature) {
                    this.layer.events.triggerEvent(
                        "sketchstarted", {vertex: vertex, feature: feature}
                    );
                }
            },
            this.callbacks
        );
        this.layer = layer;
        this.handlerOptions = this.handlerOptions || {};
        this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(
            this.handlerOptions.layerOptions, {
                renderers: layer.renderers, rendererOptions: layer.rendererOptions
            }
        );
        if (!("multi" in this.handlerOptions)) {
            this.handlerOptions.multi = this.multi;
        }
        var sketchStyle = this.layer.styleMap && this.layer.styleMap.styles.temporary;
        if(sketchStyle) {
            this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(
                this.handlerOptions.layerOptions,
                {styleMap: new OpenLayers.StyleMap({"default": sketchStyle})}
            );
        }
        this.handler = new handler(this, this.callbacks, this.handlerOptions);
    },

        drawFeature: function(geometry) {
        var feature = new OpenLayers.Feature.Vector(geometry);
        var proceed = this.layer.events.triggerEvent(
            "sketchcomplete", {feature: feature}
        );
        if(proceed !== false) {
            feature.state = OpenLayers.State.INSERT;
            this.layer.addFeatures([feature]);
            this.featureAdded(feature);
            this.events.triggerEvent("featureadded",{feature : feature});
        }
    },
    
        insertXY: function(x, y) {
        if (this.handler && this.handler.line) {
            this.handler.insertXY(x, y);
        }
    },

        insertDeltaXY: function(dx, dy) {
        if (this.handler && this.handler.line) {
            this.handler.insertDeltaXY(dx, dy);
        }
    },

        insertDirectionLength: function(direction, length) {
        if (this.handler && this.handler.line) {
            this.handler.insertDirectionLength(direction, length);
        }
    },

        insertDeflectionLength: function(deflection, length) {
        if (this.handler && this.handler.line) {
            this.handler.insertDeflectionLength(deflection, length);
        }
    },
    
        undo: function() {
        return this.handler.undo && this.handler.undo();
    },
    
        redo: function() {
        return this.handler.redo && this.handler.redo();
    },
    
        finishSketch: function() {
        this.handler.finishGeometry();
    },

        cancel: function() {
        this.handler.cancel();
    },

    CLASS_NAME: "OpenLayers.Control.DrawFeature"
});
