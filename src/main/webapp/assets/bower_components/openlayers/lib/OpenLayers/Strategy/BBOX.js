/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy.BBOX = OpenLayers.Class(OpenLayers.Strategy, {
    
        bounds: null,
    
        ratio: 2,

        response: null,

        
        activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.call(this);
        if(activated) {
            this.layer.events.on({
                "moveend": this.update,
                "refresh": this.update,
                "visibilitychanged": this.update,
                scope: this
            });
            this.update();
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            this.layer.events.un({
                "moveend": this.update,
                "refresh": this.update,
                "visibilitychanged": this.update,
                scope: this
            });
        }
        return deactivated;
    },

        update: function(options) {
        var mapBounds = this.getMapBounds();
        if (mapBounds !== null && ((options && options.force) ||
          (this.layer.visibility && this.layer.calculateInRange() && this.invalidBounds(mapBounds)))) {
            this.calculateBounds(mapBounds);
            this.resolution = this.layer.map.getResolution(); 
            this.triggerRead(options);
        }
    },
    
        getMapBounds: function() {
        if (this.layer.map === null) {
            return null;
        }
        var bounds = this.layer.map.getExtent();
        if (bounds && this.layer.projection && !this.layer.projection.equals(
                this.layer.map.getProjectionObject())) {
            bounds = bounds.clone().transform(
                this.layer.map.getProjectionObject(), this.layer.projection
            );
        }
        return bounds;
    },

        invalidBounds: function(mapBounds) {
        if(!mapBounds) {
            mapBounds = this.getMapBounds();
        }
        var invalid = !this.bounds || !this.bounds.containsBounds(mapBounds);
        if(!invalid && this.resFactor) {
            var ratio = this.resolution / this.layer.map.getResolution();
            invalid = (ratio >= this.resFactor || ratio <= (1 / this.resFactor));
        }
        return invalid;
    },
 
        calculateBounds: function(mapBounds) {
        if(!mapBounds) {
            mapBounds = this.getMapBounds();
        }
        var center = mapBounds.getCenterLonLat();
        var dataWidth = mapBounds.getWidth() * this.ratio;
        var dataHeight = mapBounds.getHeight() * this.ratio;
        this.bounds = new OpenLayers.Bounds(
            center.lon - (dataWidth / 2),
            center.lat - (dataHeight / 2),
            center.lon + (dataWidth / 2),
            center.lat + (dataHeight / 2)
        );
    },
    
        triggerRead: function(options) {
        if (this.response && !(options && options.noAbort === true)) {
            this.layer.protocol.abort(this.response);
            this.layer.events.triggerEvent("loadend");
        }
        var evt = {filter: this.createFilter()};
        this.layer.events.triggerEvent("loadstart", evt);
        this.response = this.layer.protocol.read(
            OpenLayers.Util.applyDefaults({
                filter: evt.filter,
                callback: this.merge,
                scope: this
        }, options));
    },
 
        createFilter: function() {
        var filter = new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.bounds,
            projection: this.layer.projection
        });
        if (this.layer.filter) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [this.layer.filter, filter]
            });
        }
        return filter;
    },
   
        merge: function(resp) {
        this.layer.destroyFeatures();
        if (resp.success()) {
            var features = resp.features;
            if(features && features.length > 0) {
                var remote = this.layer.projection;
                var local = this.layer.map.getProjectionObject();
                if(remote && local && !local.equals(remote)) {
                    var geom;
                    for(var i=0, len=features.length; i<len; ++i) {
                        geom = features[i].geometry;
                        if(geom) {
                            geom.transform(remote, local);
                        }
                    }
                }
                this.layer.addFeatures(features);
            }
        } else {
            this.bounds = null;
        }
        this.response = null;
        this.layer.events.triggerEvent("loadend", {response: resp});
    },
   
    CLASS_NAME: "OpenLayers.Strategy.BBOX" 
});
