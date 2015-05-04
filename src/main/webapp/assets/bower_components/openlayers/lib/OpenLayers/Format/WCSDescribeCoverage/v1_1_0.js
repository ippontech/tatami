/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WCSDescribeCoverage.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.WCSDescribeCoverage.v1, {

        namespaces: {
        wcs: "http://www.opengis.net/wcs/1.1",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        ows: "http://www.opengis.net/ows/1.1",
        owsesri: "http://www.opengis.net/ows"
    },

    
        readers: {
        "wcs": {
            "CoverageDescriptions": function(node, obj) {
                obj.coverageDescriptions = {};        
                this.readChildNodes(node, obj.coverageDescriptions);

                obj.coverageDescriptionKeys = [];
                for(var key in obj.coverageDescriptions) {
                    obj.coverageDescriptionKeys.push(key);
                }
            },
            "CoverageDescription": function(node, descriptions) {
                var description = {};
                this.readChildNodes(node, description);
                descriptions[description.identifier] = description;
                description.nativeCRS = 
                        description.domain.spatialDomain.gridCRS.gridBaseCRS;
            },
            "Identifier": function(node, description) {
                description.identifier = this.getChildValue(node);
            },
            "Title": function(node, description) {
                description.title = this.getChildValue(node);
            },
            "Domain": function(node, description) {
                description.domain = {};
                this.readChildNodes(node, description.domain);
            },
            "SpatialDomain": function(node, domain) {
                domain.spatialDomain = { boundingBoxes:{} };

                var bb = { BoundingBox:[] };

                this.readChildNodes(node, bb);
                for(var i=0, len=bb.BoundingBox.length; i<len;i++) {
                    if(!!bb.BoundingBox[i].crs) {
                        domain.spatialDomain.boundingBoxes[bb.BoundingBox[i].crs] = 
                            bb.BoundingBox[i].bounds;
                        }
                }
                domain.spatialDomain.gridCRS = bb.gridCRS;
            },
            "GridCRS": function(node, spatialDomain) {
                spatialDomain.gridCRS = {};
                this.readChildNodes(node, spatialDomain.gridCRS);
            },
            "GridBaseCRS": function(node, gridCRS) {
                gridCRS.gridBaseCRS = this.getChildValue(node);
            },
            "GridType": function(node, gridCRS) {
                gridCRS.gridType = this.getChildValue(node);
            },
            "GridOrigin": function(node, gridCRS) {
                var xy = this.getChildValue(node).split(' '); 
                if(xy.length == 2) {
                    gridCRS.gridOrigin = {};
                    gridCRS.gridOrigin.x = Number(xy[0]);
                    gridCRS.gridOrigin.y = Number(xy[1]);
                }
            },
            "GridOffsets": function(node, gridCRS) {
                var xy = this.getChildValue(node).split(' '); 
                if(xy.length == 2) {
                    gridCRS.gridOffsets = {};
                    gridCRS.gridOffsets.x = Number(xy[0]);
                    gridCRS.gridOffsets.y = Number(xy[1]);
                }
            },
            "GridCS": function(node, gridCRS) {
                gridCRS.gridCS = this.getChildValue(node);
            },
            "SupportedCRS": function(node, description) {
                if(!!!description.supportedCRSs) {
                    description.supportedCRSs = [];
                }

                var crs = this.getChildValue(node);
                description.supportedCRSs.push(crs);
            },
            "SupportedFormat": function(node, description) {
                if(!!!description.supportedFormats) {
                    description.supportedFormats = [];
                }

                var format = this.getChildValue(node);
                description.supportedFormats.push(format);
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"],
        "owsesri": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]

    },

    CLASS_NAME: "OpenLayers.Format.WCSDescribeCoverage.v1_1_0" 

});
