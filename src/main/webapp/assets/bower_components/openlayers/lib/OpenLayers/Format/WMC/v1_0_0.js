/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMC.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.WMC.v1, {
    
        VERSION: "1.0.0",
    
        schemaLocation: "http://www.opengis.net/context http://schemas.opengis.net/context/1.0.0/context.xsd",

        initialize: function(options) {
        OpenLayers.Format.WMC.v1.prototype.initialize.apply(
            this, [options]
        );
    },

        read_wmc_SRS: function(layerContext, node) {
        var srs    = this.getChildValue(node);
        if (typeof layerContext.projections != "object") {
            layerContext.projections = {};
        }
        var values = srs.split(/ +/);
        for (var i=0, len=values.length; i<len; i++) {
            layerContext.projections[values[i]] = true;
        }
    },

        write_wmc_Layer: function(context) {
        var node = OpenLayers.Format.WMC.v1.prototype.write_wmc_Layer.apply(
            this, [context]
        );
        if (context.srs) {
            var projections = [];
            for(var name in context.srs) {
                projections.push(name);
            }
            node.appendChild(this.createElementDefaultNS("SRS", projections.join(" ")));
        }
        node.appendChild(this.write_wmc_FormatList(context));
        node.appendChild(this.write_wmc_StyleList(context));
        if (context.dimensions) {
            node.appendChild(this.write_wmc_DimensionList(context));
        }
        node.appendChild(this.write_wmc_LayerExtension(context));
    },    

    CLASS_NAME: "OpenLayers.Format.WMC.v1_0_0" 

});
