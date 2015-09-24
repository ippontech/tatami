/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy.Filter = OpenLayers.Class(OpenLayers.Strategy, {
    
        filter: null,
    
        cache: null,
    
        caching: false,
    
    
        activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.apply(this, arguments);
        if (activated) {
            this.cache = [];
            this.layer.events.on({
                "beforefeaturesadded": this.handleAdd,
                "beforefeaturesremoved": this.handleRemove,
                scope: this
            });
        }
        return activated;
    },
    
        deactivate: function() {
        this.cache = null;
        if (this.layer && this.layer.events) {
            this.layer.events.un({
                "beforefeaturesadded": this.handleAdd,
                "beforefeaturesremoved": this.handleRemove,
                scope: this
            });            
        }
        return OpenLayers.Strategy.prototype.deactivate.apply(this, arguments);
    },
    
        handleAdd: function(event) {
        if (!this.caching && this.filter) {
            var features = event.features;
            event.features = [];
            var feature;
            for (var i=0, ii=features.length; i<ii; ++i) {
                feature = features[i];
                if (this.filter.evaluate(feature)) {
                    event.features.push(feature);
                } else {
                    this.cache.push(feature);
                }
            }
        }
    },
    
        handleRemove: function(event) {
        if (!this.caching) {
            this.cache = [];
        }
    },

        setFilter: function(filter) {
        this.filter = filter;
        var previousCache = this.cache;
        this.cache = [];
        this.handleAdd({features: this.layer.features});
        if (this.cache.length > 0) {
            this.caching = true;
            this.layer.removeFeatures(this.cache.slice());
            this.caching = false;
        }
        if (previousCache.length > 0) {
            var event = {features: previousCache};
            this.handleAdd(event);
            if (event.features.length > 0) {
                this.caching = true;
                this.layer.addFeatures(event.features);
                this.caching = false;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Strategy.Filter"

});
