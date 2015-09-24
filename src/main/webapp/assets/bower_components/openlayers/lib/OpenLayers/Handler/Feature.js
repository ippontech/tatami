/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Handler.Feature = OpenLayers.Class(OpenLayers.Handler, {

        EVENTMAP: {
        'click': {'in': 'click', 'out': 'clickout'},
        'mousemove': {'in': 'over', 'out': 'out'},
        'dblclick': {'in': 'dblclick', 'out': null},
        'mousedown': {'in': null, 'out': null},
        'mouseup': {'in': null, 'out': null},
        'touchstart': {'in': 'click', 'out': 'clickout'}
    },

        feature: null,

        lastFeature: null,

        down: null,

        up: null,
    
        clickTolerance: 4,

        geometryTypes: null,

        stopClick: true,

        stopDown: true,

        stopUp: false,
    
        initialize: function(control, layer, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, [control, callbacks, options]);
        this.layer = layer;
    },

        touchstart: function(evt) {
        this.startTouch(); 
        return OpenLayers.Event.isMultiTouch(evt) ?
                true : this.mousedown(evt);
    },

        touchmove: function(evt) {
        OpenLayers.Event.preventDefault(evt);
    },

        mousedown: function(evt) {
        if (OpenLayers.Event.isLeftClick(evt) || OpenLayers.Event.isSingleTouch(evt)) {
            this.down = evt.xy;
        }
        return this.handle(evt) ? !this.stopDown : true;
    },
    
        mouseup: function(evt) {
        this.up = evt.xy;
        return this.handle(evt) ? !this.stopUp : true;
    },

        click: function(evt) {
        return this.handle(evt) ? !this.stopClick : true;
    },
        
        mousemove: function(evt) {
        if (!this.callbacks['over'] && !this.callbacks['out']) {
            return true;
        }     
        this.handle(evt);
        return true;
    },
    
        dblclick: function(evt) {
        return !this.handle(evt);
    },

        geometryTypeMatches: function(feature) {
        return this.geometryTypes == null ||
            OpenLayers.Util.indexOf(this.geometryTypes,
                                    feature.geometry.CLASS_NAME) > -1;
    },

        handle: function(evt) {
        if(this.feature && !this.feature.layer) {
            this.feature = null;
        }
        var type = evt.type;
        var handled = false;
        var previouslyIn = !!(this.feature); // previously in a feature
        var click = (type == "click" || type == "dblclick" || type == "touchstart");
        this.feature = this.layer.getFeatureFromEvent(evt);
        if(this.feature && !this.feature.layer) {
            this.feature = null;
        }
        if(this.lastFeature && !this.lastFeature.layer) {
            this.lastFeature = null;
        }
        if(this.feature) {
            if(type === "touchstart") {
                OpenLayers.Event.preventDefault(evt);
            }
            var inNew = (this.feature != this.lastFeature);
            if(this.geometryTypeMatches(this.feature)) {
                if(previouslyIn && inNew) {
                    if(this.lastFeature) {
                        this.triggerCallback(type, 'out', [this.lastFeature]);
                    }
                    this.triggerCallback(type, 'in', [this.feature]);
                } else if(!previouslyIn || click) {
                    this.triggerCallback(type, 'in', [this.feature]);
                }
                this.lastFeature = this.feature;
                handled = true;
            } else {
                if(this.lastFeature && (previouslyIn && inNew || click)) {
                    this.triggerCallback(type, 'out', [this.lastFeature]);
                }
                this.feature = null;
            }
        } else if(this.lastFeature && (previouslyIn || click)) {
            this.triggerCallback(type, 'out', [this.lastFeature]);
        }
        return handled;
    },
    
        triggerCallback: function(type, mode, args) {
        var key = this.EVENTMAP[type][mode];
        if(key) {
            if(type == 'click' && this.up && this.down) {
                var dpx = Math.sqrt(
                    Math.pow(this.up.x - this.down.x, 2) +
                    Math.pow(this.up.y - this.down.y, 2)
                );
                if(dpx <= this.clickTolerance) {
                    this.callback(key, args);
                }
                this.up = this.down = null;
            } else {
                this.callback(key, args);
            }
        }
    },

        activate: function() {
        var activated = false;
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.moveLayerToTop();
            this.map.events.on({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            activated = true;
        }
        return activated;
    },
    
        deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.moveLayerBack();
            this.feature = null;
            this.lastFeature = null;
            this.down = null;
            this.up = null;
            this.map.events.un({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            deactivated = true;
        }
        return deactivated;
    },
    
        handleMapEvents: function(evt) {
        if (evt.type == "removelayer" || evt.property == "order") {
            this.moveLayerToTop();
        }
    },
    
        moveLayerToTop: function() {
        var index = Math.max(this.map.Z_INDEX_BASE['Feature'] - 1,
            this.layer.getZIndex()) + 1;
        this.layer.setZIndex(index);
        
    },
    
        moveLayerBack: function() {
        var index = this.layer.getZIndex() - 1;
        if (index >= this.map.Z_INDEX_BASE['Feature']) {
            this.layer.setZIndex(index);
        } else {
            this.map.setLayerZIndex(this.layer,
                this.map.getLayerIndex(this.layer));
        }
    },

    CLASS_NAME: "OpenLayers.Handler.Feature"
});
