/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Filter.FeatureId = OpenLayers.Class(OpenLayers.Filter, {

        fids: null,
    
        type: "FID",
    
        initialize: function(options) {
        this.fids = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
    },

        evaluate: function(feature) {
        for (var i=0, len=this.fids.length; i<len; i++) {
            var fid = feature.fid || feature.id;
            if (fid == this.fids[i]) {
                return true;
            }
        }
        return false;
    },
    
        clone: function() {
        var filter = new OpenLayers.Filter.FeatureId();
        OpenLayers.Util.extend(filter, this);
        filter.fids = this.fids.slice();
        return filter;
    },
    
    CLASS_NAME: "OpenLayers.Filter.FeatureId"
});
