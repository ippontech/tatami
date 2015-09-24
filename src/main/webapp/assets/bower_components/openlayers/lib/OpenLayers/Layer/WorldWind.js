/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.WorldWind = OpenLayers.Class(OpenLayers.Layer.Grid, {
    
    DEFAULT_PARAMS: {
    },

        isBaseLayer: true,

        lzd: null,

        zoomLevels: null,
    
        initialize: function(name, url, lzd, zoomLevels, params, options) {
        this.lzd = lzd;
        this.zoomLevels = zoomLevels;
        var newArguments = [];
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        this.params = OpenLayers.Util.applyDefaults(
            this.params, this.DEFAULT_PARAMS
        );
    },

        getZoom: function () {
        var zoom = this.map.getZoom();
        var extent = this.map.getMaxExtent();
        zoom = zoom - Math.log(this.maxResolution / (this.lzd/512))/Math.log(2);
        return zoom;
    },

        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var zoom = this.getZoom();
        var extent = this.map.getMaxExtent();
        var deg = this.lzd/Math.pow(2,this.getZoom());
        var x = Math.floor((bounds.left - extent.left)/deg);
        var y = Math.floor((bounds.bottom - extent.bottom)/deg);
        if (this.map.getResolution() <= (this.lzd/512)
            && this.getZoom() <= this.zoomLevels) {
            return this.getFullRequestString(
              { L: zoom, 
                X: x,
                Y: y
              });
        } else {
            return OpenLayers.Util.getImageLocation("blank.gif");
        }

    },

    CLASS_NAME: "OpenLayers.Layer.WorldWind"
});
