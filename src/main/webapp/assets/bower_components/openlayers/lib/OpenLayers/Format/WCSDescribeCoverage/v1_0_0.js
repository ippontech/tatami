/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WCSDescribeCoverage.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.WCSDescribeCoverage.v1, {

        namespaces: {
        wcs: "http://www.opengis.net/wcs",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        ows: "http://www.opengis.net/ows",
        gml: "http://www.opengis.net/gml"
    },

    
        readers: {
        "wcs": {
            "CoverageDescription": function(node, obj) {
                obj.coverageDescriptions = {};        
                this.readChildNodes(node, obj.coverageDescriptions);
                obj.coverageDescriptionKeys = [];
                for(var key in obj.coverageDescriptions) {
                    obj.coverageDescriptionKeys.push(key);
                }
            },
            "CoverageOffering": function(node, descriptions) {
                var description = {};
                this.readChildNodes(node, description);
                descriptions[description.identifier] = description;
                description.nativeCRS = description.supportedCRSs.nativeCRSs[0];
            },
            "name": function(node, description) {
                description.identifier = this.getChildValue(node);
            },
            "label": function(node, description) {
                description.title = this.getChildValue(node);
            },
            "lonLatEnvelope": function(node, description) {
                OpenLayers.Format.WCSCapabilities.v1_0_0.prototype.readers.wcs.lonLatEnvelope.call(this, node, description);
            },
            "domainSet": function(node, description) {
                description.domain = {};
                this.readChildNodes(node, description.domain);
            },
            "spatialDomain": function(node, domain) {
                domain.spatialDomain = { boundingBoxes: {} };
                this.readChildNodes(node, domain.spatialDomain);
            },
             "nativeCRSs": function(node, description) {
                if(!description.nativeCRSs) {
                    description.nativeCRSs = [];
                }
                var crs = this.getChildValue(node);
                description.nativeCRSs.push(crs);
            },
            "supportedCRSs": function(node, description) {
                if(!description.supportedCRSs) {
                    description.supportedCRSs = [];
                }
                this.readChildNodes(node, description.supportedCRSs)
            },
            "requestResponseCRSs" : function(node, supportedCRSs) {
                supportedCRSs.push(this.getChildValue(node));
            },
             "supportedFormats": function(node, description) {
                if(!description.supportedFormats) {
                    description.supportedFormats = [];
                }
                this.readChildNodes(node, description.supportedFormats)
            },
            "formats" : function(node, supportedFormats) {
                supportedFormats.push(this.getChildValue(node));
            }
        }, 
 
        "ows": OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers["ows"],
        "gml": OpenLayers.Util.applyDefaults({
            "Envelope": function(node, spatialDomain) {
                var srsName = node.getAttribute("srsName");
                if(!srsName) { // No SRS?  What does this envelope mean?!?
                    return;
                }

                var obj = {points: []};
                this.readChildNodes(node, obj);

                var min = obj.points[0];
                var max = obj.points[1];
                var bounds = new OpenLayers.Bounds(min.x, min.y, max.x, max.y);
                spatialDomain.boundingBoxes[srsName] = bounds;
            }
        }, OpenLayers.Format.GML.v3.prototype.readers["gml"])
    },

    CLASS_NAME: "OpenLayers.Format.WCSDescribeCoverage.v1_0_0" 

});
