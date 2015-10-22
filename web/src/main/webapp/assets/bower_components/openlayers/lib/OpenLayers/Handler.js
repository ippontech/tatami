/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler = OpenLayers.Class({

        id: null,
        
        control: null,

        map: null,

        keyMask: null,

        active: false,
    
        evt: null,
    
        touch: false,

        initialize: function(control, callbacks, options) {
        OpenLayers.Util.extend(this, options);
        this.control = control;
        this.callbacks = callbacks;

        var map = this.map || control.map;
        if (map) {
            this.setMap(map); 
        }
        
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    
        setMap: function (map) {
        this.map = map;
    },

        checkModifiers: function (evt) {
        if(this.keyMask == null) {
            return true;
        }
        /* calculate the keyboard modifier mask for this event */
        var keyModifiers =
            (evt.shiftKey ? OpenLayers.Handler.MOD_SHIFT : 0) |
            (evt.ctrlKey  ? OpenLayers.Handler.MOD_CTRL  : 0) |
            (evt.altKey   ? OpenLayers.Handler.MOD_ALT   : 0) |
            (evt.metaKey  ? OpenLayers.Handler.MOD_META  : 0);
    
        /* if it differs from the handler object's key mask,
           bail out of the event handler */
        return (keyModifiers == this.keyMask);
    },

        activate: function() {
        if(this.active) {
            return false;
        }
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i=0, len=events.length; i<len; i++) {
            if (this[events[i]]) {
                this.register(events[i], this[events[i]]); 
            }
        } 
        this.active = true;
        return true;
    },
    
        deactivate: function() {
        if(!this.active) {
            return false;
        }
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i=0, len=events.length; i<len; i++) {
            if (this[events[i]]) {
                this.unregister(events[i], this[events[i]]); 
            }
        } 
        this.touch = false;
        this.active = false;
        return true;
    },

        startTouch: function() {
        if (!this.touch) {
            this.touch = true;
            var events = [
                "mousedown", "mouseup", "mousemove", "click", "dblclick",
                "mouseout"
            ];
            for (var i=0, len=events.length; i<len; i++) {
                if (this[events[i]]) {
                    this.unregister(events[i], this[events[i]]); 
                }
            } 
        }
    },

        callback: function (name, args) {
        if (name && this.callbacks[name]) {
            this.callbacks[name].apply(this.control, args);
        }
    },

        register: function (name, method) {
        this.map.events.registerPriority(name, this, method);
        this.map.events.registerPriority(name, this, this.setEvent);
    },

        unregister: function (name, method) {
        this.map.events.unregister(name, this, method);   
        this.map.events.unregister(name, this, this.setEvent);
    },
    
        setEvent: function(evt) {
        this.evt = evt;
        return true;
    },

        destroy: function () {
        this.deactivate();
        this.control = this.map = null;        
    },

    CLASS_NAME: "OpenLayers.Handler"
});

OpenLayers.Handler.MOD_NONE  = 0;

OpenLayers.Handler.MOD_SHIFT = 1;

OpenLayers.Handler.MOD_CTRL  = 2;

OpenLayers.Handler.MOD_ALT   = 4;

OpenLayers.Handler.MOD_META  = 8;


