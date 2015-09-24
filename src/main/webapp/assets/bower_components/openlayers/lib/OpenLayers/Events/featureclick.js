/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Events.featureclick = OpenLayers.Class({
    
        cache: null,
    
        map: null,
    
        provides: ["featureclick", "nofeatureclick", "featureover", "featureout"],
    
    lastClientX: 0,

    lastClientY: 0,
    
        initialize: function(target) {
        this.target = target;
        if (target.object instanceof OpenLayers.Map) {
            this.setMap(target.object);
        } else if (target.object instanceof OpenLayers.Layer.Vector) {
            if (target.object.map) {
                this.setMap(target.object.map);
            } else {
                target.object.events.register("added", this, function(evt) {
                    this.setMap(target.object.map);
                });
            }
        } else {
            throw("Listeners for '" + this.provides.join("', '") +
                "' events can only be registered for OpenLayers.Layer.Vector " + 
                "or OpenLayers.Map instances");
        }
        for (var i=this.provides.length-1; i>=0; --i) {
            target.extensions[this.provides[i]] = true;
        }
    },
    
        setMap: function(map) {
        this.map = map;
        this.cache = {};
        map.events.register("mousedown", this, this.start, {extension: true});
        map.events.register("mouseup", this, this.onClick, {extension: true});
        map.events.register("touchstart", this, this.start, {extension: true});
        map.events.register("touchmove", this, this.cancel, {extension: true});
        map.events.register("touchend", this, this.onClick, {extension: true});
        map.events.register("mousemove", this, this.onMousemove, {extension: true});
    },
    
        start: function(evt) {
        this.startEvt = evt;
    },
    
        onClick: function(evt) {
        if (!this.startEvt || evt.type !== "touchend" &&
                !OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        var features = this.getFeatures(this.startEvt);
        delete this.startEvt;
        var feature, layer, more, clicked = {};
        for (var i=0, len=features.length; i<len; ++i) {
            feature = features[i];
            layer = feature.layer;
            clicked[layer.id] = true;
            more = this.triggerEvent("featureclick", {feature: feature});
            if (more === false) {
                break;
            }
        }
        for (i=0, len=this.map.layers.length; i<len; ++i) {
            layer = this.map.layers[i];
            if (layer instanceof OpenLayers.Layer.Vector && !clicked[layer.id]) {
                this.triggerEvent("nofeatureclick", {layer: layer});
            }
        }
    },
    
        onMousemove: function(evt) {
        delete this.startEvt;
        var clientX = evt.clientX;
        var clientY = evt.clientY;
        if (this.lastClientX == clientX && this.lastClientY == clientY) {
            return;
        } else {
            this.lastClientX = clientX;
            this.lastClientY = clientY;
        }
        var features = this.getFeatures(evt);
        var over = {}, newly = [], feature;
        for (var i=0, len=features.length; i<len; ++i) {
            feature = features[i];
            over[feature.id] = feature;
            if (!this.cache[feature.id]) {
                newly.push(feature);
            }
        }
        var out = [];
        for (var id in this.cache) {
            feature = this.cache[id];
            if (feature.layer && feature.layer.map) {
                if (!over[feature.id]) {
                    out.push(feature);
                }
            } else {
                delete this.cache[id];
            }
        }
        var more;
        for (i=0, len=newly.length; i<len; ++i) {
            feature = newly[i];
            this.cache[feature.id] = feature;
            more = this.triggerEvent("featureover", {feature: feature});
            if (more === false) {
                break;
            }
        }
        for (i=0, len=out.length; i<len; ++i) {
            feature = out[i];
            delete this.cache[feature.id];
            more = this.triggerEvent("featureout", {feature: feature});
            if (more === false) {
                break;
            }
        }
    },
    
        triggerEvent: function(type, evt) {
        var layer = evt.feature ? evt.feature.layer : evt.layer,
            object = this.target.object;
        if (object instanceof OpenLayers.Map || object === layer) {
            return this.target.triggerEvent(type, evt);
        }
    },

        getFeatures: function(evt) {
        var x = evt.clientX, y = evt.clientY,
            features = [], targets = [], layers = [],
            layer, renderer, target, feature, i, len, featureId;
        for (i=this.map.layers.length-1; i>=0; --i) {
            layer = this.map.layers[i];
            renderer = layer.renderer;
            if (layer.div.style.display !== "none") {
                if (renderer instanceof OpenLayers.Renderer.Elements) {
                    if (layer instanceof OpenLayers.Layer.Vector) {
                        target = document.elementFromPoint(x, y);
                        while (target && (featureId = renderer.getFeatureIdFromEvent({target: target}))) {
                            feature = layer.getFeatureById(featureId);
                            if (feature) {
                                features.push(feature);
                                target.style.display = "none";
                                targets.push(target);
                                target = document.elementFromPoint(x, y);
                            } else {
                                target = false;
                            }
                        }
                    }
                    layers.push(layer);
                    layer.div.style.display = "none";
                } else if (renderer instanceof OpenLayers.Renderer.Canvas) {
                    feature = renderer.getFeatureIdFromEvent(evt);
                    if (feature) {
                        features.push(feature);
                        layers.push(layer);
                    }
                }
            }
        }
        for (i=0, len=targets.length; i<len; ++i) {
            targets[i].style.display = "";
        }
        for (i=layers.length-1; i>=0; --i) {
            layers[i].div.style.display = "block";
        }
        return features;
    },
    
        destroy: function() {
        for (var i=this.provides.length-1; i>=0; --i) {
            delete this.target.extensions[this.provides[i]];
        }        
        this.map.events.un({
            mousemove: this.onMousemove,
            mousedown: this.start,
            mouseup: this.onClick,
            touchstart: this.start,
            touchmove: this.cancel,
            touchend: this.onClick,
            scope: this
        });
        delete this.cache;
        delete this.map;
        delete this.target;
    }
    
});
 
OpenLayers.Events.nofeatureclick = OpenLayers.Events.featureclick;

OpenLayers.Events.featureover = OpenLayers.Events.featureclick;

OpenLayers.Events.featureout = OpenLayers.Events.featureclick;
