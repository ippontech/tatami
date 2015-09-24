/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.Text = OpenLayers.Class(OpenLayers.Format, {
    
        defaultStyle: null,
     
        extractStyles: true,

        initialize: function(options) {
        options = options || {};

        if(options.extractStyles !== false) {
            options.defaultStyle = {
                'externalGraphic': OpenLayers.Util.getImageLocation("marker.png"),
                'graphicWidth': 21,
                'graphicHeight': 25,
                'graphicXOffset': -10.5,
                'graphicYOffset': -12.5
            };
        }
        
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
    }, 

        read: function(text) {
        var lines = text.split('\n');
        var columns;
        var features = [];
        for (var lcv = 0; lcv < (lines.length - 1); lcv++) {
            var currLine = lines[lcv].replace(/^\s*/,'').replace(/\s*$/,'');
        
            if (currLine.charAt(0) != '#') { /* not a comment */
            
                if (!columns) {
                    columns = currLine.split('\t');
                } else {
                    var vals = currLine.split('\t');
                    var geometry = new OpenLayers.Geometry.Point(0,0);
                    var attributes = {};
                    var style = this.defaultStyle ? 
                        OpenLayers.Util.applyDefaults({}, this.defaultStyle) :
                        null;  
                    var icon, iconSize, iconOffset, overflow;
                    var set = false;
                    for (var valIndex = 0; valIndex < vals.length; valIndex++) {
                        if (vals[valIndex]) {
                            if (columns[valIndex] == 'point') {
                                var coords = vals[valIndex].split(',');
                                geometry.y = parseFloat(coords[0]);
                                geometry.x = parseFloat(coords[1]);
                                set = true;
                            } else if (columns[valIndex] == 'lat') {
                                geometry.y = parseFloat(vals[valIndex]);
                                set = true;
                            } else if (columns[valIndex] == 'lon') {
                                geometry.x = parseFloat(vals[valIndex]);
                                set = true;
                            } else if (columns[valIndex] == 'title')
                                attributes['title'] = vals[valIndex];
                            else if (columns[valIndex] == 'image' ||
                                     columns[valIndex] == 'icon' && style) {
                                style['externalGraphic'] = vals[valIndex];
                            } else if (columns[valIndex] == 'iconSize' && style) {
                                var size = vals[valIndex].split(',');
                                style['graphicWidth'] = parseFloat(size[0]);
                                style['graphicHeight'] = parseFloat(size[1]);
                            } else if (columns[valIndex] == 'iconOffset' && style) {
                                var offset = vals[valIndex].split(',');
                                style['graphicXOffset'] = parseFloat(offset[0]);
                                style['graphicYOffset'] = parseFloat(offset[1]);
                            } else if (columns[valIndex] == 'description') {
                                attributes['description'] = vals[valIndex];
                            } else if (columns[valIndex] == 'overflow') {
                                attributes['overflow'] = vals[valIndex];
                            } else {
                                attributes[columns[valIndex]] = vals[valIndex];
                            }    
                        }
                    }
                    if (set) {
                      if (this.internalProjection && this.externalProjection) {
                          geometry.transform(this.externalProjection, 
                                             this.internalProjection); 
                      }
                      var feature = new OpenLayers.Feature.Vector(geometry, attributes, style);
                      features.push(feature);
                    }
                }
            }
        }
        return features;
    },   

    CLASS_NAME: "OpenLayers.Format.Text" 
});    
