/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Attribution = 
  OpenLayers.Class(OpenLayers.Control, {
    
        separator: ", ",

        template: "${layers}",

        layerTemplate: '<a href="${href}" target="_blank">${title}</a>',

    
        destroy: function() {
        this.map.events.un({
            "removelayer": this.updateAttribution,
            "addlayer": this.updateAttribution,
            "changelayer": this.updateAttribution,
            "changebaselayer": this.updateAttribution,
            scope: this
        });
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },    
    
        updateAttribution: function() {
        var attributions = [], attribution;
        if (this.map && this.map.layers) {
            for(var i=0, len=this.map.layers.length; i<len; i++) {
                var layer = this.map.layers[i];
                if (layer.attribution && layer.getVisibility()) {
                    attribution = (typeof layer.attribution == "object") ?
                        OpenLayers.String.format(
                            this.layerTemplate, layer.attribution) :
                        layer.attribution;
                    if (OpenLayers.Util.indexOf(
                                    attributions, attribution) === -1) {
                        attributions.push( attribution );
                    }
                }
            } 
            this.div.innerHTML = OpenLayers.String.format(this.template, {
                layers: attributions.join(this.separator)
            });
        }
    },

    CLASS_NAME: "OpenLayers.Control.Attribution"
});
