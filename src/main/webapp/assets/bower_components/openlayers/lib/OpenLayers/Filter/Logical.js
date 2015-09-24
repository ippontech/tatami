/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Filter.Logical = OpenLayers.Class(OpenLayers.Filter, {

        filters: null, 
     
        type: null,

        initialize: function(options) {
        this.filters = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
    },
    
        destroy: function() {
        this.filters = null;
        OpenLayers.Filter.prototype.destroy.apply(this);
    },

        evaluate: function(context) {
        var i, len;
        switch(this.type) {
            case OpenLayers.Filter.Logical.AND:
                for (i=0, len=this.filters.length; i<len; i++) {
                    if (this.filters[i].evaluate(context) == false) {
                        return false;
                    }
                }
                return true;
                
            case OpenLayers.Filter.Logical.OR:
                for (i=0, len=this.filters.length; i<len; i++) {
                    if (this.filters[i].evaluate(context) == true) {
                        return true;
                    }
                }
                return false;
            
            case OpenLayers.Filter.Logical.NOT:
                return (!this.filters[0].evaluate(context));
        }
        return undefined;
    },
    
        clone: function() {
        var filters = [];        
        for(var i=0, len=this.filters.length; i<len; ++i) {
            filters.push(this.filters[i].clone());
        }
        return new OpenLayers.Filter.Logical({
            type: this.type,
            filters: filters
        });
    },
    
    CLASS_NAME: "OpenLayers.Filter.Logical"
});


OpenLayers.Filter.Logical.AND = "&&";
OpenLayers.Filter.Logical.OR  = "||";
OpenLayers.Filter.Logical.NOT = "!";
