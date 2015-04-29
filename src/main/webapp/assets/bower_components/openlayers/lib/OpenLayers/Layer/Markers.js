/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.Markers = OpenLayers.Class(OpenLayers.Layer, {
    
        isBaseLayer: false,
    
        markers: null,


        drawn: false,
    
        initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        this.markers = [];
    },
    
        destroy: function() {
        this.clearMarkers();
        this.markers = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },

        setOpacity: function(opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            for (var i=0, len=this.markers.length; i<len; i++) {
                this.markers[i].setOpacity(this.opacity);
            }
        }
    },

        moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        if (zoomChanged || !this.drawn) {
            for(var i=0, len=this.markers.length; i<len; i++) {
                this.drawMarker(this.markers[i]);
            }
            this.drawn = true;
        }
    },

        addMarker: function(marker) {
        this.markers.push(marker);

        if (this.opacity < 1) {
            marker.setOpacity(this.opacity);
        }

        if (this.map && this.map.getExtent()) {
            marker.map = this.map;
            this.drawMarker(marker);
        }
    },

        removeMarker: function(marker) {
        if (this.markers && this.markers.length) {
            OpenLayers.Util.removeItem(this.markers, marker);
            marker.erase();
        }
    },

        clearMarkers: function() {
        if (this.markers != null) {
            while(this.markers.length > 0) {
                this.removeMarker(this.markers[0]);
            }
        }
    },

        drawMarker: function(marker) {
        var px = this.map.getLayerPxFromLonLat(marker.lonlat);
        if (px == null) {
            marker.display(false);
        } else {
            if (!marker.isDrawn()) {
                var markerImg = marker.draw(px);
                this.div.appendChild(markerImg);
            } else if(marker.icon) {
                marker.icon.moveTo(px);
            }
        }
    },
    
        getDataExtent: function () {
        var maxExtent = null;
        
        if ( this.markers && (this.markers.length > 0)) {
            var maxExtent = new OpenLayers.Bounds();
            for(var i=0, len=this.markers.length; i<len; i++) {
                var marker = this.markers[i];
                maxExtent.extend(marker.lonlat);
            }
        }

        return maxExtent;
    },

    CLASS_NAME: "OpenLayers.Layer.Markers"
});
