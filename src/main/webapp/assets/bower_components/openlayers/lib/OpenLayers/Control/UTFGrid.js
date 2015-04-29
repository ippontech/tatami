/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.UTFGrid = OpenLayers.Class(OpenLayers.Control, {
    
        autoActivate: true,

        layers: null,

    /* Property: defaultHandlerOptions
     * The default opts passed to the handler constructors
     */
    defaultHandlerOptions: {
        'delay': 300,
        'pixelTolerance': 4,
        'stopMove': false,
        'single': true,
        'double': false,
        'stopSingle': false,
        'stopDouble': false
    },

    /* APIProperty: handlerMode
     * Defaults to 'click'. Can be 'hover' or 'move'.
     */
    handlerMode: 'click',

        setHandler: function(hm) {
        this.handlerMode = hm;
        this.resetHandler();
    },

        resetHandler: function() {
        if (this.handler) {
            this.handler.deactivate();
            this.handler.destroy();
            this.handler = null;
        }
   
        if (this.handlerMode == 'hover') {
            this.handler = new OpenLayers.Handler.Hover(
                this,
                {'pause': this.handleEvent, 'move': this.reset},
                this.handlerOptions
            );
        } else if (this.handlerMode == 'click') {
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.handleEvent
                }, this.handlerOptions
            );
        } else if (this.handlerMode == 'move') {
            this.handler = new OpenLayers.Handler.Hover(
                this,
                {'pause': this.handleEvent, 'move': this.handleEvent},
                this.handlerOptions
            );
        }
        if (this.handler) {
            return true;
        } else {
            return false;
        }
    },

        initialize: function(options) {
        options = options || {};
        options.handlerOptions = options.handlerOptions || this.defaultHandlerOptions;
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.resetHandler();
    }, 

        handleEvent: function(evt) {
        if (evt == null) {
            this.reset();
            return;
        }

        var lonLat = this.map.getLonLatFromPixel(evt.xy);
        if (!lonLat) { 
            return;
        }    
        
        var layers = this.findLayers();
        if (layers.length > 0) {
            var infoLookup = {};
            var layer, idx;
            for (var i=0, len=layers.length; i<len; i++) {
                layer = layers[i];
                idx = OpenLayers.Util.indexOf(this.map.layers, layer);
                infoLookup[idx] = layer.getFeatureInfo(lonLat);
            }
            this.callback(infoLookup, lonLat, evt.xy);
        }
    },

        callback: function(infoLookup) {
    },

        reset: function(evt) {
        this.callback(null);
    },

        findLayers: function() {
        var candidates = this.layers || this.map.layers;
        var layers = [];
        var layer;
        for (var i=candidates.length-1; i>=0; --i) {
            layer = candidates[i];
            if (layer instanceof OpenLayers.Layer.UTFGrid ) { 
                layers.push(layer);
            }
        }
        return layers;
    },

    CLASS_NAME: "OpenLayers.Control.UTFGrid"
});
