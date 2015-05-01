/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Pan = OpenLayers.Class(OpenLayers.Control.Button, {

        slideFactor: 50,

        slideRatio: null,

        direction: null,

        initialize: function(direction, options) {
    
        this.direction = direction;
        this.CLASS_NAME += this.direction;
        
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },
    
        trigger: function(){
        if (this.map) {
            var getSlideFactor = OpenLayers.Function.bind(function (dim) {
                return this.slideRatio ?
                    this.map.getSize()[dim] * this.slideRatio :
                    this.slideFactor;
            }, this);
    
            switch (this.direction) {
                case OpenLayers.Control.Pan.NORTH: 
                    this.map.pan(0, -getSlideFactor("h"));
                    break;
                case OpenLayers.Control.Pan.SOUTH: 
                    this.map.pan(0, getSlideFactor("h"));
                    break;
                case OpenLayers.Control.Pan.WEST: 
                    this.map.pan(-getSlideFactor("w"), 0);
                    break;
                case OpenLayers.Control.Pan.EAST: 
                    this.map.pan(getSlideFactor("w"), 0);
                    break;
            }   
        }
    },

    CLASS_NAME: "OpenLayers.Control.Pan"
});

OpenLayers.Control.Pan.NORTH = "North";
OpenLayers.Control.Pan.SOUTH = "South";
OpenLayers.Control.Pan.EAST = "East";
OpenLayers.Control.Pan.WEST = "West";
