/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Filter = OpenLayers.Class({
    
        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

        destroy: function() {
    },

        evaluate: function(context) {
        return true;
    },
    
        clone: function() {
        return null;
    },
    
        toString: function() {
        var string;
        if (OpenLayers.Format && OpenLayers.Format.CQL) {
            string = OpenLayers.Format.CQL.prototype.write(this);
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    },
    
    CLASS_NAME: "OpenLayers.Filter"
});
