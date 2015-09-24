/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.Vector.RootContainer = OpenLayers.Class(OpenLayers.Layer.Vector, {
    
        displayInLayerSwitcher: false,
    
        layers: null,
    
        
        display: function() {},
    
        getFeatureFromEvent: function(evt) {
        var layers = this.layers;
        var feature;
        for(var i=0; i<layers.length; i++) {
            feature = layers[i].getFeatureFromEvent(evt);
            if(feature) {
                return feature;
            }
        }
    },
    
        setMap: function(map) {
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
        this.collectRoots();
        map.events.register("changelayer", this, this.handleChangeLayer);
    },
    
        removeMap: function(map) {
        map.events.unregister("changelayer", this, this.handleChangeLayer);
        this.resetRoots();
        OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments);
    },
    
        collectRoots: function() {
        var layer;
        for(var i=0; i<this.map.layers.length; ++i) {
            layer = this.map.layers[i];
            if(OpenLayers.Util.indexOf(this.layers, layer) != -1) {
                layer.renderer.moveRoot(this.renderer);
            }
        }
    },
    
        resetRoots: function() {
        var layer;
        for(var i=0; i<this.layers.length; ++i) {
            layer = this.layers[i];
            if(this.renderer && layer.renderer.getRenderLayerId() == this.id) {
                this.renderer.moveRoot(layer.renderer);
            }
        }
    },
    
        handleChangeLayer: function(evt) {
        var layer = evt.layer;
        if(evt.property == "order" &&
                        OpenLayers.Util.indexOf(this.layers, layer) != -1) {
            this.resetRoots();
            this.collectRoots();
        }
    },

    CLASS_NAME: "OpenLayers.Layer.Vector.RootContainer"
});
