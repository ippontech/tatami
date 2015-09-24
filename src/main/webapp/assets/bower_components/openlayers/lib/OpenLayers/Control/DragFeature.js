/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Control.DragFeature = OpenLayers.Class(OpenLayers.Control, {

        geometryTypes: null,
    
        onStart: function(feature, pixel) {},

        onDrag: function(feature, pixel) {},

        onComplete: function(feature, pixel) {},

        onEnter: function(feature) {},

        onLeave: function(feature) {},

        documentDrag: false,
    
        layer: null,
    
        feature: null,

        dragCallbacks: {},

        featureCallbacks: {},
    
        lastPixel: null,

        initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        this.handlers = {
            drag: new OpenLayers.Handler.Drag(
                this, OpenLayers.Util.extend({
                    down: this.downFeature,
                    move: this.moveFeature,
                    up: this.upFeature,
                    out: this.cancel,
                    done: this.doneDragging
                }, this.dragCallbacks), {
                    documentDrag: this.documentDrag
                }
            ),
            feature: new OpenLayers.Handler.Feature(
                this, this.layer, OpenLayers.Util.extend({
                    click: this.clickFeature,
                    clickout: this.clickoutFeature,
                    over: this.overFeature,
                    out: this.outFeature
                }, this.featureCallbacks),
                {geometryTypes: this.geometryTypes}
            )
        };
    },

        clickFeature: function(feature) {
        if (this.handlers.feature.touch && !this.over && this.overFeature(feature)) {
            this.handlers.drag.dragstart(this.handlers.feature.evt);
            this.handlers.drag.stopDown = false;
        }
    },

        clickoutFeature: function(feature) {
        if (this.handlers.feature.touch && this.over) {
            this.outFeature(feature);
            this.handlers.drag.stopDown = true;
        }
    },

        destroy: function() {
        this.layer = null;
        OpenLayers.Control.prototype.destroy.apply(this, []);
    },

        activate: function() {
        return (this.handlers.feature.activate() &&
                OpenLayers.Control.prototype.activate.apply(this, arguments));
    },

        deactivate: function() {
        this.handlers.drag.deactivate();
        this.handlers.feature.deactivate();
        this.feature = null;
        this.dragging = false;
        this.lastPixel = null;
        OpenLayers.Element.removeClass(
            this.map.viewPortDiv, this.displayClass + "Over"
        );
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },

        overFeature: function(feature) {
        var activated = false;
        if(!this.handlers.drag.dragging) {
            this.feature = feature;
            this.handlers.drag.activate();
            activated = true;
            this.over = true;
            OpenLayers.Element.addClass(this.map.viewPortDiv, this.displayClass + "Over");
            this.onEnter(feature);
        } else {
            if(this.feature.id == feature.id) {
                this.over = true;
            } else {
                this.over = false;
            }
        }
        return activated;
    },

        downFeature: function(pixel) {
        this.lastPixel = pixel;
        this.onStart(this.feature, pixel);
    },

        moveFeature: function(pixel) {
        var res = this.map.getResolution();
        this.feature.geometry.move(res * (pixel.x - this.lastPixel.x),
                                   res * (this.lastPixel.y - pixel.y));
        this.layer.drawFeature(this.feature);
        this.lastPixel = pixel;
        this.onDrag(this.feature, pixel);
    },

        upFeature: function(pixel) {
        if(!this.over) {
            this.handlers.drag.deactivate();
        }
    },

        doneDragging: function(pixel) {
        this.onComplete(this.feature, pixel);
    },

        outFeature: function(feature) {
        if(!this.handlers.drag.dragging) {
            this.over = false;
            this.handlers.drag.deactivate();
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, this.displayClass + "Over"
            );
            this.onLeave(feature);
            this.feature = null;
        } else {
            if(this.feature.id == feature.id) {
                this.over = false;
            }
        }
    },
        
        cancel: function() {
        this.handlers.drag.deactivate();
        this.over = false;
    },

        setMap: function(map) {
        this.handlers.drag.setMap(map);
        this.handlers.feature.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Control.DragFeature"
});
