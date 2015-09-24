/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.PointTrack = OpenLayers.Class(OpenLayers.Layer.Vector, {
  
        dataFrom: null,
    
        styleFrom: null,
    
        addNodes: function(pointFeatures, options) {
        if (pointFeatures.length < 2) {
            throw new Error("At least two point features have to be added to " +
                            "create a line from");
        }
        
        var lines = new Array(pointFeatures.length-1);
        
        var pointFeature, startPoint, endPoint;
        for(var i=0, len=pointFeatures.length; i<len; i++) {
            pointFeature = pointFeatures[i];
            endPoint = pointFeature.geometry;
            
            if (!endPoint) {
              var lonlat = pointFeature.lonlat;
              endPoint = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            } else if(endPoint.CLASS_NAME != "OpenLayers.Geometry.Point") {
                throw new TypeError("Only features with point geometries are supported.");
            }
            
            if(i > 0) {
                var attributes = (this.dataFrom != null) ?
                        (pointFeatures[i+this.dataFrom].data ||
                                pointFeatures[i+this.dataFrom].attributes) :
                        null;
                var style = (this.styleFrom != null) ?
                        (pointFeatures[i+this.styleFrom].style) :
                        null;
                var line = new OpenLayers.Geometry.LineString([startPoint,
                        endPoint]);
                        
                lines[i-1] = new OpenLayers.Feature.Vector(line, attributes,
                    style);
            }
            
            startPoint = endPoint;
        }

        this.addFeatures(lines, options);
    },
    
    CLASS_NAME: "OpenLayers.Layer.PointTrack"
});

OpenLayers.Layer.PointTrack.SOURCE_NODE = -1;

OpenLayers.Layer.PointTrack.TARGET_NODE = 0;

OpenLayers.Layer.PointTrack.dataFrom = {'SOURCE_NODE': -1, 'TARGET_NODE': 0};
