/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Spherical = OpenLayers.Spherical || {};

OpenLayers.Spherical.DEFAULT_RADIUS = 6378137;

OpenLayers.Spherical.computeDistanceBetween = function(from, to, radius) {
  var R = radius || OpenLayers.Spherical.DEFAULT_RADIUS;
  var sinHalfDeltaLon = Math.sin(Math.PI * (to.lon - from.lon) / 360);
  var sinHalfDeltaLat = Math.sin(Math.PI * (to.lat - from.lat) / 360);
  var a = sinHalfDeltaLat * sinHalfDeltaLat +
      sinHalfDeltaLon * sinHalfDeltaLon * Math.cos(Math.PI * from.lat / 180) * Math.cos(Math.PI * to.lat / 180); 
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
};


OpenLayers.Spherical.computeHeading = function(from, to) {
    var y = Math.sin(Math.PI * (from.lon - to.lon) / 180) * Math.cos(Math.PI * to.lat / 180);
    var x = Math.cos(Math.PI * from.lat / 180) * Math.sin(Math.PI * to.lat / 180) -
        Math.sin(Math.PI * from.lat / 180) * Math.cos(Math.PI * to.lat / 180) * Math.cos(Math.PI * (from.lon - to.lon) / 180);
    return 180 * Math.atan2(y, x) / Math.PI;
};
