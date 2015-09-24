/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.ZoomBox = OpenLayers.Class(OpenLayers.Control, {
        type: OpenLayers.Control.TYPE_TOOL,

        out: false,

        keyMask: null,

        alwaysZoom: false,
    
        zoomOnClick: true,

        zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var bounds,
                targetCenterPx = position.getCenterPixel();
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel({
                    x: position.left,
                    y: position.bottom
                });
                var maxXY = this.map.getLonLatFromPixel({
                    x: position.right,
                    y: position.top
                });
                bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = position.right - position.left;
                var pixHeight = position.bottom - position.top;
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(targetCenterPx);
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
            var lastZoom = this.map.getZoom(),
                size = this.map.getSize(),
                centerPx = {x: size.w / 2, y: size.h / 2},
                zoom = this.map.getZoomForExtent(bounds),
                oldRes = this.map.getResolution(),
                newRes = this.map.getResolutionForZoom(zoom);
            if (oldRes == newRes) {
                this.map.setCenter(this.map.getLonLatFromPixel(targetCenterPx));
            } else {
              var zoomOriginPx = {
                    x: (oldRes * targetCenterPx.x - newRes * centerPx.x) /
                        (oldRes - newRes),
                    y: (oldRes * targetCenterPx.y - newRes * centerPx.y) /
                        (oldRes - newRes)
                };
                this.map.zoomTo(zoom, zoomOriginPx);
            }
            if (lastZoom == this.map.getZoom() && this.alwaysZoom == true){ 
                this.map.zoomTo(lastZoom + (this.out ? -1 : 1)); 
            }
        } else if (this.zoomOnClick) { // it's a pixel
            if (!this.out) {
                this.map.zoomTo(this.map.getZoom() + 1, position);
            } else {
                this.map.zoomTo(this.map.getZoom() - 1, position);
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.ZoomBox"
});
