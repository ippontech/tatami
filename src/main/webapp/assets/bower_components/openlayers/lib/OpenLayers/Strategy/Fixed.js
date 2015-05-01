/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy.Fixed = OpenLayers.Class(OpenLayers.Strategy, {
    
        preload: false,

    
        activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.apply(this, arguments);
        if(activated) {
            this.layer.events.on({
                "refresh": this.load,
                scope: this
            });
            if(this.layer.visibility == true || this.preload) {
                this.load();
            } else {
                this.layer.events.on({
                    "visibilitychanged": this.load,
                    scope: this
                });
            }
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            this.layer.events.un({
                "refresh": this.load,
                "visibilitychanged": this.load,
                scope: this
            });
        }
        return deactivated;
    },

        load: function(options) {
        var layer = this.layer;
        layer.events.triggerEvent("loadstart", {filter: layer.filter});
        layer.protocol.read(OpenLayers.Util.applyDefaults({
            callback: this.merge,
            filter: layer.filter,
            scope: this
        }, options));
        layer.events.un({
            "visibilitychanged": this.load,
            scope: this
        });
    },

        merge: function(resp) {
        var layer = this.layer;
        layer.destroyFeatures();
        var features = resp.features;
        if (features && features.length > 0) {
            var remote = layer.projection;
            var local = layer.map.getProjectionObject();
            if(!local.equals(remote)) {
                var geom;
                for(var i=0, len=features.length; i<len; ++i) {
                    geom = features[i].geometry;
                    if(geom) {
                        geom.transform(remote, local);
                    }
                }
            }
            layer.addFeatures(features);
        }
        layer.events.triggerEvent("loadend", {response: resp});
    },

    CLASS_NAME: "OpenLayers.Strategy.Fixed"
});
