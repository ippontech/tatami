/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.XLS.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        xls: "http://www.opengis.net/xls",
        gml: "http://www.opengis.net/gml",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

        xy: true,
    
        defaultPrefix: "xls",

        schemaLocation: null,
    
        
        read: function(data, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var xls = {};
        this.readChildNodes(data, xls);
        return xls;
    },
    
        readers: {
        "xls": {
            "XLS": function(node, xls) {
                xls.version = node.getAttribute("version");
                this.readChildNodes(node, xls);
            },
            "Response": function(node, xls) {
               this.readChildNodes(node, xls);
            },
            "GeocodeResponse": function(node, xls) {
               xls.responseLists = [];
               this.readChildNodes(node, xls);
            },
            "GeocodeResponseList": function(node, xls) {
                var responseList = {
                    features: [], 
                    numberOfGeocodedAddresses: 
                        parseInt(node.getAttribute("numberOfGeocodedAddresses"))
                };
                xls.responseLists.push(responseList);
                this.readChildNodes(node, responseList);
            },
            "GeocodedAddress": function(node, responseList) {
                var feature = new OpenLayers.Feature.Vector();
                responseList.features.push(feature);
                this.readChildNodes(node, feature);
                feature.geometry = feature.components[0];
            },
            "GeocodeMatchCode": function(node, feature) {
                feature.attributes.matchCode = {
                    accuracy: parseFloat(node.getAttribute("accuracy")),
                    matchType: node.getAttribute("matchType")
                };
            },
            "Address": function(node, feature) {
                var address = {
                    countryCode: node.getAttribute("countryCode"),
                    addressee: node.getAttribute("addressee"),
                    street: [],
                    place: []
                };
                feature.attributes.address = address;
                this.readChildNodes(node, address);
            },
            "freeFormAddress": function(node, address) {
                address.freeFormAddress = this.getChildValue(node);
            },
            "StreetAddress": function(node, address) {
                this.readChildNodes(node, address);
            },
            "Building": function(node, address) {
                address.building = {
                    'number': node.getAttribute("number"),
                    subdivision: node.getAttribute("subdivision"),
                    buildingName: node.getAttribute("buildingName")
                };
            },
            "Street": function(node, address) {
                address.street.push(this.getChildValue(node));
            },
            "Place": function(node, address) {
                address.place[node.getAttribute("type")] = 
                    this.getChildValue(node);
            },
            "PostalCode": function(node, address) {
                address.postalCode = this.getChildValue(node);
            }
        },
        "gml": OpenLayers.Format.GML.v3.prototype.readers.gml
    },
    
        write: function(request) {
        return this.writers.xls.XLS.apply(this, [request]);
    },
    
        writers: {
        "xls": {
            "XLS": function(request) {
                var root = this.createElementNSPlus(
                    "xls:XLS",
                    {attributes: {
                        "version": this.VERSION,
                        "xsi:schemaLocation": this.schemaLocation
                    }}
                );
                this.writeNode("RequestHeader", request.header, root);
                this.writeNode("Request", request, root);
                return root;
            },
            "RequestHeader": function(header) {
                return this.createElementNSPlus("xls:RequestHeader");
            },
            "Request": function(request) {
                var node = this.createElementNSPlus("xls:Request", {
                    attributes: {
                        methodName: "GeocodeRequest",
                        requestID: request.requestID || "",
                        version: this.VERSION
                    }
                });
                this.writeNode("GeocodeRequest", request.addresses, node);
                return node;
            },
            "GeocodeRequest": function(addresses) {
                var node = this.createElementNSPlus("xls:GeocodeRequest");
                for (var i=0, len=addresses.length; i<len; i++) {
                    this.writeNode("Address", addresses[i], node);
                }
                return node;
            },
            "Address": function(address) {
                var node = this.createElementNSPlus("xls:Address", {
                    attributes: {
                        countryCode: address.countryCode
                    }
                });
                if (address.freeFormAddress) {
                    this.writeNode("freeFormAddress", address.freeFormAddress, node);
                } else {
                    if (address.street) {
                        this.writeNode("StreetAddress", address, node);
                    }
                    if (address.municipality) {
                        this.writeNode("Municipality", address.municipality, node);
                    }
                    if (address.countrySubdivision) {
                        this.writeNode("CountrySubdivision", address.countrySubdivision, node);
                    }
                    if (address.postalCode) {
                        this.writeNode("PostalCode", address.postalCode, node);
                    }
                }
                return node;
            },
            "freeFormAddress": function(freeFormAddress) {
                return this.createElementNSPlus("freeFormAddress", 
                    {value: freeFormAddress});
            },
            "StreetAddress": function(address) {
                var node = this.createElementNSPlus("xls:StreetAddress");
                if (address.building) {
                    this.writeNode(node, "Building", address.building);
                }
                var street = address.street;
                if (!(OpenLayers.Util.isArray(street))) {
                    street = [street];
                }
                for (var i=0, len=street.length; i < len; i++) {
                    this.writeNode("Street", street[i], node);
                }
                return node;
            },
            "Building": function(building) {
                return this.createElementNSPlus("xls:Building", {
                    attributes: {
                        "number": building["number"],
                        "subdivision": building.subdivision,
                        "buildingName": building.buildingName
                    }
                });
            },
            "Street": function(street) {
                return this.createElementNSPlus("xls:Street", {value: street});
            },
            "Municipality": function(municipality) {
                return this.createElementNSPlus("xls:Place", {
                    attributes: {
                        type: "Municipality"
                    },
                    value: municipality
                });
            },
            "CountrySubdivision": function(countrySubdivision) {
                return this.createElementNSPlus("xls:Place", {
                    attributes: {
                        type: "CountrySubdivision"
                    },
                    value: countrySubdivision
                });
            },
            "PostalCode": function(postalCode) {
                return this.createElementNSPlus("xls:PostalCode", {
                    value: postalCode
                });
            }
        }
    },
    
    CLASS_NAME: "OpenLayers.Format.XLS.v1" 

});
