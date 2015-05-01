/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.Grid = OpenLayers.Class(OpenLayers.Layer.HTTPRequest, {
    
        tileSize: null,

        tileOriginCorner: "bl",
    
        tileOrigin: null,
    
        tileOptions: null,

        tileClass: OpenLayers.Tile.Image,
    
        grid: null,

        singleTile: false,

        ratio: 1.5,

        buffer: 0,

        transitionEffect: "resize",

        numLoadingTiles: 0,

        serverResolutions: null,

        loading: false,
    
        backBuffer: null,

        gridResolution: null,

        backBufferResolution: null,

        backBufferLonLat: null,

        backBufferTimerId: null,

        removeBackBufferDelay: null,

        className: null,
    
    
        gridLayout: null,
    
        rowSign: null,

        transitionendEvents: [
        'transitionend', 'webkitTransitionEnd', 'otransitionend',
        'oTransitionEnd'
    ],

        initialize: function(name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                arguments);
        this.grid = [];
        this._removeBackBuffer = OpenLayers.Function.bind(this.removeBackBuffer, this);

        this.initProperties();

        this.rowSign = this.tileOriginCorner.substr(0, 1) === "t" ? 1 : -1;
    },

        initProperties: function() {
        if (this.options.removeBackBufferDelay === undefined) {
            this.removeBackBufferDelay = this.singleTile ? 0 : 2500;
        }

        if (this.options.className === undefined) {
            this.className = this.singleTile ? 'olLayerGridSingleTile' :
                                               'olLayerGrid';
        }
    },

        setMap: function(map) {
        OpenLayers.Layer.HTTPRequest.prototype.setMap.call(this, map);
        OpenLayers.Element.addClass(this.div, this.className);
    },

        removeMap: function(map) {
        this.removeBackBuffer();
    },

        destroy: function() {
        this.removeBackBuffer();
        this.clearGrid();

        this.grid = null;
        this.tileSize = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments); 
    },

    
        clearGrid:function() {
        if (this.grid) {
            for(var iRow=0, len=this.grid.length; iRow<len; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0, clen=row.length; iCol<clen; iCol++) {
                    var tile = row[iCol];
                    this.destroyTile(tile);
                }
            }
            this.grid = [];
            this.gridResolution = null;
            this.gridLayout = null;
        }
    },

       addOptions: function (newOptions, reinitialize) {
        var singleTileChanged = newOptions.singleTile !== undefined && 
            newOptions.singleTile !== this.singleTile;
        OpenLayers.Layer.HTTPRequest.prototype.addOptions.apply(this, arguments);
        if (this.map && singleTileChanged) {
            this.initProperties();
            this.clearGrid();
            this.tileSize = this.options.tileSize;
            this.setTileSize();
            if (this.visibility) {
                this.moveTo(null, true);
            }
        }
    },
    
        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid(this.name,
                                            this.url,
                                            this.params,
                                            this.getOptions());
        }
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        obj.grid = [];
        obj.gridResolution = null;
        obj.backBuffer = null;
        obj.backBufferTimerId = null;
        obj.loading = false;
        obj.numLoadingTiles = 0;

        return obj;
    },    

        moveTo:function(bounds, zoomChanged, dragging) {

        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);

        bounds = bounds || this.map.getExtent();

        if (bounds != null) {
            var forceReTile = !this.grid.length || zoomChanged;
            var tilesBounds = this.getTilesBounds();            
            var resolution = this.map.getResolution();
            var serverResolution = this.getServerResolution(resolution);

            if (this.singleTile) {

                if ( forceReTile ||
                     (!dragging && !tilesBounds.containsBounds(bounds))) {

                    if(zoomChanged && this.transitionEffect !== 'resize') {
                        this.removeBackBuffer();
                    }

                    if(!zoomChanged || this.transitionEffect === 'resize') {
                        this.applyBackBuffer(resolution);
                    }

                    this.initSingleTile(bounds);
                }
            } else {
                forceReTile = forceReTile ||
                    !tilesBounds.intersectsBounds(bounds, {
                        worldBounds: this.map.baseLayer.wrapDateLine &&
                            this.map.getMaxExtent()
                    });

                if(forceReTile) {
                    if(zoomChanged && (this.transitionEffect === 'resize' ||
                                          this.gridResolution === resolution)) {
                        this.applyBackBuffer(resolution);
                    }
                    this.initGriddedTiles(bounds);
                } else {
                    this.moveGriddedTiles();
                }
            }
        }
    },

        getTileData: function(loc) {
        var data = null,
            x = loc.lon,
            y = loc.lat,
            numRows = this.grid.length;

        if (this.map && numRows) {
            var res = this.map.getResolution(),
                tileWidth = this.tileSize.w,
                tileHeight = this.tileSize.h,
                bounds = this.grid[0][0].bounds,
                left = bounds.left,
                top = bounds.top;

            if (x < left) {
                if (this.map.baseLayer.wrapDateLine) {
                    var worldWidth = this.map.getMaxExtent().getWidth();
                    var worldsAway = Math.ceil((left - x) / worldWidth);
                    x += worldWidth * worldsAway;
                }
            }
            var dtx = (x - left) / (res * tileWidth);
            var dty = (top - y) / (res * tileHeight);
            var col = Math.floor(dtx);
            var row = Math.floor(dty);
            if (row >= 0 && row < numRows) {
                var tile = this.grid[row][col];
                if (tile) {
                    data = {
                        tile: tile,
                        i: Math.floor((dtx - col) * tileWidth),
                        j: Math.floor((dty - row) * tileHeight)
                    };                    
                }
            }
        }
        return data;
    },
    
        destroyTile: function(tile) {
        this.removeTileMonitoringHooks(tile);
        tile.destroy();
    },

        getServerResolution: function(resolution) {
        var distance = Number.POSITIVE_INFINITY;
        resolution = resolution || this.map.getResolution();
        if(this.serverResolutions &&
           OpenLayers.Util.indexOf(this.serverResolutions, resolution) === -1) {
            var i, newDistance, newResolution, serverResolution;
            for(i=this.serverResolutions.length-1; i>= 0; i--) {
                newResolution = this.serverResolutions[i];
                newDistance = Math.abs(newResolution - resolution);
                if (newDistance > distance) {
                    break;
                }
                distance = newDistance;
                serverResolution = newResolution;
            }
            resolution = serverResolution;
        }
        return resolution;
    },

        getServerZoom: function() {
        var resolution = this.getServerResolution();
        return this.serverResolutions ?
            OpenLayers.Util.indexOf(this.serverResolutions, resolution) :
            this.map.getZoomForResolution(resolution) + (this.zoomOffset || 0);
    },

        applyBackBuffer: function(resolution) {
        if(this.backBufferTimerId !== null) {
            this.removeBackBuffer();
        }
        var backBuffer = this.backBuffer;
        if(!backBuffer) {
            backBuffer = this.createBackBuffer();
            if(!backBuffer) {
                return;
            }
            if (resolution === this.gridResolution) {
                this.div.insertBefore(backBuffer, this.div.firstChild);
            } else {
                this.map.baseLayer.div.parentNode.insertBefore(backBuffer, this.map.baseLayer.div);
            }
            this.backBuffer = backBuffer;
            var topLeftTileBounds = this.grid[0][0].bounds;
            this.backBufferLonLat = {
                lon: topLeftTileBounds.left,
                lat: topLeftTileBounds.top
            };
            this.backBufferResolution = this.gridResolution;
        }
        
        var ratio = this.backBufferResolution / resolution;
        var tiles = backBuffer.childNodes, tile;
        for (var i=tiles.length-1; i>=0; --i) {
            tile = tiles[i];
            tile.style.top = ((ratio * tile._i * backBuffer._th) | 0) + 'px';
            tile.style.left = ((ratio * tile._j * backBuffer._tw) | 0) + 'px';
            tile.style.width = Math.round(ratio * tile._w) + 'px';
            tile.style.height = Math.round(ratio * tile._h) + 'px';
        }
        var position = this.getViewPortPxFromLonLat(
                this.backBufferLonLat, resolution);
        var leftOffset = this.map.layerContainerOriginPx.x;
        var topOffset = this.map.layerContainerOriginPx.y;
        backBuffer.style.left = Math.round(position.x - leftOffset) + 'px';
        backBuffer.style.top = Math.round(position.y - topOffset) + 'px';
    },

        createBackBuffer: function() {
        var backBuffer;
        if(this.grid.length > 0) {
            backBuffer = document.createElement('div');
            backBuffer.id = this.div.id + '_bb';
            backBuffer.className = 'olBackBuffer';
            backBuffer.style.position = 'absolute';
            var map = this.map;
            backBuffer.style.zIndex = this.transitionEffect === 'resize' ?
                    this.getZIndex() - 1 :
                    map.Z_INDEX_BASE.BaseLayer -
                            (map.getNumLayers() - map.getLayerIndex(this));
            for(var i=0, lenI=this.grid.length; i<lenI; i++) {
                for(var j=0, lenJ=this.grid[i].length; j<lenJ; j++) {
                    var tile = this.grid[i][j],
                        markup = this.grid[i][j].createBackBuffer();
                    if (markup) {
                        markup._i = i;
                        markup._j = j;
                        markup._w = this.singleTile ?
                                this.getImageSize(tile.bounds).w : tile.size.w;
                        markup._h = tile.size.h;
                        markup.id = tile.id + '_bb';
                        backBuffer.appendChild(markup);
                    }
                }
            }
            backBuffer._tw = this.tileSize.w;
            backBuffer._th = this.tileSize.h;
        }
        return backBuffer;
    },

        removeBackBuffer: function() {
        if (this._transitionElement) {
            for (var i=this.transitionendEvents.length-1; i>=0; --i) {
                OpenLayers.Event.stopObserving(this._transitionElement,
                    this.transitionendEvents[i], this._removeBackBuffer);
            }
            delete this._transitionElement;
        }
        if(this.backBuffer) {
            if (this.backBuffer.parentNode) {
                this.backBuffer.parentNode.removeChild(this.backBuffer);
            }
            this.backBuffer = null;
            this.backBufferResolution = null;
            if(this.backBufferTimerId !== null) {
                window.clearTimeout(this.backBufferTimerId);
                this.backBufferTimerId = null;
            }
        }
    },

        moveByPx: function(dx, dy) {
        if (!this.singleTile) {
            this.moveGriddedTiles();
        }
    },

        setTileSize: function(size) { 
        if (this.singleTile) {
            size = this.map.getSize();
            size.h = parseInt(size.h * this.ratio, 10);
            size.w = parseInt(size.w * this.ratio, 10);
        } 
        OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this, [size]);
    },

        getTilesBounds: function() {    
        var bounds = null; 
        
        var length = this.grid.length;
        if (length) {
            var bottomLeftTileBounds = this.grid[length - 1][0].bounds,
                width = this.grid[0].length * bottomLeftTileBounds.getWidth(),
                height = this.grid.length * bottomLeftTileBounds.getHeight();
            
            bounds = new OpenLayers.Bounds(bottomLeftTileBounds.left, 
                                           bottomLeftTileBounds.bottom,
                                           bottomLeftTileBounds.left + width, 
                                           bottomLeftTileBounds.bottom + height);
        }   
        return bounds;
    },

        initSingleTile: function(bounds) {
        this.events.triggerEvent("retile");
        var center = bounds.getCenterLonLat();
        var tileWidth = bounds.getWidth() * this.ratio;
        var tileHeight = bounds.getHeight() * this.ratio;
                                       
        var tileBounds = 
            new OpenLayers.Bounds(center.lon - (tileWidth/2),
                                  center.lat - (tileHeight/2),
                                  center.lon + (tileWidth/2),
                                  center.lat + (tileHeight/2));
        this.gridResolution = this.getServerResolution();
        var maxExtent = this.maxExtent;
        if (maxExtent && (!this.displayOutsideMaxExtent ||
                (this.map.baseLayer.wrapDateLine &&
                this.maxExtent.equals(this.map.getMaxExtent())))) {
            tileBounds.left = Math.max(tileBounds.left, maxExtent.left);
            tileBounds.right = Math.min(tileBounds.right, maxExtent.right);
        }

        var px = this.map.getLayerPxFromLonLat({
            lon: tileBounds.left,
            lat: tileBounds.top
        });

        if (!this.grid.length) {
            this.grid[0] = [];
        }

        var tile = this.grid[0][0];
        if (!tile) {
            tile = this.addTile(tileBounds, px);

            this.addTileMonitoringHooks(tile);
            tile.draw();
            this.grid[0][0] = tile;
        } else {
            tile.moveTo(tileBounds, px);
        }           
        this.removeExcessTiles(1,1);
    },

        calculateGridLayout: function(bounds, origin, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - origin.lon;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        
        var rowSign = this.rowSign;

        var offsetlat = rowSign * (origin.lat - bounds.top + tilelat);  
        var tilerow = Math[~rowSign ? 'floor' : 'ceil'](offsetlat/tilelat) - this.buffer * rowSign;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          startcol: tilecol, startrow: tilerow
        };

    },

    getImageSize: function(bounds) {
        var tileSize = OpenLayers.Layer.HTTPRequest.prototype.getImageSize.apply(this, arguments);
        if (this.singleTile) {
            tileSize = new OpenLayers.Size(
                Math.round(bounds.getWidth() / this.gridResolution),
                tileSize.h
            );
        }
        return tileSize;
    },

        getTileOrigin: function() {
        var origin = this.tileOrigin;
        if (!origin) {
            var extent = this.getMaxExtent();
            var edges = ({
                "tl": ["left", "top"],
                "tr": ["right", "top"],
                "bl": ["left", "bottom"],
                "br": ["right", "bottom"]
            })[this.tileOriginCorner];
            origin = new OpenLayers.LonLat(extent[edges[0]], extent[edges[1]]);
        }
        return origin;
    },

        getTileBoundsForGridIndex: function(row, col) {
        var origin = this.getTileOrigin();
        var tileLayout = this.gridLayout;
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;
        var startcol = tileLayout.startcol;
        var startrow = tileLayout.startrow;
        var rowSign = this.rowSign;
        return new OpenLayers.Bounds(
            origin.lon + (startcol + col) * tilelon,
            origin.lat - (startrow + row * rowSign) * tilelat * rowSign,
            origin.lon + (startcol + col + 1) * tilelon,
            origin.lat - (startrow + (row - 1) * rowSign) * tilelat * rowSign
        );
    },

        initGriddedTiles:function(bounds) {
        this.events.triggerEvent("retile");

        var viewSize = this.map.getSize();
        
        var origin = this.getTileOrigin();
        var resolution = this.map.getResolution(),
            serverResolution = this.getServerResolution(),
            ratio = resolution / serverResolution,
            tileSize = {
                w: this.tileSize.w / ratio,
                h: this.tileSize.h / ratio
            };

        var minRows = Math.ceil(viewSize.h/tileSize.h) + 
                      2 * this.buffer + 1;
        var minCols = Math.ceil(viewSize.w/tileSize.w) +
                      2 * this.buffer + 1;

        var tileLayout = this.calculateGridLayout(bounds, origin, serverResolution);
        this.gridLayout = tileLayout;
        
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;
        
        var layerContainerDivLeft = this.map.layerContainerOriginPx.x;
        var layerContainerDivTop = this.map.layerContainerOriginPx.y;

        var tileBounds = this.getTileBoundsForGridIndex(0, 0);
        var startPx = this.map.getViewPortPxFromLonLat(
            new OpenLayers.LonLat(tileBounds.left, tileBounds.top)
        );
        startPx.x = Math.round(startPx.x) - layerContainerDivLeft;
        startPx.y = Math.round(startPx.y) - layerContainerDivTop;

        var tileData = [], center = this.map.getCenter();

        var rowidx = 0;
        do {
            var row = this.grid[rowidx];
            if (!row) {
                row = [];
                this.grid.push(row);
            }
            
            var colidx = 0;
            do {
                tileBounds = this.getTileBoundsForGridIndex(rowidx, colidx);
                var px = startPx.clone();
                px.x = px.x + colidx * Math.round(tileSize.w);
                px.y = px.y + rowidx * Math.round(tileSize.h);
                var tile = row[colidx];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    this.addTileMonitoringHooks(tile);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
                var tileCenter = tileBounds.getCenterLonLat();
                tileData.push({
                    tile: tile,
                    distance: Math.pow(tileCenter.lon - center.lon, 2) +
                        Math.pow(tileCenter.lat - center.lat, 2)
                });
     
                colidx += 1;
            } while ((tileBounds.right <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols);
             
            rowidx += 1;
        } while((tileBounds.bottom >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows);
        this.removeExcessTiles(rowidx, colidx);

        var resolution = this.getServerResolution();
        this.gridResolution = resolution;
        tileData.sort(function(a, b) {
            return a.distance - b.distance; 
        });
        for (var i=0, ii=tileData.length; i<ii; ++i) {
            tileData[i].tile.draw();
        }
    },

        getMaxExtent: function() {
        return this.maxExtent;
    },

        addTile: function(bounds, position) {
        var tile = new this.tileClass(
            this, position, bounds, null, this.tileSize, this.tileOptions
        );
        this.events.triggerEvent("addtile", {tile: tile});
        return tile;
    },
    
        addTileMonitoringHooks: function(tile) {
        
        var replacingCls = 'olTileReplacing';

        tile.onLoadStart = function() {
            if (this.loading === false) {
                this.loading = true;
                this.events.triggerEvent("loadstart");
            }
            this.events.triggerEvent("tileloadstart", {tile: tile});
            this.numLoadingTiles++;
            if (!this.singleTile && this.backBuffer && this.gridResolution === this.backBufferResolution) {
                OpenLayers.Element.addClass(tile.getTile(), replacingCls);
            }
        };
      
        tile.onLoadEnd = function(evt) {
            this.numLoadingTiles--;
            var aborted = evt.type === 'unload';
            this.events.triggerEvent("tileloaded", {
                tile: tile,
                aborted: aborted
            });
            if (!this.singleTile && !aborted && this.backBuffer && this.gridResolution === this.backBufferResolution) {
                var tileDiv = tile.getTile();
                if (OpenLayers.Element.getStyle(tileDiv, 'display') === 'none') {
                    var bufferTile = document.getElementById(tile.id + '_bb');
                    if (bufferTile) {
                        bufferTile.parentNode.removeChild(bufferTile);
                    }
                }
                OpenLayers.Element.removeClass(tileDiv, replacingCls);
            }
            if (this.numLoadingTiles === 0) {
                if (this.backBuffer) {
                    if (this.backBuffer.childNodes.length === 0) {
                        this.removeBackBuffer();
                    } else {
                        this._transitionElement = aborted ?
                            this.div.lastChild : tile.imgDiv;
                        var transitionendEvents = this.transitionendEvents;
                        for (var i=transitionendEvents.length-1; i>=0; --i) {
                            OpenLayers.Event.observe(this._transitionElement,
                                transitionendEvents[i],
                                this._removeBackBuffer);
                        }
                        this.backBufferTimerId = window.setTimeout(
                            this._removeBackBuffer, this.removeBackBufferDelay
                        );
                    }
                }
                this.loading = false;
                this.events.triggerEvent("loadend");
            }
        };
        
        tile.onLoadError = function() {
            this.events.triggerEvent("tileerror", {tile: tile});
        };
        
        tile.events.on({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            "loaderror": tile.onLoadError,
            scope: this
        });
    },

        removeTileMonitoringHooks: function(tile) {
        tile.unload();
        tile.events.un({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            "loaderror": tile.onLoadError,
            scope: this
        });
    },
    
        moveGriddedTiles: function() {
        var buffer = this.buffer + 1;
        while(true) {
            var tlTile = this.grid[0][0];
            var tlViewPort = {
                x: tlTile.position.x +
                    this.map.layerContainerOriginPx.x,
                y: tlTile.position.y +
                    this.map.layerContainerOriginPx.y
            };
            var ratio = this.getServerResolution() / this.map.getResolution();
            var tileSize = {
                w: Math.round(this.tileSize.w * ratio),
                h: Math.round(this.tileSize.h * ratio)
            };
            if (tlViewPort.x > -tileSize.w * (buffer - 1)) {
                this.shiftColumn(true, tileSize);
            } else if (tlViewPort.x < -tileSize.w * buffer) {
                this.shiftColumn(false, tileSize);
            } else if (tlViewPort.y > -tileSize.h * (buffer - 1)) {
                this.shiftRow(true, tileSize);
            } else if (tlViewPort.y < -tileSize.h * buffer) {
                this.shiftRow(false, tileSize);
            } else {
                break;
            }
        }
    },

        shiftRow: function(prepend, tileSize) {
        var grid = this.grid;
        var rowIndex = prepend ? 0 : (grid.length - 1);
        var sign = prepend ? -1 : 1;
        var rowSign = this.rowSign;
        var tileLayout = this.gridLayout;
        tileLayout.startrow += sign * rowSign;

        var modelRow = grid[rowIndex];
        var row = grid[prepend ? 'pop' : 'shift']();
        for (var i=0, len=row.length; i<len; i++) {
            var tile = row[i];
            var position = modelRow[i].position.clone();
            position.y += tileSize.h * sign;
            tile.moveTo(this.getTileBoundsForGridIndex(rowIndex, i), position);
        }
        grid[prepend ? 'unshift' : 'push'](row);
    },

        shiftColumn: function(prepend, tileSize) {
        var grid = this.grid;
        var colIndex = prepend ? 0 : (grid[0].length - 1);
        var sign = prepend ? -1 : 1;
        var tileLayout = this.gridLayout;
        tileLayout.startcol += sign;

        for (var i=0, len=grid.length; i<len; i++) {
            var row = grid[i];
            var position = row[colIndex].position.clone();
            var tile = row[prepend ? 'pop' : 'shift']();            
            position.x += tileSize.w * sign;
            tile.moveTo(this.getTileBoundsForGridIndex(i, colIndex), position);
            row[prepend ? 'unshift' : 'push'](tile);
        }
    },

        removeExcessTiles: function(rows, columns) {
        var i, l;
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                this.destroyTile(tile);
            }
        }
        for (i=0, l=this.grid.length; i<l; i++) {
            while (this.grid[i].length > columns) {
                var row = this.grid[i];
                var tile = row.pop();
                this.destroyTile(tile);
            }
        }
    },

        onMapResize: function() {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize();
        }
    },
    
        getTileBounds: function(viewPortPx) {
        var maxExtent = this.maxExtent;
        var resolution = this.getResolution();
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        var tileLeft = maxExtent.left + (tileMapWidth *
                                         Math.floor((mapPoint.lon -
                                                     maxExtent.left) /
                                                    tileMapWidth));
        var tileBottom = maxExtent.bottom + (tileMapHeight *
                                             Math.floor((mapPoint.lat -
                                                         maxExtent.bottom) /
                                                        tileMapHeight));
        return new OpenLayers.Bounds(tileLeft, tileBottom,
                                     tileLeft + tileMapWidth,
                                     tileBottom + tileMapHeight);
    },

    CLASS_NAME: "OpenLayers.Layer.Grid"
});
