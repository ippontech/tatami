/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.CacheRead = OpenLayers.Class(OpenLayers.Control, {
    
        fetchEvent: "tileloadstart",
    
        layers: null,
    
        autoActivate: true,

        
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
        evt.layer.events.register(this.fetchEvent, this, this.fetch);        
    },
    
        removeLayer: function(evt) {
        evt.layer.events.unregister(this.fetchEvent, this, this.fetch);
    },
    
        fetch: function(evt) {
        if (this.active && window.localStorage &&
                evt.tile instanceof OpenLayers.Tile.Image) {
            var tile = evt.tile,
                url = tile.url;
            if (!tile.layer.crossOriginKeyword && OpenLayers.ProxyHost &&
                    url.indexOf(OpenLayers.ProxyHost) === 0) {
                url = OpenLayers.Control.CacheWrite.urlMap[url];        
            }
            var dataURI = window.localStorage.getItem("olCache_" + url);
            if (dataURI) {
                tile.url = dataURI;
                if (evt.type === "tileerror") {
                    tile.setImgSrc(dataURI);
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
    
    CLASS_NAME: "OpenLayers.Control.CacheRead"
});
