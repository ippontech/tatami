/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Rule = OpenLayers.Class({
    
        id: null,
    
        name: null,
    
        title: null,
    
        description: null,

        context: null,
    
        filter: null,

        elseFilter: false,
    
        symbolizer: null,
    
        symbolizers: null,
    
        minScaleDenominator: null,

        maxScaleDenominator: null,
    
        initialize: function(options) {
        this.symbolizer = {};
        OpenLayers.Util.extend(this, options);
        if (this.symbolizers) {
            delete this.symbolizer;
        }
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

        destroy: function() {
        for (var i in this.symbolizer) {
            this.symbolizer[i] = null;
        }
        this.symbolizer = null;
        delete this.symbolizers;
    },
    
        evaluate: function(feature) {
        var context = this.getContext(feature);
        var applies = true;

        if (this.minScaleDenominator || this.maxScaleDenominator) {
            var scale = feature.layer.map.getScale();
        }
        if (this.minScaleDenominator) {
            applies = scale >= OpenLayers.Style.createLiteral(
                    this.minScaleDenominator, context);
        }
        if (applies && this.maxScaleDenominator) {
            applies = scale < OpenLayers.Style.createLiteral(
                    this.maxScaleDenominator, context);
        }
        if(applies && this.filter) {
            if(this.filter.CLASS_NAME == "OpenLayers.Filter.FeatureId") {
                applies = this.filter.evaluate(feature);
            } else {
                applies = this.filter.evaluate(context);
            }
        }

        return applies;
    },
    
        getContext: function(feature) {
        var context = this.context;
        if (!context) {
            context = feature.attributes || feature.data;
        }
        if (typeof this.context == "function") {
            context = this.context(feature);
        }
        return context;
    },
    
        clone: function() {
        var options = OpenLayers.Util.extend({}, this);
        if (this.symbolizers) {
            var len = this.symbolizers.length;
            options.symbolizers = new Array(len);
            for (var i=0; i<len; ++i) {
                options.symbolizers[i] = this.symbolizers[i].clone();
            }
        } else {
            options.symbolizer = {};
            var value, type;
            for(var key in this.symbolizer) {
                value = this.symbolizer[key];
                type = typeof value;
                if(type === "object") {
                    options.symbolizer[key] = OpenLayers.Util.extend({}, value);
                } else if(type === "string") {
                    options.symbolizer[key] = value;
                }
            }
        }
        options.filter = this.filter && this.filter.clone();
        options.context = this.context && OpenLayers.Util.extend({}, this.context);
        return new OpenLayers.Rule(options);
    },
        
    CLASS_NAME: "OpenLayers.Rule"
});