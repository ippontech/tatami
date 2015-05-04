/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Symbolizer = OpenLayers.Class({
    

        zIndex: 0,
    
        initialize: function(config) {
        OpenLayers.Util.extend(this, config);
    },
    
        clone: function() {
        var Type = OpenLayers.Util.getConstructor(this.CLASS_NAME);
        return new Type(OpenLayers.Util.extend({}, this));
    },
    
    CLASS_NAME: "OpenLayers.Symbolizer"
    
});

