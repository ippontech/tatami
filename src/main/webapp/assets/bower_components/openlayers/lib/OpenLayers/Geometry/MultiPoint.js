/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Geometry.MultiPoint = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

        componentTypes: ["OpenLayers.Geometry.Point"],

    
        addPoint: function(point, index) {
        this.addComponent(point, index);
    },
    
        removePoint: function(point){
        this.removeComponent(point);
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
