/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Tile = OpenLayers.Class({
    
        events: null,

        eventListeners: null,

        id: null,
    
        layer: null,
    
        url: null,

        bounds: null,
    
        size: null,
    
        isLoading: false,
    
    
        unload: function() {
       if (this.isLoading) { 
           this.isLoading = false; 
           this.events.triggerEvent("unload"); 
       }
    },
    
        destroy:function() {
        this.layer  = null;
        this.bounds = null;
        this.size = null;
        this.position = null;
        
        if (this.eventListeners) {
            this.events.un(this.eventListeners);
        }
        this.events.destroy();
        this.eventListeners = null;
        this.events = null;
    },
    
        draw: function(force) {
        if (!force) {
            this.clear();
        }
        var draw = this.shouldDraw();
        if (draw && !force && this.events.triggerEvent("beforedraw") === false) {
            draw = null;
        }
        return draw;
    },
    
        shouldDraw: function() {        
        var withinMaxExtent = false,
            maxExtent = this.layer.maxExtent;
        if (maxExtent) {
            var map = this.layer.map;
            var worldBounds = map.baseLayer.wrapDateLine && map.getMaxExtent();
            if (this.bounds.intersectsBounds(maxExtent, {inclusive: false, worldBounds: worldBounds})) {
                withinMaxExtent = true;
            }
        }
        
        return withinMaxExtent || this.layer.displayOutsideMaxExtent;
    },
    
        setBounds: function(bounds) {
        bounds = bounds.clone();
        if (this.layer.map.baseLayer.wrapDateLine) {
            var worldExtent = this.layer.map.getMaxExtent(),
                tolerance = this.layer.map.getResolution();
            bounds = bounds.wrapDateLine(worldExtent, {
                leftTolerance: tolerance,
                rightTolerance: tolerance
            });
        }
        this.bounds = bounds;
    },
    
        moveTo: function (bounds, position, redraw) {
        if (redraw == null) {
            redraw = true;
        }

        this.setBounds(bounds);
        this.position = position.clone();
        if (redraw) {
            this.draw();
        }
    },

        clear: function(draw) {
    },
    
    CLASS_NAME: "OpenLayers.Tile"
});
