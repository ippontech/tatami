/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Pixel = OpenLayers.Class({
    
        x: 0.0,

        y: 0.0,
    
        initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    
        toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

        clone:function() {
        return new OpenLayers.Pixel(this.x, this.y); 
    },
    
        equals:function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

        distanceTo:function(px) {
        return Math.sqrt(
            Math.pow(this.x - px.x, 2) +
            Math.pow(this.y - px.y, 2)
        );
    },

        add:function(x, y) {
        if ( (x == null) || (y == null) ) {
            throw new TypeError('Pixel.add cannot receive null values');
        }
        return new OpenLayers.Pixel(this.x + x, this.y + y);
    },

        offset:function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },

    CLASS_NAME: "OpenLayers.Pixel"
});
