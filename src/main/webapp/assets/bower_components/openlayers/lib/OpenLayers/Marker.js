/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Marker = OpenLayers.Class({
    
        icon: null,

        lonlat: null,
    
        events: null,
    
        map: null,
    
        initialize: function(lonlat, icon) {
        this.lonlat = lonlat;
        
        var newIcon = (icon) ? icon : OpenLayers.Marker.defaultIcon();
        if (this.icon == null) {
            this.icon = newIcon;
        } else {
            this.icon.url = newIcon.url;
            this.icon.size = newIcon.size;
            this.icon.offset = newIcon.offset;
            this.icon.calculateOffset = newIcon.calculateOffset;
        }
        this.events = new OpenLayers.Events(this, this.icon.imageDiv);
    },
    
        destroy: function() {
        this.erase();

        this.map = null;

        this.events.destroy();
        this.events = null;

        if (this.icon != null) {
            this.icon.destroy();
            this.icon = null;
        }
    },
    
        draw: function(px) {
        return this.icon.draw(px);
    }, 

        erase: function() {
        if (this.icon != null) {
            this.icon.erase();
        }
    }, 

        moveTo: function (px) {
        if ((px != null) && (this.icon != null)) {
            this.icon.moveTo(px);
        }           
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },

        isDrawn: function() {
        var isDrawn = (this.icon && this.icon.isDrawn());
        return isDrawn;   
    },

        onScreen:function() {
        
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    
        inflate: function(inflate) {
        if (this.icon) {
            this.icon.setSize({
                w: this.icon.size.w * inflate,
                h: this.icon.size.h * inflate
            });
        }        
    },
    
        setOpacity: function(opacity) {
        this.icon.setOpacity(opacity);
    },

        setUrl: function(url) {
        this.icon.setUrl(url);
    },    

        display: function(display) {
        this.icon.display(display);
    },

    CLASS_NAME: "OpenLayers.Marker"
});


OpenLayers.Marker.defaultIcon = function() {
    return new OpenLayers.Icon(OpenLayers.Util.getImageLocation("marker.png"),
                               {w: 21, h: 25}, {x: -10.5, y: -25});
};
    

