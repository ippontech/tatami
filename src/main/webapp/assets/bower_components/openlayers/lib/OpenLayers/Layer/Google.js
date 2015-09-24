/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.Google = OpenLayers.Class(
    OpenLayers.Layer.EventPane, 
    OpenLayers.Layer.FixedZoomLevels, {
    
        MIN_ZOOM_LEVEL: 0,
    
        MAX_ZOOM_LEVEL: 21,

        RESOLUTIONS: [
        1.40625, 
        0.703125, 
        0.3515625, 
        0.17578125, 
        0.087890625, 
        0.0439453125,
        0.02197265625, 
        0.010986328125, 
        0.0054931640625, 
        0.00274658203125,
        0.001373291015625, 
        0.0006866455078125, 
        0.00034332275390625,
        0.000171661376953125, 
        0.0000858306884765625, 
        0.00004291534423828125,
        0.00002145767211914062, 
        0.00001072883605957031,
        0.00000536441802978515, 
        0.00000268220901489257,
        0.0000013411045074462891,
        0.00000067055225372314453
    ],

        type: null,

        wrapDateLine: true,

        sphericalMercator: false, 
    
        useTiltImages: false, 
    
        version: null,

        initialize: function(name, options) {
        options = options || {};
        options.version = "3";
        var mixin = OpenLayers.Layer.Google["v" +
            options.version.replace(/\./g, "_")];
        if (mixin) {
            OpenLayers.Util.applyDefaults(options, mixin);
        } else {
            throw "Unsupported Google Maps API version: " + options.version;
        }

        OpenLayers.Util.applyDefaults(options, mixin.DEFAULTS);
        if (options.maxExtent) {
            options.maxExtent = options.maxExtent.clone();
        }

        OpenLayers.Layer.EventPane.prototype.initialize.apply(this,
            [name, options]);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
            [name, options]);

        if (this.sphericalMercator) {
            OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator);
            this.initMercatorParameters();
        }    
    },

        clone: function() {
                return new OpenLayers.Layer.Google(
            this.name, this.getOptions()
        );
    },

        setVisibility: function(visible) {
        var opacity = this.opacity == null ? 1 : this.opacity;
        OpenLayers.Layer.EventPane.prototype.setVisibility.apply(this, arguments);
        this.setOpacity(opacity);
    },
    
        display: function(visible) {
        if (!this._dragging) {
            this.setGMapVisibility(visible);
        }
        OpenLayers.Layer.EventPane.prototype.display.apply(this, arguments);
    },
    
        moveTo: function(bounds, zoomChanged, dragging) {
        this._dragging = dragging;
        OpenLayers.Layer.EventPane.prototype.moveTo.apply(this, arguments);
        delete this._dragging;
    },
    
        setOpacity: function(opacity) {
        if (opacity !== this.opacity) {
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
            }
            this.opacity = opacity;
        }
        if (this.getVisibility()) {
            var container = this.getMapContainer();
            OpenLayers.Util.modifyDOMElement(
                container, null, null, null, null, null, null, opacity
            );
        }
    },

        destroy: function() {
                if (this.map) {
            this.setGMapVisibility(false);
            var cache = OpenLayers.Layer.Google.cache[this.map.id];
            if (cache && cache.count <= 1) {
                this.removeGMapElements();
            }            
        }
        OpenLayers.Layer.EventPane.prototype.destroy.apply(this, arguments);
    },
    
        removeGMapElements: function() {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            var container = this.mapObject && this.getMapContainer();                
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            var termsOfUse = cache.termsOfUse;
            if (termsOfUse && termsOfUse.parentNode) {
                termsOfUse.parentNode.removeChild(termsOfUse);
            }
            var poweredBy = cache.poweredBy;
            if (poweredBy && poweredBy.parentNode) {
                poweredBy.parentNode.removeChild(poweredBy);
            }
            if (this.mapObject && window.google && google.maps &&
                    google.maps.event && google.maps.event.clearListeners) {
                google.maps.event.clearListeners(this.mapObject, 'tilesloaded');
            }
        }
    },

        removeMap: function(map) {
        if (this.visibility && this.mapObject) {
            this.setGMapVisibility(false);
        }
        var cache = OpenLayers.Layer.Google.cache[map.id];
        if (cache) {
            if (cache.count <= 1) {
                this.removeGMapElements();
                delete OpenLayers.Layer.Google.cache[map.id];
            } else {
                --cache.count;
            }
        }
        delete this.termsOfUse;
        delete this.poweredBy;
        delete this.mapObject;
        delete this.dragObject;
        OpenLayers.Layer.EventPane.prototype.removeMap.apply(this, arguments);
    },

        getOLBoundsFromMapObjectBounds: function(moBounds) {
        var olBounds = null;
        if (moBounds != null) {
            var sw = moBounds.getSouthWest();
            var ne = moBounds.getNorthEast();
            if (this.sphericalMercator) {
                sw = this.forwardMercator(sw.lng(), sw.lat());
                ne = this.forwardMercator(ne.lng(), ne.lat());
            } else {
                sw = new OpenLayers.LonLat(sw.lng(), sw.lat()); 
                ne = new OpenLayers.LonLat(ne.lng(), ne.lat()); 
            }    
            olBounds = new OpenLayers.Bounds(sw.lon, 
                                             sw.lat, 
                                             ne.lon, 
                                             ne.lat );
        }
        return olBounds;
    },

        getWarningHTML:function() {
        return OpenLayers.i18n("googleWarning");
    },

        getMapObjectCenter: function() {
        return this.mapObject.getCenter();
    },

        getMapObjectZoom: function() {
        return this.mapObject.getZoom();
    },
    
        getLongitudeFromMapObjectLonLat: function(moLonLat) {
        return this.sphericalMercator ? 
          this.forwardMercator(moLonLat.lng(), moLonLat.lat()).lon :
          moLonLat.lng();  
    },

        getLatitudeFromMapObjectLonLat: function(moLonLat) {
        var lat = this.sphericalMercator ? 
          this.forwardMercator(moLonLat.lng(), moLonLat.lat()).lat :
          moLonLat.lat(); 
        return lat;  
    },
    
        getXFromMapObjectPixel: function(moPixel) {
        return moPixel.x;
    },

        getYFromMapObjectPixel: function(moPixel) {
        return moPixel.y;
    },
    
    CLASS_NAME: "OpenLayers.Layer.Google"
});

OpenLayers.Layer.Google.cache = {};