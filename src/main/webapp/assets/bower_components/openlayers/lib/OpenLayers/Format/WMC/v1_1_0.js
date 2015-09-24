/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMC.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.WMC.v1, {
    
        VERSION: "1.1.0",

        schemaLocation: "http://www.opengis.net/context http://schemas.opengis.net/context/1.1.0/context.xsd",

        initialize: function(options) {
        OpenLayers.Format.WMC.v1.prototype.initialize.apply(
            this, [options]
        );
    },

        read_sld_MinScaleDenominator: function(layerContext, node) {
        var minScaleDenominator = parseFloat(this.getChildValue(node));
        if (minScaleDenominator > 0) {
            layerContext.maxScale = minScaleDenominator;
        }
    },

        read_sld_MaxScaleDenominator: function(layerContext, node) {
        layerContext.minScale = parseFloat(this.getChildValue(node));
    },

        read_wmc_SRS: function(layerContext, node) {
        if (! ("srs" in layerContext)) {
            layerContext.srs = {};
        }
        layerContext.srs[this.getChildValue(node)] = true;
    },

        write_wmc_Layer: function(context) {
        var node = OpenLayers.Format.WMC.v1.prototype.write_wmc_Layer.apply(
            this, [context]
        );
        if(context.maxScale) {
            var minSD = this.createElementNS(
                this.namespaces.sld, "sld:MinScaleDenominator"
            );
            minSD.appendChild(this.createTextNode(context.maxScale.toPrecision(16)));
            node.appendChild(minSD);
        }
        
        if(context.minScale) {
            var maxSD = this.createElementNS(
                this.namespaces.sld, "sld:MaxScaleDenominator"
            );
            maxSD.appendChild(this.createTextNode(context.minScale.toPrecision(16)));
            node.appendChild(maxSD);
        }
        if (context.srs) {
            for(var name in context.srs) {
                node.appendChild(this.createElementDefaultNS("SRS", name));
            }
        }
        node.appendChild(this.write_wmc_FormatList(context));
        node.appendChild(this.write_wmc_StyleList(context));
        if (context.dimensions) {
            node.appendChild(this.write_wmc_DimensionList(context));
        }
        node.appendChild(this.write_wmc_LayerExtension(context));
        
        return node;
        
    },

    CLASS_NAME: "OpenLayers.Format.WMC.v1_1_0" 

});
