/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Strategy.Refresh = OpenLayers.Class(OpenLayers.Strategy, {
    
        force: false,

        interval: 0,
    
        timer: null,

       
        activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.call(this);
        if(activated) {
            if(this.layer.visibility === true) {
                this.start();
            } 
            this.layer.events.on({
                "visibilitychanged": this.reset,
                scope: this
            });
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            this.stop();
            this.layer.events.un({
                "visibilitychanged": this.reset,
                scope: this
            });
        }
        return deactivated;
    },
    
        reset: function() {
        if(this.layer.visibility === true) {
            this.start();
        } else {
            this.stop();
        }
    },
    
        start: function() {
        if(this.interval && typeof this.interval === "number" && 
            this.interval > 0) {

            this.timer = window.setInterval(
                OpenLayers.Function.bind(this.refresh, this),
                this.interval);
        }
    },
    
        refresh: function() {
        if (this.layer && this.layer.refresh && 
            typeof this.layer.refresh == "function") {

            this.layer.refresh({force: this.force});
        }
    },
   
        stop: function() {
        if(this.timer !== null) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    },
    
    CLASS_NAME: "OpenLayers.Strategy.Refresh" 
});
