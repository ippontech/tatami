/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.TileManager = OpenLayers.Class({
    
        cacheSize: 256,

        tilesPerFrame: 2,

        frameDelay: 16,

        moveDelay: 100,
    
        zoomDelay: 200,
    
        maps: null,
    
        tileQueueId: null,

        tileQueue: null,
    
        tileCache: null,
    
        tileCacheIndex: null,    
    
        addMap: function(map) {
        if (this._destroyed || !OpenLayers.Layer.Grid) {
            return;
        }
        this.maps.push(map);
        this.tileQueue[map.id] = [];
        for (var i=0, ii=map.layers.length; i<ii; ++i) {
            this.addLayer({layer: map.layers[i]});
        }
        map.events.on({
            move: this.move,
            zoomend: this.zoomEnd,
            changelayer: this.changeLayer,
            addlayer: this.addLayer,
            preremovelayer: this.removeLayer,
            scope: this
        });
    },
    
        removeMap: function(map) {
        if (this._destroyed || !OpenLayers.Layer.Grid) {
            return;
        }
        window.clearTimeout(this.tileQueueId[map.id]);
        if (map.layers) {
            for (var i=0, ii=map.layers.length; i<ii; ++i) {
                this.removeLayer({layer: map.layers[i]});
            }
        }
        if (map.events) {
            map.events.un({
                move: this.move,
                zoomend: this.zoomEnd,
                changelayer: this.changeLayer,
                addlayer: this.addLayer,
                preremovelayer: this.removeLayer,
                scope: this
            });
        }
        delete this.tileQueue[map.id];
        delete this.tileQueueId[map.id];
        OpenLayers.Util.removeItem(this.maps, map);
    },
    
        move: function(evt) {
        this.updateTimeout(evt.object, this.moveDelay, true);
    },
    
        zoomEnd: function(evt) {
        this.updateTimeout(evt.object, this.zoomDelay);
    },
    
        changeLayer: function(evt) {
        if (evt.property === 'visibility' || evt.property === 'params') {
            this.updateTimeout(evt.object, 0);
        }
    },
    
        addLayer: function(evt) {
        var layer = evt.layer;
        if (layer instanceof OpenLayers.Layer.Grid) {
            layer.events.on({
                addtile: this.addTile,
                refresh: this.handleLayerRefresh,
                retile: this.clearTileQueue,
                scope: this
            });
            var i, j, tile;
            for (i=layer.grid.length-1; i>=0; --i) {
                for (j=layer.grid[i].length-1; j>=0; --j) {
                    tile = layer.grid[i][j];
                    this.addTile({tile: tile});
                    if (tile.url && !tile.imgDiv) {
                        this.manageTileCache({object: tile});
                    }
                }
            }
        }
    },
    
        removeLayer: function(evt) {
        var layer = evt.layer;
        if (layer instanceof OpenLayers.Layer.Grid) {
            this.clearTileQueue({object: layer});
            if (layer.events) {
                layer.events.un({
                    addtile: this.addTile,
                    refresh: this.handleLayerRefresh,
                    retile: this.clearTileQueue,
                    scope: this
                });
            }
            if (layer.grid) {
                var i, j, tile;
                for (i=layer.grid.length-1; i>=0; --i) {
                    for (j=layer.grid[i].length-1; j>=0; --j) {
                        tile = layer.grid[i][j];
                        this.unloadTile({object: tile});
                    }
                }
            }
        }
    },

        handleLayerRefresh: function(evt) {
        var layer = evt.object;
        if (layer.grid) {
            var i, j, tile;
            for (i=layer.grid.length-1; i>=0; --i) {
                for (j=layer.grid[i].length-1; j>=0; --j) {
                    tile = layer.grid[i][j];
                    OpenLayers.Util.removeItem(this.tileCacheIndex, tile.url);
                    delete this.tileCache[tile.url];
                }
            }
        }
    },
    
        updateTimeout: function(map, delay, nice) {
        window.clearTimeout(this.tileQueueId[map.id]);
        var tileQueue = this.tileQueue[map.id];
        if (!nice || tileQueue.length) {
            this.tileQueueId[map.id] = window.setTimeout(
                OpenLayers.Function.bind(function() {
                    this.drawTilesFromQueue(map);
                    if (tileQueue.length) {
                        this.updateTimeout(map, this.frameDelay);
                    }
                }, this), delay
            );
        }
    },
    
        addTile: function(evt) {
        if (evt.tile instanceof OpenLayers.Tile.Image) {
          if (!evt.tile.layer.singleTile) {
            evt.tile.events.on({
                beforedraw: this.queueTileDraw,
                beforeload: this.manageTileCache,
                loadend: this.addToCache,
                unload: this.unloadTile,
                scope: this
            });        
          }
        } else {
            this.removeLayer({layer: evt.tile.layer});
        }
    },
    
        unloadTile: function(evt) {
        var tile = evt.object;
        tile.events.un({
            beforedraw: this.queueTileDraw,
            beforeload: this.manageTileCache,
            loadend: this.addToCache,
            unload: this.unloadTile,
            scope: this
        });
        OpenLayers.Util.removeItem(this.tileQueue[tile.layer.map.id], tile);
    },
    
        queueTileDraw: function(evt) {
        var tile = evt.object;
        var queued = false;
        var layer = tile.layer;
        var url = layer.getURL(tile.bounds);
        var img = this.tileCache[url];
        if (img && img.className !== 'olTileImage') {
            delete this.tileCache[url];
            OpenLayers.Util.removeItem(this.tileCacheIndex, url);
            img = null;
        }
        if (layer.url && (layer.async || !img)) {
            var tileQueue = this.tileQueue[layer.map.id];
            if (!~OpenLayers.Util.indexOf(tileQueue, tile)) {
                tileQueue.push(tile);
            }
            queued = true;
        }
        return !queued;
    },
    
        drawTilesFromQueue: function(map) {
        var tileQueue = this.tileQueue[map.id];
        var limit = this.tilesPerFrame;
        var animating = map.zoomTween && map.zoomTween.playing;
        while (!animating && tileQueue.length && limit) {
            tileQueue.shift().draw(true);
            --limit;
        }
    },
    
        manageTileCache: function(evt) {
        var tile = evt.object;
        var img = this.tileCache[tile.url];
        if (img) {
          if (img.parentNode &&
                  OpenLayers.Element.hasClass(img.parentNode, 'olBackBuffer')) {
              img.parentNode.removeChild(img);
              img.id = null;
          }
          if (!img.parentNode) {
              img.style.visibility = 'hidden';
              img.style.opacity = 0;
              tile.setImage(img);
              OpenLayers.Util.removeItem(this.tileCacheIndex, tile.url);
              this.tileCacheIndex.push(tile.url);
          }
        }
    },
    
        addToCache: function(evt) {
        var tile = evt.object;
        if (!this.tileCache[tile.url]) {
            if (!OpenLayers.Element.hasClass(tile.imgDiv, 'olImageLoadError')) {
                if (this.tileCacheIndex.length >= this.cacheSize) {
                    delete this.tileCache[this.tileCacheIndex[0]];
                    this.tileCacheIndex.shift();
                }
                this.tileCache[tile.url] = tile.imgDiv;
                this.tileCacheIndex.push(tile.url);
            }
        }
    },

        clearTileQueue: function(evt) {
        var layer = evt.object;
        var tileQueue = this.tileQueue[layer.map.id];
        for (var i=tileQueue.length-1; i>=0; --i) {
            if (tileQueue[i].layer === layer) {
                tileQueue.splice(i, 1);
            }
        }
    },
    
        destroy: function() {
        for (var i=this.maps.length-1; i>=0; --i) {
            this.removeMap(this.maps[i]);
        }
        this.maps = null;
        this.tileQueue = null;
        this.tileQueueId = null;
        this.tileCache = null;
        this.tileCacheIndex = null;
        this._destroyed = true;
    }

});
