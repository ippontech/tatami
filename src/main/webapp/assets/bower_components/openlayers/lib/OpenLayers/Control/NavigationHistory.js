/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.NavigationHistory = OpenLayers.Class(OpenLayers.Control, {

        type: OpenLayers.Control.TYPE_TOGGLE,

        previous: null,
    
        previousOptions: null,
    
        next: null,

        nextOptions: null,

        limit: 50,

        autoActivate: true,

        clearOnDeactivate: false,

        registry: null,

        nextStack: null,

        previousStack: null,
    
        listeners: null,
    
        restoring: false,
    
        initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        this.registry = OpenLayers.Util.extend({
            "moveend": this.getState
        }, this.registry);
        
        var previousOptions = {
            trigger: OpenLayers.Function.bind(this.previousTrigger, this),
            displayClass: this.displayClass + " " + this.displayClass + "Previous"
        };
        OpenLayers.Util.extend(previousOptions, this.previousOptions);
        this.previous = new OpenLayers.Control.Button(previousOptions);
        
        var nextOptions = {
            trigger: OpenLayers.Function.bind(this.nextTrigger, this),
            displayClass: this.displayClass + " " + this.displayClass + "Next"
        };
        OpenLayers.Util.extend(nextOptions, this.nextOptions);
        this.next = new OpenLayers.Control.Button(nextOptions);

        this.clear();
    },
    
        onPreviousChange: function(state, length) {
        if(state && !this.previous.active) {
            this.previous.activate();
        } else if(!state && this.previous.active) {
            this.previous.deactivate();
        }
    },
    
        onNextChange: function(state, length) {
        if(state && !this.next.active) {
            this.next.activate();
        } else if(!state && this.next.active) {
            this.next.deactivate();
        }
    },
    
        destroy: function() {
        OpenLayers.Control.prototype.destroy.apply(this);
        this.previous.destroy();
        this.next.destroy();
        this.deactivate();
        for(var prop in this) {
            this[prop] = null;
        }
    },
    
        setMap: function(map) {
        this.map = map;
        this.next.setMap(map);
        this.previous.setMap(map);
    },

        draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.next.draw();
        this.previous.draw();
    },
    
        previousTrigger: function() {
        var current = this.previousStack.shift();
        var state = this.previousStack.shift();
        if(state != undefined) {
            this.nextStack.unshift(current);
            this.previousStack.unshift(state);
            this.restoring = true;
            this.restore(state);
            this.restoring = false;
            this.onNextChange(this.nextStack[0], this.nextStack.length);
            this.onPreviousChange(
                this.previousStack[1], this.previousStack.length - 1
            );
        } else {
            this.previousStack.unshift(current);
        }
        return state;
    },
    
        nextTrigger: function() {
        var state = this.nextStack.shift();
        if(state != undefined) {
            this.previousStack.unshift(state);
            this.restoring = true;
            this.restore(state);
            this.restoring = false;
            this.onNextChange(this.nextStack[0], this.nextStack.length);
            this.onPreviousChange(
                this.previousStack[1], this.previousStack.length - 1
            );
        }
        return state;
    },
    
        clear: function() {
        this.previousStack = [];
        this.previous.deactivate();
        this.nextStack = [];
        this.next.deactivate();
    },

        getState: function() {
        return {
            center: this.map.getCenter(),
            resolution: this.map.getResolution(),
            projection: this.map.getProjectionObject(),
            units: this.map.getProjectionObject().getUnits() || 
                this.map.units || this.map.baseLayer.units
        };
    },

        restore: function(state) {
        var center, zoom;
        if (this.map.getProjectionObject() == state.projection) { 
            zoom = this.map.getZoomForResolution(state.resolution);
            center = state.center;
        } else {
            center = state.center.clone();
            center.transform(state.projection, this.map.getProjectionObject());
            var sourceUnits = state.units;
            var targetUnits = this.map.getProjectionObject().getUnits() || 
                this.map.units || this.map.baseLayer.units;
            var resolutionFactor = sourceUnits && targetUnits ? 
                OpenLayers.INCHES_PER_UNIT[sourceUnits] / OpenLayers.INCHES_PER_UNIT[targetUnits] : 1;
            zoom = this.map.getZoomForResolution(resolutionFactor*state.resolution); 
        }
        this.map.setCenter(center, zoom);
    },
    
        setListeners: function() {
        this.listeners = {};
        for(var type in this.registry) {
            this.listeners[type] = OpenLayers.Function.bind(function() {
                if(!this.restoring) {
                    var state = this.registry[type].apply(this, arguments);
                    this.previousStack.unshift(state);
                    if(this.previousStack.length > 1) {
                        this.onPreviousChange(
                            this.previousStack[1], this.previousStack.length - 1
                        );
                    }
                    if(this.previousStack.length > (this.limit + 1)) {
                        this.previousStack.pop();
                    }
                    if(this.nextStack.length > 0) {
                        this.nextStack = [];
                        this.onNextChange(null, 0);
                    }
                }
                return true;
            }, this);
        }
    },

        activate: function() {
        var activated = false;
        if(this.map) {
            if(OpenLayers.Control.prototype.activate.apply(this)) {
                if(this.listeners == null) {
                    this.setListeners();
                }
                for(var type in this.listeners) {
                    this.map.events.register(type, this, this.listeners[type]);
                }
                activated = true;
                if(this.previousStack.length == 0) {
                    this.initStack();
                }
            }
        }
        return activated;
    },
    
        initStack: function() {
        if(this.map.getCenter()) {
            this.listeners.moveend();
        }
    },
    
        deactivate: function() {
        var deactivated = false;
        if(this.map) {
            if(OpenLayers.Control.prototype.deactivate.apply(this)) {
                for(var type in this.listeners) {
                    this.map.events.unregister(
                        type, this, this.listeners[type]
                    );
                }
                if(this.clearOnDeactivate) {
                    this.clear();
                }
                deactivated = true;
            }
        }
        return deactivated;
    },
    
    CLASS_NAME: "OpenLayers.Control.NavigationHistory"
});

