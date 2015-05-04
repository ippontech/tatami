/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy.Paging = OpenLayers.Class(OpenLayers.Strategy, {
    
        features: null,
    
        length: 10,
    
        num: null,
    
        paging: false,

        
        activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.call(this);
        if(activated) {
            this.layer.events.on({
                "beforefeaturesadded": this.cacheFeatures,
                scope: this
            });
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            this.clearCache();
            this.layer.events.un({
                "beforefeaturesadded": this.cacheFeatures,
                scope: this
            });
        }
        return deactivated;
    },
    
        cacheFeatures: function(event) {
        if(!this.paging) {
            this.clearCache();
            this.features = event.features;
            this.pageNext(event);
        }
    },
    
        clearCache: function() {
        if(this.features) {
            for(var i=0; i<this.features.length; ++i) {
                this.features[i].destroy();
            }
        }
        this.features = null;
        this.num = null;
    },
    
        pageCount: function() {
        var numFeatures = this.features ? this.features.length : 0;
        return Math.ceil(numFeatures / this.length);
    },

        pageNum: function() {
        return this.num;
    },

        pageLength: function(newLength) {
        if(newLength && newLength > 0) {
            this.length = newLength;
        }
        return this.length;
    },

        pageNext: function(event) {
        var changed = false;
        if(this.features) {
            if(this.num === null) {
                this.num = -1;
            }
            var start = (this.num + 1) * this.length;
            changed = this.page(start, event);
        }
        return changed;
    },

        pagePrevious: function() {
        var changed = false;
        if(this.features) {
            if(this.num === null) {
                this.num = this.pageCount();
            }
            var start = (this.num - 1) * this.length;
            changed = this.page(start);
        }
        return changed;
    },
    
        page: function(start, event) {
        var changed = false;
        if(this.features) {
            if(start >= 0 && start < this.features.length) {
                var num = Math.floor(start / this.length);
                if(num != this.num) {
                    this.paging = true;
                    var features = this.features.slice(start, start + this.length);
                    this.layer.removeFeatures(this.layer.features);
                    this.num = num;
                    if(event && event.features) {
                        event.features = features;
                    } else {
                        this.layer.addFeatures(features);
                    }
                    this.paging = false;
                    changed = true;
                }
            }
        }
        return changed;
    },
    
    CLASS_NAME: "OpenLayers.Strategy.Paging" 
});
