/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/*
 * Development supported by a R&D grant DC08P02OUK006 - Old Maps Online
 * (www.oldmapsonline.org) from Ministry of Culture of the Czech Republic.
 */



OpenLayers.Layer.Zoomify = OpenLayers.Class(OpenLayers.Layer.Grid, {

        size: null,

        isBaseLayer: true,

        standardTileSize: 256,

        tileOriginCorner: "tl",

        numberOfTiers: 0,

        tileCountUpToTier: null,

        tierSizeInTiles: null,

        tierImageSize: null,

        initialize: function(name, url, size, options) {
        this.initializeZoomify(size);

        OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            name, url, {}, options
        ]);
    },

        initializeZoomify: function( size ) {

        var imageSize = size.clone();
        this.size = size.clone();
        var tiles = new OpenLayers.Size(
            Math.ceil( imageSize.w / this.standardTileSize ),
            Math.ceil( imageSize.h / this.standardTileSize )
            );

        this.tierSizeInTiles = [tiles];
        this.tierImageSize = [imageSize];

        while (imageSize.w > this.standardTileSize ||
               imageSize.h > this.standardTileSize ) {

            imageSize = new OpenLayers.Size(
                Math.floor( imageSize.w / 2 ),
                Math.floor( imageSize.h / 2 )
                );
            tiles = new OpenLayers.Size(
                Math.ceil( imageSize.w / this.standardTileSize ),
                Math.ceil( imageSize.h / this.standardTileSize )
                );
            this.tierSizeInTiles.push( tiles );
            this.tierImageSize.push( imageSize );
        }

        this.tierSizeInTiles.reverse();
        this.tierImageSize.reverse();

        this.numberOfTiers = this.tierSizeInTiles.length;
        var resolutions = [1];
        this.tileCountUpToTier = [0];
        for (var i = 1; i < this.numberOfTiers; i++) {
            resolutions.unshift(Math.pow(2, i));
            this.tileCountUpToTier.push(
                this.tierSizeInTiles[i-1].w * this.tierSizeInTiles[i-1].h +
                this.tileCountUpToTier[i-1]
                );
        }
        if (!this.serverResolutions) {
            this.serverResolutions = resolutions;
        }
    },

        destroy: function() {
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);
        this.tileCountUpToTier.length = 0;
        this.tierSizeInTiles.length = 0;
        this.tierImageSize.length = 0;

    },

        clone: function (obj) {

        if (obj == null) {
            obj = new OpenLayers.Layer.Zoomify(this.name,
                                           this.url,
                                           this.size,
                                           this.options);
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },

        createBackBuffer: function() {
        var backBuffer = OpenLayers.Layer.Grid.prototype.createBackBuffer.apply(this, arguments);
        if(backBuffer) {
            var image;
            for (var i=backBuffer.childNodes.length-1; i>=0; --i) {
                image = backBuffer.childNodes[i];
                image._w = image.width;
                image._h = image.height;
            }
        }
        return backBuffer;
    },

        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
        var y = Math.round((this.tileOrigin.lat - bounds.top) / (res * this.tileSize.h));
        var z = this.getZoomForResolution( res );

        var tileIndex = x + y * this.tierSizeInTiles[z].w + this.tileCountUpToTier[z];
        var path = "TileGroup" + Math.floor( (tileIndex) / 256 ) +
            "/" + z + "-" + x + "-" + y + ".jpg";
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(path, url);
        }
        return url + path;
    },

        getImageSize: function() {
        if (arguments.length > 0) {
            var bounds = this.adjustBounds(arguments[0]);
            var res = this.getServerResolution();
            var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
            var y = Math.round((this.tileOrigin.lat - bounds.top) / (res * this.tileSize.h));
            var z = this.getZoomForResolution( res );
            var w = this.standardTileSize;
            var h = this.standardTileSize;
            if (x == this.tierSizeInTiles[z].w -1 ) {
                var w = this.tierImageSize[z].w % this.standardTileSize;
                if (w == 0) {
                    w = this.standardTileSize;
                }
            }
            if (y == this.tierSizeInTiles[z].h -1 ) {
                var h = this.tierImageSize[z].h % this.standardTileSize;
                if (h == 0) {
                    h = this.standardTileSize;
                }
            }
            if (x == this.tierSizeInTiles[z].w) {
                w = Math.ceil(this.size.w / Math.pow(2, this.numberOfTiers - 1 - z) - this.tierImageSize[z].w);
            }
            if (y == this.tierSizeInTiles[z].h) {
                h = Math.ceil(this.size.h / Math.pow(2, this.numberOfTiers - 1 - z) - this.tierImageSize[z].h);
            }
            return (new OpenLayers.Size(w, h));
        } else {
            return this.tileSize;
        }
    },

        setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                                                this.map.maxExtent.top);
    },

    CLASS_NAME: "OpenLayers.Layer.Zoomify"
});
