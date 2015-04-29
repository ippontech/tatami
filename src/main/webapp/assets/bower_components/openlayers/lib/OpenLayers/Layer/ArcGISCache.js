/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

    url: null,
    
        tileOrigin: null, 
   
        tileSize: new OpenLayers.Size(256, 256),
    
        type: 'png',
    
        useScales: false,
    
        overrideDPI: false,

        hexZoom: false,
    
        getContainingTileCoords: function(point, res) {
        return new OpenLayers.Pixel(
           Math.max(Math.floor((point.x - this.tileOrigin.lon) / (this.tileSize.w * res)),0),
           Math.max(Math.floor((this.tileOrigin.lat - point.y) / (this.tileSize.h * res)),0)
        );
    },
    
        calculateMaxExtentWithLOD: function(lod) {

        var numTileCols = (lod.endTileCol - lod.startTileCol) + 1;
        var numTileRows = (lod.endTileRow - lod.startTileRow) + 1;        

        var minX = this.tileOrigin.lon + (lod.startTileCol * this.tileSize.w * lod.resolution);
        var maxX = minX + (numTileCols * this.tileSize.w * lod.resolution);

        var maxY = this.tileOrigin.lat - (lod.startTileRow * this.tileSize.h * lod.resolution);
        var minY = maxY - (numTileRows * this.tileSize.h * lod.resolution);
        return new OpenLayers.Bounds(minX, minY, maxX, maxY);
    },
    
        calculateMaxExtentWithExtent: function(extent, res) {
        var upperLeft = new OpenLayers.Geometry.Point(extent.left, extent.top);
        var bottomRight = new OpenLayers.Geometry.Point(extent.right, extent.bottom);
        var start = this.getContainingTileCoords(upperLeft, res);
        var end = this.getContainingTileCoords(bottomRight, res);
        var lod = {
            resolution: res,
            startTileCol: start.x,
            startTileRow: start.y,
            endTileCol: end.x,
            endTileRow: end.y
        };
        return this.calculateMaxExtentWithLOD(lod);
    },
    
        getUpperLeftTileCoord: function(res) {
        var upperLeft = new OpenLayers.Geometry.Point(
            this.maxExtent.left,
            this.maxExtent.top);
        return this.getContainingTileCoords(upperLeft, res);
    },

        getLowerRightTileCoord: function(res) {
        var bottomRight = new OpenLayers.Geometry.Point(
            this.maxExtent.right,
            this.maxExtent.bottom);
        return this.getContainingTileCoords(bottomRight, res);
    },
    
        initGriddedTiles: function(bounds) {
        delete this._tileOrigin;
        OpenLayers.Layer.XYZ.prototype.initGriddedTiles.apply(this, arguments);
    },
    
        getMaxExtent: function() {
        var resolution = this.map.getResolution();
        return this.maxExtent = this.getMaxExtentForResolution(resolution);
    },

        getTileOrigin: function() {
        if (!this._tileOrigin) {
            var extent = this.getMaxExtent();
            this._tileOrigin = new OpenLayers.LonLat(extent.left, extent.bottom);
        }
        return this._tileOrigin;
    },

        getURL: function (bounds) {
        var res = this.getResolution(); 
        var originTileX = (this.tileOrigin.lon + (res * this.tileSize.w/2)); 
        var originTileY = (this.tileOrigin.lat - (res * this.tileSize.h/2));

        var center = bounds.getCenterLonLat();
        var point = { x: center.lon, y: center.lat };
        var x = (Math.round(Math.abs((center.lon - originTileX) / (res * this.tileSize.w)))); 
        var y = (Math.round(Math.abs((originTileY - center.lat) / (res * this.tileSize.h)))); 
        var z = this.map.getZoom();
        if (this.lods) {        
            var lod = this.lods[this.map.getZoom()];
            if ((x < lod.startTileCol || x > lod.endTileCol) 
                || (y < lod.startTileRow || y > lod.endTileRow)) {
                    return null;
            }
        }
        else {
            var start = this.getUpperLeftTileCoord(res);
            var end = this.getLowerRightTileCoord(res);
            if ((x < start.x || x >= end.x)
                || (y < start.y || y >= end.y)) {
                    return null;
            }        
        }
        var url = this.url;
        var s = '' + x + y + z;

        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(s, url);
        }
        if (this.useArcGISServer) {
            url = url + '/tile/${z}/${y}/${x}';
        } else {
            x = 'C' + OpenLayers.Number.zeroPad(x, 8, 16);
            y = 'R' + OpenLayers.Number.zeroPad(y, 8, 16);
            z = 'L' + OpenLayers.Number.zeroPad(z, 2, this.hexZoom ? 16 : 10);
            url = url + '/${z}/${y}/${x}.' + this.type;
        }
        url = OpenLayers.String.format(url, {'x': x, 'y': y, 'z': z});

        return OpenLayers.Util.urlAppend(
            url, OpenLayers.Util.getParameterString(this.params)
        );
    },

    CLASS_NAME: 'OpenLayers.Layer.ArcGISCache' 
});
