/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Style2 = OpenLayers.Class({

        id: null,
    
        name: null,
    
        title: null,
    
        description: null,

        layerName: null,
    
        isDefault: false,
     
        rules: null,
    
        initialize: function(config) {
        OpenLayers.Util.extend(this, config);
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

        destroy: function() {
        for (var i=0, len=this.rules.length; i<len; i++) {
            this.rules[i].destroy();
        }
        delete this.rules;
    },

        clone: function() {
        var config = OpenLayers.Util.extend({}, this);
        if (this.rules) {
            config.rules = [];
            for (var i=0, len=this.rules.length; i<len; ++i) {
                config.rules.push(this.rules[i].clone());
            }
        }
        return new OpenLayers.Style2(config);
    },
    
    CLASS_NAME: "OpenLayers.Style2"
});
