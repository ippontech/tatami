/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.TextButtonPanel = OpenLayers.Class(
  OpenLayers.Control.Panel, {

        vertical: false,

        additionalClass: null,

    
        draw: function() {
        OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        this.setOrientationClass();
        this.setAdditionalClass();
        return this.div;
    },

        redraw: function() {
        OpenLayers.Control.Panel.prototype.redraw.apply(this, arguments);
        this.setOrientationClass();
    },

        setOrientationClass: function() {
        if (this.vertical) {
            OpenLayers.Element.addClass(this.div, "vertical");
        }
        else {
            OpenLayers.Element.removeClass(this.div, "vertical");
        }
    },
    
        setAdditionalClass: function() {
        if (!!this.additionalClass) {
            OpenLayers.Element.addClass(this.div, this.additionalClass);
        }
    },

    CLASS_NAME: "OpenLayers.Control.TextButtonPanel"
});
