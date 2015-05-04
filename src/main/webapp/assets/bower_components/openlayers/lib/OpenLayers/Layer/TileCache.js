/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.TileCache = OpenLayers.Class(OpenLayers.Layer.Grid, {

        isBaseLayer: true,
    
        format: 'image/png',

        serverResolutions: null,

        initialize: function(name, url, layername, options) {
        this.layername = layername;
        OpenLayers.Layer.Grid.prototype.initialize.apply(this,
                                                         [name, url, {}, options]);
        this.extension = this.format.split('/')[1].toLowerCase();
        this.extension = (this.extension == 'jpg') ? 'jpeg' : this.extension;
    },    

        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.TileCache(this.name,
                                                 this.url,
                                                 this.layername,
                                                 this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },    
    
        getURL: function(bounds) {
        var res = this.getServerResolution();
        var bbox = this.maxExtent;
        var size = this.tileSize;
        var tileX = Math.round((bounds.left - bbox.left) / (res * size.w));
        var tileY = Math.round((bounds.bottom - bbox.bottom) / (res * size.h));
        var tileZ = this.serverResolutions != null ?
            OpenLayers.Util.indexOf(this.serverResolutions, res) :
            this.map.getZoom();

        var components = [
            this.layername,
            OpenLayers.Number.zeroPad(tileZ, 2),
            OpenLayers.Number.zeroPad(parseInt(tileX / 1000000), 3),
            OpenLayers.Number.zeroPad((parseInt(tileX / 1000) % 1000), 3),
            OpenLayers.Number.zeroPad((parseInt(tileX) % 1000), 3),
            OpenLayers.Number.zeroPad(parseInt(tileY / 1000000), 3),
            OpenLayers.Number.zeroPad((parseInt(tileY / 1000) % 1000), 3),
            OpenLayers.Number.zeroPad((parseInt(tileY) % 1000), 3) + '.' + this.extension
        ];
        var path = components.join('/'); 
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(path, url);
        }
        url = (url.charAt(url.length - 1) == '/') ? url : url + '/';
        return url + path;
    },
    
    CLASS_NAME: "OpenLayers.Layer.TileCache"
});
