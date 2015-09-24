/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Icon = OpenLayers.Class({
    
        url: null,
    
        size: null,

        offset: null,    
    
        calculateOffset: null,    
    
        imageDiv: null,

        px: null,
    
        initialize: function(url, size, offset, calculateOffset) {
        this.url = url;
        this.size = size || {w: 20, h: 20};
        this.offset = offset || {x: -(this.size.w/2), y: -(this.size.h/2)};
        this.calculateOffset = calculateOffset;

        var id = OpenLayers.Util.createUniqueID("OL_Icon_");
        this.imageDiv = OpenLayers.Util.createAlphaImageDiv(id);
    },
    
        destroy: function() {
        this.erase();

        OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild); 
        this.imageDiv.innerHTML = "";
        this.imageDiv = null;
    },

        clone: function() {
        return new OpenLayers.Icon(this.url, 
                                   this.size, 
                                   this.offset, 
                                   this.calculateOffset);
    },
    
        setSize: function(size) {
        if (size != null) {
            this.size = size;
        }
        this.draw();
    },
    
        setUrl: function(url) {
        if (url != null) {
            this.url = url;
        }
        this.draw();
    },

        draw: function(px) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, 
                                            null, 
                                            null, 
                                            this.size, 
                                            this.url, 
                                            "absolute");
        this.moveTo(px);
        return this.imageDiv;
    }, 

        erase: function() {
        if (this.imageDiv != null && this.imageDiv.parentNode != null) {
            OpenLayers.Element.remove(this.imageDiv);
        }
    }, 
    
        setOpacity: function(opacity) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, 
                                            null, null, null, null, opacity);

    },
    
        moveTo: function (px) {
        if (px != null) {
            this.px = px;
        }

        if (this.imageDiv != null) {
            if (this.px == null) {
                this.display(false);
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size);  
                }
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                    x: this.px.x + this.offset.x,
                    y: this.px.y + this.offset.y
                });
            }
        }
    },
    
        display: function(display) {
        this.imageDiv.style.display = (display) ? "" : "none"; 
    },
    

        isDrawn: function() {
        var isDrawn = (this.imageDiv && this.imageDiv.parentNode && 
                       (this.imageDiv.parentNode.nodeType != 11));    

        return isDrawn;   
    },

    CLASS_NAME: "OpenLayers.Icon"
});
