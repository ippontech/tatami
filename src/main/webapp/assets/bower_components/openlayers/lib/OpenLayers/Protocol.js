/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Protocol = OpenLayers.Class({
    
        format: null,
    
        options: null,

        autoDestroy: true,
   
        defaultFilter: null,
    
        initialize: function(options) {
        options = options || {};
        OpenLayers.Util.extend(this, options);
        this.options = options;
    },

        mergeWithDefaultFilter: function(filter) {
        var merged;
        if (filter && this.defaultFilter) {
            merged = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [this.defaultFilter, filter]
            });
        } else {
            merged = filter || this.defaultFilter || undefined;
        }
        return merged;
    },

        destroy: function() {
        this.options = null;
        this.format = null;
    },
    
        read: function(options) {
        options = options || {};
        options.filter = this.mergeWithDefaultFilter(options.filter);
    },
    
    
        create: function() {
    },
    
        update: function() {
    },
    
        "delete": function() {
    },

        commit: function() {
    },

        abort: function(response) {
    },
   
        createCallback: function(method, response, options) {
        return OpenLayers.Function.bind(function() {
            method.apply(this, [response, options]);
        }, this);
    },
   
    CLASS_NAME: "OpenLayers.Protocol" 
});

OpenLayers.Protocol.Response = OpenLayers.Class({
        code: null,

        requestType: null,

        last: true,

        features: null,

        data: null,

        reqFeatures: null,

        priv: null,

        error: null,

        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

        success: function() {
        return this.code > 0;
    },

    CLASS_NAME: "OpenLayers.Protocol.Response"
});

OpenLayers.Protocol.Response.SUCCESS = 1;
OpenLayers.Protocol.Response.FAILURE = 0;
