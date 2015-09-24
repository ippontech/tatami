/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMSDescribeLayer.v1_1_1 = OpenLayers.Class(
    OpenLayers.Format.WMSDescribeLayer, {
    
        initialize: function(options) {
        OpenLayers.Format.WMSDescribeLayer.prototype.initialize.apply(this, 
            [options]);
    },

        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        var children = root.childNodes; 
        var describelayer = {layerDescriptions: []};
        var childNode, nodeName;
        for(var i=0; i<children.length; ++i) { 
            childNode = children[i];
            nodeName = childNode.nodeName; 
            if (nodeName == 'LayerDescription') {
                var layerName = childNode.getAttribute('name');
                var owsType = '';
                var owsURL = '';
                var typeName = '';
                if (childNode.getAttribute('owsType')) {
                  owsType = childNode.getAttribute('owsType');
                  owsURL = childNode.getAttribute('owsURL');
                } else {
                    if (childNode.getAttribute('wfs') != '') {
                        owsType = 'WFS';
                        owsURL = childNode.getAttribute('wfs');
                    } else if (childNode.getAttribute('wcs') != '') {
                        owsType = 'WCS';
                        owsURL = childNode.getAttribute('wcs');
                    }
                }
                var query = childNode.getElementsByTagName('Query');
                if(query.length > 0) {
                    typeName = query[0].getAttribute('typeName');
                    if (!typeName) {
                        typeName = query[0].getAttribute('typename');
                    }
                }
                var layerDescription = {
                    layerName: layerName, owsType: owsType, 
                    owsURL: owsURL, typeName: typeName
                };
                describelayer.layerDescriptions.push(layerDescription);
                describelayer.length = describelayer.layerDescriptions.length;
                describelayer[describelayer.length - 1] = layerDescription; 
                
            } else if (nodeName == 'ServiceException') {
                var parser = new OpenLayers.Format.OGCExceptionReport();
                return {
                    error: parser.read(data)
                };
            }
        }
        return describelayer;
    },
    
    CLASS_NAME: "OpenLayers.Format.WMSDescribeLayer.v1_1_1"

});
OpenLayers.Format.WMSDescribeLayer.v1_1_0 =
    OpenLayers.Format.WMSDescribeLayer.v1_1_1;
