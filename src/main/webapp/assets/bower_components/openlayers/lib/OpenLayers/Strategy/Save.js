/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy.Save = OpenLayers.Class(OpenLayers.Strategy, {
    
     
        events: null,
    
        auto: false,
    
        timer: null,

        initialize: function(options) {
        OpenLayers.Strategy.prototype.initialize.apply(this, [options]);
        this.events = new OpenLayers.Events(this);
    },
   
        activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.call(this);
        if(activated) {
            if(this.auto) {
                if(typeof this.auto === "number") {
                    this.timer = window.setInterval(
                        OpenLayers.Function.bind(this.save, this),
                        this.auto * 1000
                    );
                } else {
                    this.layer.events.on({
                        "featureadded": this.triggerSave,
                        "afterfeaturemodified": this.triggerSave,
                        scope: this
                    });
                }
            }
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            if(this.auto) {
                if(typeof this.auto === "number") {
                    window.clearInterval(this.timer);
                } else {
                    this.layer.events.un({
                        "featureadded": this.triggerSave,
                        "afterfeaturemodified": this.triggerSave,
                        scope: this
                    });
                }
            }
        }
        return deactivated;
    },
    
        triggerSave: function(event) {
        var feature = event.feature;
        if(feature.state === OpenLayers.State.INSERT ||
           feature.state === OpenLayers.State.UPDATE ||
           feature.state === OpenLayers.State.DELETE) {
            this.save([event.feature]);
        }
    },
    
        save: function(features) {
        if(!features) {
            features = this.layer.features;
        }
        this.events.triggerEvent("start", {features:features});
        var remote = this.layer.projection;
        var local = this.layer.map.getProjectionObject();
        if(!local.equals(remote)) {
            var len = features.length;
            var clones = new Array(len);
            var orig, clone;
            for(var i=0; i<len; ++i) {
                orig = features[i];
                clone = orig.clone();
                clone.fid = orig.fid;
                clone.state = orig.state;
                if(orig.url) {
                    clone.url = orig.url;
                }
                clone._original = orig;
                clone.geometry.transform(local, remote);
                clones[i] = clone;
            }
            features = clones;
        }
        this.layer.protocol.commit(features, {
            callback: this.onCommit,
            scope: this
        });
    },
    
        onCommit: function(response) {
        var evt = {"response": response};
        if(response.success()) {
            var features = response.reqFeatures;
            var state, feature;
            var destroys = [];
            var insertIds = response.insertIds || [];
            var j = 0;
            for(var i=0, len=features.length; i<len; ++i) {
                feature = features[i];
                feature = feature._original || feature;
                state = feature.state;
                if(state) {
                    if(state == OpenLayers.State.DELETE) {
                        destroys.push(feature);
                    } else if(state == OpenLayers.State.INSERT) {
                        feature.fid = insertIds[j];
                        ++j;
                    }
                    feature.state = null;
                }
            }

            if(destroys.length > 0) {
                this.layer.destroyFeatures(destroys);
            }

            this.events.triggerEvent("success", evt);

        } else {
            this.events.triggerEvent("fail", evt);
        }
    },
   
    CLASS_NAME: "OpenLayers.Strategy.Save" 
});
