/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format = OpenLayers.Class({
    
        options: null,
    
        externalProjection: null,

        internalProjection: null,

        data: null,

        keepData: false,

        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        this.options = options;
    },
    
        destroy: function() {
    },

        read: function(data) {
        throw new Error('Read not implemented.');
    },
    
        write: function(object) {
        throw new Error('Write not implemented.');
    },

    CLASS_NAME: "OpenLayers.Format"
});     
