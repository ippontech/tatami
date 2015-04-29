/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.PanPanel = OpenLayers.Class(OpenLayers.Control.Panel, {

        slideFactor: 50,

        slideRatio: null,

        initialize: function(options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        var options = {
            slideFactor: this.slideFactor,
            slideRatio: this.slideRatio
        };
        this.addControls([
            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.NORTH, options),
            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.SOUTH, options),
            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.EAST, options),
            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.WEST, options)
        ]);
    },

    CLASS_NAME: "OpenLayers.Control.PanPanel"
});
