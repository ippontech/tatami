/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Popup.Anchored = 
  OpenLayers.Class(OpenLayers.Popup, {

        relativePosition: null,
    
        keepInMap: true,

        anchor: null,

        initialize:function(id, lonlat, contentSize, contentHTML, anchor, closeBox,
                        closeBoxCallback) {
        var newArguments = [
            id, lonlat, contentSize, contentHTML, closeBox, closeBoxCallback
        ];
        OpenLayers.Popup.prototype.initialize.apply(this, newArguments);

        this.anchor = (anchor != null) ? anchor 
                                       : { size: new OpenLayers.Size(0,0),
                                           offset: new OpenLayers.Pixel(0,0)};
    },

        destroy: function() {
        this.anchor = null;
        this.relativePosition = null;
        
        OpenLayers.Popup.prototype.destroy.apply(this, arguments);        
    },

        show: function() {
        this.updatePosition();
        OpenLayers.Popup.prototype.show.apply(this, arguments);
    },

        moveTo: function(px) {
        var oldRelativePosition = this.relativePosition;
        this.relativePosition = this.calculateRelativePosition(px);

        OpenLayers.Popup.prototype.moveTo.call(this, this.calculateNewPx(px));
        if (this.relativePosition != oldRelativePosition) {
            this.updateRelativePosition();
        }
    },

        setSize:function(contentSize) { 
        OpenLayers.Popup.prototype.setSize.apply(this, arguments);

        if ((this.lonlat) && (this.map)) {
            var px = this.map.getLayerPxFromLonLat(this.lonlat);
            this.moveTo(px);
        }
    },  
    
        calculateRelativePosition:function(px) {
        var lonlat = this.map.getLonLatFromLayerPx(px);        
        
        var extent = this.map.getExtent();
        var quadrant = extent.determineQuadrant(lonlat);
        
        return OpenLayers.Bounds.oppositeQuadrant(quadrant);
    }, 

        updateRelativePosition: function() {
    },

        calculateNewPx:function(px) {
        var newPx = px.offset(this.anchor.offset);
        var size = this.size || this.contentSize;

        var top = (this.relativePosition.charAt(0) == 't');
        newPx.y += (top) ? -size.h : this.anchor.size.h;
        
        var left = (this.relativePosition.charAt(1) == 'l');
        newPx.x += (left) ? -size.w : this.anchor.size.w;

        return newPx;   
    },

    CLASS_NAME: "OpenLayers.Popup.Anchored"
});
