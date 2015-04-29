/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 

OpenLayers.Layer.Image = OpenLayers.Class(OpenLayers.Layer, {

        isBaseLayer: true,
    
        url: null,

        extent: null,
    
        size: null,

        tile: null,

        aspectRatio: null,

        initialize: function(name, url, extent, size, options) {
        this.url = url;
        this.extent = extent;
        this.maxExtent = extent;
        this.size = size;
        OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);

        this.aspectRatio = (this.extent.getHeight() / this.size.h) /
                           (this.extent.getWidth() / this.size.w);
    },    

        destroy: function() {
        if (this.tile) {
            this.removeTileMonitoringHooks(this.tile);
            this.tile.destroy();
            this.tile = null;
        }
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },
    
        clone: function(obj) {
        
        if(obj == null) {
            obj = new OpenLayers.Layer.Image(this.name,
                                               this.url,
                                               this.extent,
                                               this.size,
                                               this.getOptions());
        }
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);

        return obj;
    },    
    
        setMap: function(map) {
                if( this.options.maxResolution == null ) {
            this.options.maxResolution = this.aspectRatio *
                                         this.extent.getWidth() /
                                         this.size.w;
        }
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
    },

        moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        var firstRendering = (this.tile == null);

        if(zoomChanged || firstRendering) {
            this.setTileSize();
            var ulPx = this.map.getLayerPxFromLonLat({
                lon: this.extent.left,
                lat: this.extent.top
            });

            if(firstRendering) {
                this.tile = new OpenLayers.Tile.Image(this, ulPx, this.extent, 
                                                      null, this.tileSize);
                this.addTileMonitoringHooks(this.tile);
            } else {
                this.tile.size = this.tileSize.clone();
                this.tile.position = ulPx.clone();
            }
            this.tile.draw();
        }
    }, 

        setTileSize: function() {
        var tileWidth = this.extent.getWidth() / this.map.getResolution();
        var tileHeight = this.extent.getHeight() / this.map.getResolution();
        this.tileSize = new OpenLayers.Size(tileWidth, tileHeight);
    },

        addTileMonitoringHooks: function(tile) {
        tile.onLoadStart = function() {
            this.events.triggerEvent("loadstart");
        };
        tile.events.register("loadstart", this, tile.onLoadStart);
      
        tile.onLoadEnd = function() {
            this.events.triggerEvent("loadend");
        };
        tile.events.register("loadend", this, tile.onLoadEnd);
        tile.events.register("unload", this, tile.onLoadEnd);
    },

        removeTileMonitoringHooks: function(tile) {
        tile.unload();
        tile.events.un({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            scope: this
        });
    },
    
        setUrl: function(newUrl) {
        this.url = newUrl;
        this.tile.draw();
    },

        getURL: function(bounds) {
        return this.url;
    },

    CLASS_NAME: "OpenLayers.Layer.Image"
});
