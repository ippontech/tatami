/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.Vector = OpenLayers.Class(OpenLayers.Layer, {

    
        isBaseLayer: false,

        isFixed: false,

        features: null,
    
        filter: null,
    
        selectedFeatures: null,
    
        unrenderedFeatures: null,

        reportError: true, 

        style: null,
    
        styleMap: null,
    
        strategies: null,
    
        protocol: null,
    
        renderers: ['SVG', 'VML', 'Canvas'],
    
        renderer: null,
    
        rendererOptions: null,
    
        geometryType: null,

        drawn: false,
    
        initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        if (!this.renderer || !this.renderer.supported()) {  
            this.assignRenderer();
        }
        if (!this.renderer || !this.renderer.supported()) {
            this.renderer = null;
            this.displayError();
        } 

        if (!this.styleMap) {
            this.styleMap = new OpenLayers.StyleMap();
        }

        this.features = [];
        this.selectedFeatures = [];
        this.unrenderedFeatures = {};
        if(this.strategies){
            for(var i=0, len=this.strategies.length; i<len; i++) {
                this.strategies[i].setLayer(this);
            }
        }

    },

        destroy: function() {
        if (this.strategies) {
            var strategy, i, len;
            for(i=0, len=this.strategies.length; i<len; i++) {
                strategy = this.strategies[i];
                if(strategy.autoDestroy) {
                    strategy.destroy();
                }
            }
            this.strategies = null;
        }
        if (this.protocol) {
            if(this.protocol.autoDestroy) {
                this.protocol.destroy();
            }
            this.protocol = null;
        }
        this.destroyFeatures();
        this.features = null;
        this.selectedFeatures = null;
        this.unrenderedFeatures = null;
        if (this.renderer) {
            this.renderer.destroy();
        }
        this.renderer = null;
        this.geometryType = null;
        this.drawn = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);  
    },

        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Vector(this.name, this.getOptions());
        }
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);
        var features = this.features;
        var len = features.length;
        var clonedFeatures = new Array(len);
        for(var i=0; i<len; ++i) {
            clonedFeatures[i] = features[i].clone();
        }
        obj.features = clonedFeatures;

        return obj;
    },    
    
        refresh: function(obj) {
        if(this.calculateInRange() && this.visibility) {
            this.events.triggerEvent("refresh", obj);
        }
    },

        displayError: function() {
        if (this.reportError) {
            OpenLayers.Console.userError(OpenLayers.i18n("browserNotSupported", 
                                     {renderers: this. renderers.join('\n')}));
        }    
    },

        setMap: function(map) {        
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);

        if (!this.renderer) {
            this.map.removeLayer(this);
        } else {
            this.renderer.map = this.map;

            var newSize = this.map.getSize();
            newSize.w = newSize.w * this.ratio;
            newSize.h = newSize.h * this.ratio;
            this.renderer.setSize(newSize);
        }
    },

        afterAdd: function() {
        if(this.strategies) {
            var strategy, i, len;
            for(i=0, len=this.strategies.length; i<len; i++) {
                strategy = this.strategies[i];
                if(strategy.autoActivate) {
                    strategy.activate();
                }
            }
        }
    },

        removeMap: function(map) {
        this.drawn = false;
        if(this.strategies) {
            var strategy, i, len;
            for(i=0, len=this.strategies.length; i<len; i++) {
                strategy = this.strategies[i];
                if(strategy.autoActivate) {
                    strategy.deactivate();
                }
            }
        }
    },
    
        onMapResize: function() {
        OpenLayers.Layer.prototype.onMapResize.apply(this, arguments);
        
        var newSize = this.map.getSize();
        newSize.w = newSize.w * this.ratio;
        newSize.h = newSize.h * this.ratio;
        this.renderer.setSize(newSize);
    },

        moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        
        var coordSysUnchanged = true;
        if (!dragging) {
            this.renderer.root.style.visibility = 'hidden';

            var viewSize = this.map.getSize(),
                viewWidth = viewSize.w,
                viewHeight = viewSize.h,
                offsetLeft = (viewWidth / 2 * this.ratio) - viewWidth / 2,
                offsetTop = (viewHeight / 2 * this.ratio) - viewHeight / 2;
            offsetLeft += this.map.layerContainerOriginPx.x;
            offsetLeft = -Math.round(offsetLeft);
            offsetTop += this.map.layerContainerOriginPx.y;
            offsetTop = -Math.round(offsetTop);

            this.div.style.left = offsetLeft + 'px';
            this.div.style.top = offsetTop + 'px';

            var extent = this.map.getExtent().scale(this.ratio);
            coordSysUnchanged = this.renderer.setExtent(extent, zoomChanged);

            this.renderer.root.style.visibility = 'visible';
            if (OpenLayers.IS_GECKO === true) {
                this.div.scrollLeft = this.div.scrollLeft;
            }
            
            if (!zoomChanged && coordSysUnchanged) {
                for (var i in this.unrenderedFeatures) {
                    var feature = this.unrenderedFeatures[i];
                    this.drawFeature(feature);
                }
            }
        }
        if (!this.drawn || zoomChanged || !coordSysUnchanged) {
            this.drawn = true;
            var feature;
            for(var i=0, len=this.features.length; i<len; i++) {
                this.renderer.locked = (i !== (len - 1));
                feature = this.features[i];
                this.drawFeature(feature);
            }
        }    
    },
    
        display: function(display) {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        var currentDisplay = this.div.style.display;
        if(currentDisplay != this.renderer.root.style.display) {
            this.renderer.root.style.display = currentDisplay;
        }
    },

        addFeatures: function(features, options) {
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        
        var notify = !options || !options.silent;
        if(notify) {
            var event = {features: features};
            var ret = this.events.triggerEvent("beforefeaturesadded", event);
            if(ret === false) {
                return;
            }
            features = event.features;
        }
        var featuresAdded = [];
        for (var i=0, len=features.length; i<len; i++) {
            if (i != (features.length - 1)) {
                this.renderer.locked = true;
            } else {
                this.renderer.locked = false;
            }    
            var feature = features[i];
            
            if (this.geometryType &&
              !(feature.geometry instanceof this.geometryType)) {
                throw new TypeError('addFeatures: component should be an ' +
                                    this.geometryType.prototype.CLASS_NAME);
              }
            feature.layer = this;

            if (!feature.style && this.style) {
                feature.style = OpenLayers.Util.extend({}, this.style);
            }

            if (notify) {
                if(this.events.triggerEvent("beforefeatureadded",
                                            {feature: feature}) === false) {
                    continue;
                }
                this.preFeatureInsert(feature);
            }

            featuresAdded.push(feature);
            this.features.push(feature);
            this.drawFeature(feature);
            
            if (notify) {
                this.events.triggerEvent("featureadded", {
                    feature: feature
                });
                this.onFeatureInsert(feature);
            }
        }
        
        if(notify) {
            this.events.triggerEvent("featuresadded", {features: featuresAdded});
        }
    },


        removeFeatures: function(features, options) {
        if(!features || features.length === 0) {
            return;
        }
        if (features === this.features) {
            return this.removeAllFeatures(options);
        }
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        if (features === this.selectedFeatures) {
            features = features.slice();
        }

        var notify = !options || !options.silent;
        
        if (notify) {
            this.events.triggerEvent(
                "beforefeaturesremoved", {features: features}
            );
        }

        for (var i = features.length - 1; i >= 0; i--) {
            if (i != 0 && features[i-1].geometry) {
                this.renderer.locked = true;
            } else {
                this.renderer.locked = false;
            }
    
            var feature = features[i];
            delete this.unrenderedFeatures[feature.id];

            if (notify) {
                this.events.triggerEvent("beforefeatureremoved", {
                    feature: feature
                });
            }

            this.features = OpenLayers.Util.removeItem(this.features, feature);
            feature.layer = null;

            if (feature.geometry) {
                this.renderer.eraseFeatures(feature);
            }
            if (OpenLayers.Util.indexOf(this.selectedFeatures, feature) != -1){
                OpenLayers.Util.removeItem(this.selectedFeatures, feature);
            }

            if (notify) {
                this.events.triggerEvent("featureremoved", {
                    feature: feature
                });
            }
        }

        if (notify) {
            this.events.triggerEvent("featuresremoved", {features: features});
        }
    },
    
        removeAllFeatures: function(options) {
        var notify = !options || !options.silent;
        var features = this.features;
        if (notify) {
            this.events.triggerEvent(
                "beforefeaturesremoved", {features: features}
            );
        }
        var feature;
        for (var i = features.length-1; i >= 0; i--) {
            feature = features[i];
            if (notify) {
                this.events.triggerEvent("beforefeatureremoved", {
                    feature: feature
                });
            }
            feature.layer = null;
            if (notify) {
                this.events.triggerEvent("featureremoved", {
                    feature: feature
                });
            }
        }
        this.renderer.clear();
        this.features = [];
        this.unrenderedFeatures = {};
        this.selectedFeatures = [];
        if (notify) {
            this.events.triggerEvent("featuresremoved", {features: features});
        }
    },

        destroyFeatures: function(features, options) {
        var all = (features == undefined); // evaluates to true if
        if(all) {
            features = this.features;
        }
        if(features) {
            this.removeFeatures(features, options);
            for(var i=features.length-1; i>=0; i--) {
                features[i].destroy();
            }
        }
    },

        drawFeature: function(feature, style) {
        if (!this.drawn) {
            return;
        }
        if (typeof style != "object") {
            if(!style && feature.state === OpenLayers.State.DELETE) {
                style = "delete";
            }
            var renderIntent = style || feature.renderIntent;
            style = feature.style || this.style;
            if (!style) {
                style = this.styleMap.createSymbolizer(feature, renderIntent);
            }
        }
        
        var drawn = this.renderer.drawFeature(feature, style);
        if (drawn === false || drawn === null) {
            this.unrenderedFeatures[feature.id] = feature;
        } else {
            delete this.unrenderedFeatures[feature.id];
        }
    },
    
        eraseFeatures: function(features) {
        this.renderer.eraseFeatures(features);
    },

        getFeatureFromEvent: function(evt) {
        if (!this.renderer) {
            throw new Error('getFeatureFromEvent called on layer with no ' +
                            'renderer. This usually means you destroyed a ' +
                            'layer, but not some handler which is associated ' +
                            'with it.');
        }
        var feature = null;
        var featureId = this.renderer.getFeatureIdFromEvent(evt);
        if (featureId) {
            if (typeof featureId === "string") {
                feature = this.getFeatureById(featureId);
            } else {
                feature = featureId;
            }
        }
        return feature;
    },

        getFeatureBy: function(property, value) {
        var feature = null;
        for(var i=0, len=this.features.length; i<len; ++i) {
            if(this.features[i][property] == value) {
                feature = this.features[i];
                break;
            }
        }
        return feature;
    },

        getFeatureById: function(featureId) {
        return this.getFeatureBy('id', featureId);
    },

        getFeatureByFid: function(featureFid) {
        return this.getFeatureBy('fid', featureFid);
    },
    
        getFeaturesByAttribute: function(attrName, attrValue) {
        var i,
            feature,    
            len = this.features.length,
            foundFeatures = [];
        for(i = 0; i < len; i++) {            
            feature = this.features[i];
            if(feature && feature.attributes) {
                if (feature.attributes[attrName] === attrValue) {
                    foundFeatures.push(feature);
                }
            }
        }
        return foundFeatures;
    },

    

        onFeatureInsert: function(feature) {
    },
    
        preFeatureInsert: function(feature) {
    },

        getDataExtent: function () {
        var maxExtent = null;
        var features = this.features;
        if(features && (features.length > 0)) {
            var geometry = null;
            for(var i=0, len=features.length; i<len; i++) {
                geometry = features[i].geometry;
                if (geometry) {
                    if (maxExtent === null) {
                        maxExtent = new OpenLayers.Bounds();
                    }
                    maxExtent.extend(geometry.getBounds());
                }
            }
        }
        return maxExtent;
    },

    CLASS_NAME: "OpenLayers.Layer.Vector"
});
