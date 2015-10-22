/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Size = OpenLayers.Class({

        w: 0.0,
    
        h: 0.0,


        initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },

        toString:function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

        clone:function() {
        return new OpenLayers.Size(this.w, this.h);
    },

        equals:function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                      (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },

    CLASS_NAME: "OpenLayers.Size"
});
