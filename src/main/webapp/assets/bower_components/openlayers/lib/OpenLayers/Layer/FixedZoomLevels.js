/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.FixedZoomLevels = OpenLayers.Class({
      
    /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions must all be implemented   */
  /*                  by all base layers                  */
  /*                                                      */
      
        initialize: function() {
    },
    
        initResolutions: function() {

        var props = ['minZoomLevel', 'maxZoomLevel', 'numZoomLevels'];
          
        for(var i=0, len=props.length; i<len; i++) {
            var property = props[i];
            this[property] = (this.options[property] != null)  
                                     ? this.options[property] 
                                     : this.map[property];
        }

        if ( (this.minZoomLevel == null) ||
             (this.minZoomLevel < this.MIN_ZOOM_LEVEL) ){
            this.minZoomLevel = this.MIN_ZOOM_LEVEL;
        }        
        var desiredZoomLevels;
        var limitZoomLevels = this.MAX_ZOOM_LEVEL - this.minZoomLevel + 1;

        if ( ((this.options.numZoomLevels == null) && 
              (this.options.maxZoomLevel != null)) // (2)
              ||
             ((this.numZoomLevels == null) &&
              (this.maxZoomLevel != null)) // (4)
           ) {
            desiredZoomLevels = this.maxZoomLevel - this.minZoomLevel + 1;
        } else {
            desiredZoomLevels = this.numZoomLevels;
        }

        if (desiredZoomLevels != null) {
            this.numZoomLevels = Math.min(desiredZoomLevels, limitZoomLevels);
        } else {
            this.numZoomLevels = limitZoomLevels;
        }
        this.maxZoomLevel = this.minZoomLevel + this.numZoomLevels - 1;

        if (this.RESOLUTIONS != null) {
            var resolutionsIndex = 0;
            this.resolutions = [];
            for(var i= this.minZoomLevel; i <= this.maxZoomLevel; i++) {
                this.resolutions[resolutionsIndex++] = this.RESOLUTIONS[i];            
            }
            this.maxResolution = this.resolutions[0];
            this.minResolution = this.resolutions[this.resolutions.length - 1];
        }       
    },
    
        getResolution: function() {

        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getResolution.apply(this, arguments);
        } else {
            var resolution = null;
            
            var viewSize = this.map.getSize();
            var extent = this.getExtent();
            
            if ((viewSize != null) && (extent != null)) {
                resolution = Math.max( extent.getWidth()  / viewSize.w,
                                       extent.getHeight() / viewSize.h );
            }
            return resolution;
        }
     },

        getExtent: function () {
        var size = this.map.getSize();
        var tl = this.getLonLatFromViewPortPx({
            x: 0, y: 0
        });
        var br = this.getLonLatFromViewPortPx({
            x: size.w, y: size.h
        });
        
        if ((tl != null) && (br != null)) {
            return new OpenLayers.Bounds(tl.lon, br.lat, br.lon, tl.lat);
        } else {
            return null;
        }
    },

        getZoomForResolution: function(resolution) {
      
        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getZoomForResolution.apply(this, arguments);
        } else {
            var extent = OpenLayers.Layer.prototype.getExtent.apply(this, []);
            return this.getZoomForExtent(extent);
        }
    },



    
        /*                                                      */
    /*             Translation Functions                    */
    /*                                                      */
    /*    The following functions translate GMaps and OL    */ 
    /*     formats for Pixel, LonLat, Bounds, and Zoom      */
    /*                                                      */
  
        getOLZoomFromMapObjectZoom: function(moZoom) {
        var zoom = null;
        if (moZoom != null) {
            zoom = moZoom - this.minZoomLevel;
            if (this.map.baseLayer !== this) {
                zoom = this.map.baseLayer.getZoomForResolution(
                    this.getResolutionForZoom(zoom)
                );
            }
        }
        return zoom;
    },
    
        getMapObjectZoomFromOLZoom: function(olZoom) {
        var zoom = null; 
        if (olZoom != null) {
            zoom = olZoom + this.minZoomLevel;
            if (this.map.baseLayer !== this) {
                zoom = this.getZoomForResolution(
                    this.map.baseLayer.getResolutionForZoom(zoom)
                );
            }
        }
        return zoom;
    },

    CLASS_NAME: "OpenLayers.Layer.FixedZoomLevels"
});

