/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.EditingToolbar = OpenLayers.Class(
  OpenLayers.Control.Panel, {

        citeCompliant: false,

        initialize: function(layer, options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        
        this.addControls(
          [ new OpenLayers.Control.Navigation() ]
        );  
        var controls = [
            new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point, {
                displayClass: 'olControlDrawFeaturePoint',
                handlerOptions: {citeCompliant: this.citeCompliant}
            }),
            new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Path, {
                displayClass: 'olControlDrawFeaturePath',
                handlerOptions: {citeCompliant: this.citeCompliant}
            }),
            new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Polygon, {
                displayClass: 'olControlDrawFeaturePolygon',
                handlerOptions: {citeCompliant: this.citeCompliant}
            })
        ];
        this.addControls(controls);
    },

        draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        if (this.defaultControl === null) {
            this.defaultControl = this.controls[0];
        }
        return div;
    },

    CLASS_NAME: "OpenLayers.Control.EditingToolbar"
});    
