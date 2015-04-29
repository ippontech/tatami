/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WCSCapabilities.v1_1_0 = OpenLayers.Class(
    OpenLayers.Format.WCSCapabilities.v1, {

        namespaces: {
        wcs: "http://www.opengis.net/wcs/1.1",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        ows: "http://www.opengis.net/ows/1.1"
    },

        errorProperty: "operationsMetadata",

    
        readers: {
        "wcs": OpenLayers.Util.applyDefaults({
            "Capabilities": function(node, obj) {           
                this.readChildNodes(node, obj);
            },
            "Contents": function(node, request) {
                request.contentMetadata = [];
                this.readChildNodes(node, request.contentMetadata);
            },
            "CoverageSummary": function(node, contentMetadata) {
                var coverageSummary = {};
                this.readChildNodes(node, coverageSummary);   
                contentMetadata.push(coverageSummary);                 
            },
            "Identifier": function(node, coverageSummary) {
                coverageSummary.identifier = this.getChildValue(node);
            },
            "Title": function(node, coverageSummary) {
              coverageSummary.title = this.getChildValue(node);
            },
            "Abstract": function(node, coverageSummary) {
                coverageSummary["abstract"] = this.getChildValue(node);
            },
            "SupportedCRS": function(node, coverageSummary) {
                var crs = this.getChildValue(node);
                if(crs) {
                    if(!coverageSummary.supportedCRS) { 
                        coverageSummary.supportedCRS = [];
                    }
                    coverageSummary.supportedCRS.push(crs);
                }
            },
            "SupportedFormat": function(node, coverageSummary) {
                var format = this.getChildValue(node);
                if(format) {
                    if(!coverageSummary.supportedFormat) { 
                        coverageSummary.supportedFormat = [];
                    }
                    coverageSummary.supportedFormat.push(format);
                }
            }
        }, OpenLayers.Format.WCSCapabilities.v1.prototype.readers["wcs"]),
        "ows": OpenLayers.Util.applyDefaults({
            "Keywords": function(node, serviceIdentification) {
                serviceIdentification.keywords = [];
                this.readChildNodes(node, serviceIdentification.keywords);
            },
            "Keyword": function(node, keywords) {
                keywords.push(this.getChildValue(node));   
            }
        }, OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"])
    },

    CLASS_NAME: "OpenLayers.Format.WCSCapabilities.v1_1_0" 

});
