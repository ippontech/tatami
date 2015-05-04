/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.PinchZoom = OpenLayers.Class(OpenLayers.Control, {

        type: OpenLayers.Control.TYPE_TOOL,

        pinchOrigin: null,    
    
        currentCenter: null,    

        autoActivate: true,

        preserveCenter: false,
    
    
        initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.handler = new OpenLayers.Handler.Pinch(this, {
            start: this.pinchStart,
            move: this.pinchMove,
            done: this.pinchDone
        }, this.handlerOptions);
    },
    
        pinchStart: function(evt, pinchData) {
        var xy = (this.preserveCenter) ?
            this.map.getPixelFromLonLat(this.map.getCenter()) : evt.xy;
        this.pinchOrigin = xy;
        this.currentCenter = xy;
    },
    
        pinchMove: function(evt, pinchData) {
        var scale = pinchData.scale;
        var containerOrigin = this.map.layerContainerOriginPx;
        var pinchOrigin = this.pinchOrigin;
        var current = (this.preserveCenter) ?
            this.map.getPixelFromLonLat(this.map.getCenter()) : evt.xy;

        var dx = Math.round((containerOrigin.x + current.x - pinchOrigin.x) + (scale - 1) * (containerOrigin.x - pinchOrigin.x));
        var dy = Math.round((containerOrigin.y + current.y - pinchOrigin.y) + (scale - 1) * (containerOrigin.y - pinchOrigin.y));

        this.map.applyTransform(dx, dy, scale);
        this.currentCenter = current;
    },

        pinchDone: function(evt, start, last) {
        this.map.applyTransform();
        var zoom = this.map.getZoomForResolution(this.map.getResolution() / last.scale, true);
        if (zoom !== this.map.getZoom() || !this.currentCenter.equals(this.pinchOrigin)) {
            var resolution = this.map.getResolutionForZoom(zoom);

            var location = this.map.getLonLatFromPixel(this.pinchOrigin);
            var zoomPixel = this.currentCenter;        
            var size = this.map.getSize();

            location.lon += resolution * ((size.w / 2) - zoomPixel.x);
            location.lat -= resolution * ((size.h / 2) - zoomPixel.y);
            this.map.div.clientWidth = this.map.div.clientWidth;

            this.map.setCenter(location, zoom);
        }
    },

    CLASS_NAME: "OpenLayers.Control.PinchZoom"

});
