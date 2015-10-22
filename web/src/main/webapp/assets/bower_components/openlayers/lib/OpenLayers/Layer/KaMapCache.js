/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.KaMapCache = OpenLayers.Class(OpenLayers.Layer.KaMap, {

        IMAGE_EXTENSIONS: {
        'jpeg': 'jpg',
        'gif' : 'gif',
        'png' : 'png',
        'png8' : 'png',
        'png24' : 'png',
        'dithered' : 'png'
    },
    
        DEFAULT_FORMAT: 'jpeg',
    
        initialize: function(name, url, params, options) {
        OpenLayers.Layer.KaMap.prototype.initialize.apply(this, arguments);
        this.extension = this.IMAGE_EXTENSIONS[this.params.i.toLowerCase() || this.DEFAULT_FORMAT];
    },

        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var mapRes = this.map.getResolution();
        var scale = Math.round((this.map.getScale() * 10000)) / 10000;
        var pX = Math.round(bounds.left / mapRes);
        var pY = -Math.round(bounds.top / mapRes);

        var metaX = Math.floor(pX / this.tileSize.w / this.params.metaTileSize.w) * this.tileSize.w * this.params.metaTileSize.w;
        var metaY = Math.floor(pY / this.tileSize.h / this.params.metaTileSize.h) * this.tileSize.h * this.params.metaTileSize.h;
    
        var components = [
            "/",
            this.params.map,
            "/",
            scale,
            "/",
            this.params.g.replace(/\s/g, '_'),
            "/def/t", 
            metaY,
            "/l",
            metaX,
            "/t",
            pY,
            "l",
            pX,
            ".",
            this.extension
          ];

        var url = this.url;

        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(components.join(''), url);
        }
        return url + components.join("");
    },

    CLASS_NAME: "OpenLayers.Layer.KaMapCache"
});
