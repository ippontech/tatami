/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy = OpenLayers.Class({
    
        layer: null,
    
        options: null,

        active: null,

        autoActivate: true,

        autoDestroy: true,

        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        this.options = options;
        this.active = false;
    },
    
        destroy: function() {
        this.deactivate();
        this.layer = null;
        this.options = null;
    },

        setLayer: function(layer) {
        this.layer = layer;
    },
    
        activate: function() {
        if (!this.active) {
            this.active = true;
            return true;
        }
        return false;
    },
    
        deactivate: function() {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    },
   
    CLASS_NAME: "OpenLayers.Strategy" 
});
