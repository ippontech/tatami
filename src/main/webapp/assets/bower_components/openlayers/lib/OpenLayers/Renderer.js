/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Renderer = OpenLayers.Class({

        container: null,
    
        root: null,

        extent: null,

        size: null,
    
        resolution: null,
    
        map: null,
    
        featureDx: 0,
    
        initialize: function(containerID, options) {
        this.container = OpenLayers.Util.getElement(containerID);
        OpenLayers.Util.extend(this, options);
    },
    
        destroy: function() {
        this.container = null;
        this.extent = null;
        this.size =  null;
        this.resolution = null;
        this.map = null;
    },

        supported: function() {
        return false;
    },    
    
        setExtent: function(extent, resolutionChanged) {
        this.extent = extent.clone();
        if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
            var ratio = extent.getWidth() / this.map.getExtent().getWidth(),
                extent = extent.scale(1 / ratio);
            this.extent = extent.wrapDateLine(this.map.getMaxExtent()).scale(ratio);
        }
        if (resolutionChanged) {
            this.resolution = null;
        }
        return true;
    },
    
        setSize: function(size) {
        this.size = size.clone();
        this.resolution = null;
    },
    
        getResolution: function() {
        this.resolution = this.resolution || this.map.getResolution();
        return this.resolution;
    },
    
        drawFeature: function(feature, style) {
        if(style == null) {
            style = feature.style;
        }
        if (feature.geometry) {
            var bounds = feature.geometry.getBounds();
            if(bounds) {
                var worldBounds;
                if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
                    worldBounds = this.map.getMaxExtent();
                }
                if (!bounds.intersectsBounds(this.extent, {worldBounds: worldBounds})) {
                    style = {display: "none"};
                } else {
                    this.calculateFeatureDx(bounds, worldBounds);
                }
                var rendered = this.drawGeometry(feature.geometry, style, feature.id);
                if(style.display != "none" && style.label && rendered !== false) {

                    var location = feature.geometry.getCentroid(); 
                    if(style.labelXOffset || style.labelYOffset) {
                        var xOffset = isNaN(style.labelXOffset) ? 0 : style.labelXOffset;
                        var yOffset = isNaN(style.labelYOffset) ? 0 : style.labelYOffset;
                        var res = this.getResolution();
                        location.move(xOffset*res, yOffset*res);
                    }
                    this.drawText(feature.id, style, location);
                } else {
                    this.removeText(feature.id);
                }
                return rendered;
            }
        }
    },

        calculateFeatureDx: function(bounds, worldBounds) {
        this.featureDx = 0;
        if (worldBounds) {
            var worldWidth = worldBounds.getWidth(),
                rendererCenterX = (this.extent.left + this.extent.right) / 2,
                featureCenterX = (bounds.left + bounds.right) / 2,
                worldsAway = Math.round((featureCenterX - rendererCenterX) / worldWidth);
            this.featureDx = worldsAway * worldWidth;
        }
    },

        drawGeometry: function(geometry, style, featureId) {},
        
        drawText: function(featureId, style, location) {},

        removeText: function(featureId) {},
    
        getFeatureIdFromEvent: function(evt) {},
    
        eraseFeatures: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        for(var i=0, len=features.length; i<len; ++i) {
            var feature = features[i];
            this.eraseGeometry(feature.geometry, feature.id);
            this.removeText(feature.id);
        }
    },
    
        eraseGeometry: function(geometry, featureId) {},
    
        moveRoot: function(renderer) {},

        getRenderLayerId: function() {
        return this.container.id;
    },
    
        applyDefaultSymbolizer: function(symbolizer) {
        var result = OpenLayers.Util.extend({},
            OpenLayers.Renderer.defaultSymbolizer);
        if(symbolizer.stroke === false) {
            delete result.strokeWidth;
            delete result.strokeColor;
        }
        if(symbolizer.fill === false) {
            delete result.fillColor;
        }
        OpenLayers.Util.extend(result, symbolizer);
        return result;
    },

    CLASS_NAME: "OpenLayers.Renderer"
});

OpenLayers.Renderer.defaultSymbolizer = {
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 2,
    fillOpacity: 1,
    strokeOpacity: 1,
    pointRadius: 0,
    labelAlign: 'cm'
};
    


OpenLayers.Renderer.symbol = {
    "star": [350,75, 379,161, 469,161, 397,215, 423,301, 350,250, 277,301,
            303,215, 231,161, 321,161, 350,75],
    "cross": [4,0, 6,0, 6,4, 10,4, 10,6, 6,6, 6,10, 4,10, 4,6, 0,6, 0,4, 4,4,
            4,0],
    "x": [0,0, 25,0, 50,35, 75,0, 100,0, 65,50, 100,100, 75,100, 50,65, 25,100, 0,100, 35,50, 0,0],
    "square": [0,0, 0,1, 1,1, 1,0, 0,0],
    "triangle": [0,10, 10,10, 5,0, 0,10]
};
