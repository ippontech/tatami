/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WCSCapabilities.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.GML.v3, OpenLayers.Format.WCSCapabilities.v1, {

    
        namespaces: {
        wcs: "http://www.opengis.net/wcs",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        ows: "http://www.opengis.net/ows"
    },

        errorProperty: "serviceIdentification",

        readers: {
        "wcs": {
            "WCS_Capabilities": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Service": function(node, obj) {
                var children = {};
                this.readChildNodes(node, children);
                var providerName = children.serviceContact.providerName;
                delete children.serviceContact.providerName;

                obj.serviceProvider = { 
                    providerName:   providerName,
                    serviceContact: children.serviceContact };
                children.serviceContact = undefined;
                obj.serviceIdentification = children;
            },
            "keywords": function(node, serviceIdentification) { 
                serviceIdentification.keywords = []; 
                this.readChildNodes(node, serviceIdentification.keywords);
            },
            "keyword": function(node, keywords) { 
                keywords.push(this.getChildValue(node));      
            },
            "responsibleParty": function(node, serviceIdentification) {
                serviceIdentification.serviceContact = {};
                this.readChildNodes(node, serviceIdentification.serviceContact);   
            },
            "individualName": function(node, serviceContact) {
                serviceContact.individualName = this.getChildValue(node);
            },
            "organisationName": function(node, serviceContact) {
                serviceContact.providerName = this.getChildValue(node);
            },
            "positionName": function(node, serviceContact) {
                serviceContact.positionName = this.getChildValue(node);
            },
            "contactInfo": function(node, serviceContact) {
                serviceContact.contactInfo = {};
                this.readChildNodes(node, serviceContact.contactInfo);
            },
            "phone": function(node, contactInfo) {
                contactInfo.phone = {};
                this.readChildNodes(node, contactInfo.phone);
            },
            "voice": function(node, phone) {
                phone.voice = this.getChildValue(node);
            },
            "facsimile": function(node, phone) {
                phone.facsimile = this.getChildValue(node);
            },
            "address": function(node, contactInfo) {
                contactInfo.address = {};
                this.readChildNodes(node, contactInfo.address);
            },
            "deliveryPoint": function(node, address) {
                address.deliveryPoint = this.getChildValue(node);
            },
            "city": function(node, address) {
                address.city = this.getChildValue(node);
            },
            "postalCode": function(node, address) {
                address.postalCode = this.getChildValue(node);
            },
            "country": function(node, address) {
                address.country = this.getChildValue(node);
            },
            "electronicMailAddress": function(node, address) {
                address.electronicMailAddress = this.getChildValue(node);
            },
            "fees": function(node, serviceIdentification) {
                serviceIdentification.fees = this.getChildValue(node);
            },
            "accessConstraints": function(node, serviceIdentification) {
                serviceIdentification.accessConstraints = this.getChildValue(node);
            },
            "ContentMetadata": function(node, obj) {
                obj.contentMetadata = [];
                this.readChildNodes(node, obj.contentMetadata);
            },
            "CoverageOfferingBrief": function(node, contentMetadata) {
                var coverageOfferingBrief = {};
                this.readChildNodes(node, coverageOfferingBrief);
                contentMetadata.push(coverageOfferingBrief);
            },
            "name": function(node, serviceOrCoverageOfferingBrief) {
                if(node.parentNode.nodeName.split(':').pop() === "Service") {
                    serviceOrCoverageOfferingBrief.title = this.getChildValue(node);
                }
                else {      // node.parentNode.nodeName === "CoverageOfferingBrief"
                    serviceOrCoverageOfferingBrief.identifier = this.getChildValue(node);
                }
            },
            "label": function(node, serviceOrCoverageOfferingBrief) {
                if(node.parentNode.nodeName.split(':').pop() === "Service") {
                    serviceOrCoverageOfferingBrief['abstract'] = this.getChildValue(node);
                }
                else {      // node.parentNode.nodeName === "CoverageOfferingBrief"
                    serviceOrCoverageOfferingBrief.title = this.getChildValue(node);
                }
            },
            "lonLatEnvelope": function(node, coverageOfferingBrief) {
                var nodeList = this.getElementsByTagNameNS(node, "http://www.opengis.net/gml", "pos");
                if(nodeList.length == 2) {
                    var min = {};
                    var max = {};

                    this.xy = true; // Affirm we don't want our coordinates switched around
                    this.readers.gml.pos.apply(this, [nodeList[0], min]);
                    this.readers.gml.pos.apply(this, [nodeList[1], max]);

                    coverageOfferingBrief.lonLatEnvelope = {};
                    coverageOfferingBrief.lonLatEnvelope.srsName = node.getAttribute("srsName");
                    coverageOfferingBrief.lonLatEnvelope.min = min.points[0];
                    coverageOfferingBrief.lonLatEnvelope.max = max.points[0];
                }
            }
        },
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"]
    },
    
    CLASS_NAME: "OpenLayers.Format.WCSCapabilities.v1_0_0" 

});
