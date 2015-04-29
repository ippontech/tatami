/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.CacheWrite = OpenLayers.Class(OpenLayers.Control, {
    
        
    
        layers: null,
    
        imageFormat: "image/png",
    
        quotaRegEx: (/quota/i),
    
    
        setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        var i, layers = this.layers || map.layers;
        for (i=layers.length-1; i>=0; --i) {
            this.addLayer({layer: layers[i]});
        }
        if (!this.layers) {
            map.events.on({
                addlayer: this.addLayer,
                removeLayer: this.removeLayer,
                scope: this
            });
        }
    },
    
        addLayer: function(evt) {
        evt.layer.events.on({
            tileloadstart: this.makeSameOrigin,
            tileloaded: this.onTileLoaded,
            scope: this
        });        
    },
    
        removeLayer: function(evt) {
        evt.layer.events.un({
            tileloadstart: this.makeSameOrigin,
            tileloaded: this.onTileLoaded,
            scope: this
        });
    },

        makeSameOrigin: function(evt) {
        if (this.active) {
            var tile = evt.tile;
            if (tile instanceof OpenLayers.Tile.Image &&
                    !tile.crossOriginKeyword &&
                    tile.url.substr(0, 5) !== "data:") {
                var sameOriginUrl = OpenLayers.Request.makeSameOrigin(
                    tile.url, OpenLayers.ProxyHost
                );
                OpenLayers.Control.CacheWrite.urlMap[sameOriginUrl] = tile.url;
                tile.url = sameOriginUrl;
            }
        }
    },
    
        onTileLoaded: function(evt) {
        if (this.active && !evt.aborted &&
                evt.tile instanceof OpenLayers.Tile.Image &&
                evt.tile.url.substr(0, 5) !== 'data:') {
            this.cache({tile: evt.tile});
            delete OpenLayers.Control.CacheWrite.urlMap[evt.tile.url];
        }
    },
    
        cache: function(obj) {
        if (window.localStorage) {
            var tile = obj.tile;
            try {
                var canvasContext = tile.getCanvasContext();
                if (canvasContext) {
                    var urlMap = OpenLayers.Control.CacheWrite.urlMap;
                    var url = urlMap[tile.url] || tile.url;
                    window.localStorage.setItem(
                        "olCache_" + url,
                        canvasContext.canvas.toDataURL(this.imageFormat)
                    );
                }
            } catch(e) {
                var reason = e.name || e.message;
                if (reason && this.quotaRegEx.test(reason)) {
                    this.events.triggerEvent("cachefull", {tile: tile});
                } else {
                    OpenLayers.Console.error(e.toString());
                }
            }
        }
    },
    
        destroy: function() {
        if (this.layers || this.map) {
            var i, layers = this.layers || this.map.layers;
            for (i=layers.length-1; i>=0; --i) {
                this.removeLayer({layer: layers[i]});
            }
        }
        if (this.map) {
            this.map.events.un({
                addlayer: this.addLayer,
                removeLayer: this.removeLayer,
                scope: this
            });
        }
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    
    CLASS_NAME: "OpenLayers.Control.CacheWrite"
});

OpenLayers.Control.CacheWrite.clearCache = function() {
    if (!window.localStorage) { return; }
    var i, key;
    for (i=window.localStorage.length-1; i>=0; --i) {
        key = window.localStorage.key(i);
        if (key.substr(0, 8) === "olCache_") {
            window.localStorage.removeItem(key);
        }
    }
};

OpenLayers.Control.CacheWrite.urlMap = {};


