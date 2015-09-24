/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.TMS = OpenLayers.Class(OpenLayers.Layer.Grid, {

        serviceVersion: "1.0.0",

        layername: null,

        type: null,

        isBaseLayer: true,

        tileOrigin: null,

        serverResolutions: null,

        zoomOffset: 0,
    
        initialize: function(name, url, options) {
        var newArguments = [];
        newArguments.push(name, url, {}, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
    },    

        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.TMS(this.name,
                                           this.url,
                                           this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },    
    
        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
        var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
        var z = this.getServerZoom();
        var path = this.serviceVersion + "/" + this.layername + "/" + z + "/" + x + "/" + y + "." + this.type; 
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(path, url);
        }
        return url + path;
    },

        setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) { 
            this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                                                this.map.maxExtent.bottom);
        }                                       
    },

    CLASS_NAME: "OpenLayers.Layer.TMS"
});
