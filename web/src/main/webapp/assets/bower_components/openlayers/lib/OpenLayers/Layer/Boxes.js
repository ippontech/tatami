/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.Boxes = OpenLayers.Class(OpenLayers.Layer.Markers, {

        
        drawMarker: function(marker) {
        var topleft = this.map.getLayerPxFromLonLat({
            lon: marker.bounds.left,
            lat: marker.bounds.top
        });
        var botright = this.map.getLayerPxFromLonLat({
            lon: marker.bounds.right,
            lat: marker.bounds.bottom
        });
        if (botright == null || topleft == null) {
            marker.display(false);
        } else {
            var markerDiv = marker.draw(topleft, {
                w: Math.max(1, botright.x - topleft.x),
                h: Math.max(1, botright.y - topleft.y)
            });
            if (!marker.drawn) {
                this.div.appendChild(markerDiv);
                marker.drawn = true;
            }
        }
    },


        removeMarker: function(marker) {
        OpenLayers.Util.removeItem(this.markers, marker);
        if ((marker.div != null) &&
            (marker.div.parentNode == this.div) ) {
            this.div.removeChild(marker.div);    
        }
    },

    CLASS_NAME: "OpenLayers.Layer.Boxes"
});
