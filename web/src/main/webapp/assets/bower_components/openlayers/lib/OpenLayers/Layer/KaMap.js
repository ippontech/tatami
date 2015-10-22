/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.KaMap = OpenLayers.Class(OpenLayers.Layer.Grid, {

        DEFAULT_PARAMS: {
        i: 'jpeg',
        map: ''
    },
        
        initialize: function(name, url, params, options) {
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);
        this.params = OpenLayers.Util.applyDefaults(
            this.params, this.DEFAULT_PARAMS
        );
    },

        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var mapRes = this.map.getResolution();
        var scale = Math.round((this.map.getScale() * 10000)) / 10000;
        var pX = Math.round(bounds.left / mapRes);
        var pY = -Math.round(bounds.top / mapRes);
        return this.getFullRequestString(
                      { t: pY, 
                        l: pX,
                        s: scale
                      });
    },

        calculateGridLayout: function(bounds, origin, resolution) {
        var tilelon = resolution*this.tileSize.w;
        var tilelat = resolution*this.tileSize.h;
        
        var offsetlon = bounds.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        
        var offsetlat = bounds.top;  
        var tilerow = Math.floor(offsetlat/tilelat) + this.buffer;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          startcol: tilecol, startrow: tilerow
        };
    },    

        getTileBoundsForGridIndex: function(row, col) {
        var origin = this.getTileOrigin();
        var tileLayout = this.gridLayout;
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;
        var minX = (tileLayout.startcol + col) * tilelon;
        var minY = (tileLayout.startrow - row) * tilelat;
        return new OpenLayers.Bounds(
            minX, minY,
            minX + tilelon, minY + tilelat
        );
    },

        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.KaMap(this.name,
                                            this.url,
                                            this.params,
                                            this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        obj.grid = [];

        return obj;
    },    
    
        getTileBounds: function(viewPortPx) {
        var resolution = this.getResolution();
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        var tileLeft = tileMapWidth * Math.floor(mapPoint.lon / tileMapWidth);
        var tileBottom = tileMapHeight * Math.floor(mapPoint.lat / tileMapHeight);
        return new OpenLayers.Bounds(tileLeft, tileBottom,
                                     tileLeft + tileMapWidth,
                                     tileBottom + tileMapHeight);
    },

    CLASS_NAME: "OpenLayers.Layer.KaMap"
});
