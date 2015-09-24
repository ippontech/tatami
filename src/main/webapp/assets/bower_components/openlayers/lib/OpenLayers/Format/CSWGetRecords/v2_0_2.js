/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.CSWGetRecords.v2_0_2 = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        csw: "http://www.opengis.net/cat/csw/2.0.2",
        dc: "http://purl.org/dc/elements/1.1/",
        dct: "http://purl.org/dc/terms/",
        gmd: "http://www.isotc211.org/2005/gmd",
        geonet: "http://www.fao.org/geonetwork",
        ogc: "http://www.opengis.net/ogc",
        ows: "http://www.opengis.net/ows",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        xmlns: "http://www.w3.org/2000/xmlns/"
    },
    
        defaultPrefix: "csw",
    
        version: "2.0.2",
    
        schemaLocation: "http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd",

        requestId: null,

        resultType: null,

        outputFormat: null,

        outputSchema: null,

        startPosition: null,

        maxRecords: null,

        DistributedSearch: null,

        ResponseHandler: null,

        Query: null,

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

        initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

        read: function(data) {
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var obj = {};
        this.readNode(data, obj);
        return obj;
    },
    
        readers: {
        "csw": {
            "GetRecordsResponse": function(node, obj) {
                obj.records = [];
                this.readChildNodes(node, obj);
                var version = this.getAttributeNS(node, "", 'version');
                if (version != "") {
                    obj.version = version;
                }
            },
            "RequestId": function(node, obj) {
                obj.RequestId = this.getChildValue(node);
            },
            "SearchStatus": function(node, obj) {
                obj.SearchStatus = {};
                var timestamp = this.getAttributeNS(node, "", 'timestamp');
                if (timestamp != "") {
                    obj.SearchStatus.timestamp = timestamp;
                }
            },
            "SearchResults": function(node, obj) {
                this.readChildNodes(node, obj);
                var attrs = node.attributes;
                var SearchResults = {};
                for(var i=0, len=attrs.length; i<len; ++i) {
                    if ((attrs[i].name == "numberOfRecordsMatched") ||
                        (attrs[i].name == "numberOfRecordsReturned") ||
                        (attrs[i].name == "nextRecord")) {
                        SearchResults[attrs[i].name] = parseInt(attrs[i].nodeValue);
                    } else {
                        SearchResults[attrs[i].name] = attrs[i].nodeValue;
                    }
                }
                obj.SearchResults = SearchResults;
            },
            "SummaryRecord": function(node, obj) {
                var record = {type: "SummaryRecord"};
                this.readChildNodes(node, record);
                obj.records.push(record);
            },
            "BriefRecord": function(node, obj) {
                var record = {type: "BriefRecord"};
                this.readChildNodes(node, record);
                obj.records.push(record);
            },
            "DCMIRecord": function(node, obj) {
                var record = {type: "DCMIRecord"};
                this.readChildNodes(node, record);
                obj.records.push(record);
            },
            "Record": function(node, obj) {
                var record = {type: "Record"};
                this.readChildNodes(node, record);
                obj.records.push(record);
            },
            "*": function(node, obj) {
                var name = node.localName || node.nodeName.split(":").pop();
                obj[name] = this.getChildValue(node);
            }
        },
        "geonet": {
            "info": function(node, obj) {
                var gninfo = {};
                this.readChildNodes(node, gninfo);
                obj.gninfo = gninfo;
            }
        },
        "dc": {
            "*": function(node, obj) {
                var name = node.localName || node.nodeName.split(":").pop();
                if (!(OpenLayers.Util.isArray(obj[name]))) {
                    obj[name] = [];
                }
                var dc_element = {};
                var attrs = node.attributes;
                for(var i=0, len=attrs.length; i<len; ++i) {
                    dc_element[attrs[i].name] = attrs[i].nodeValue;
                }
                dc_element.value = this.getChildValue(node);
                if (dc_element.value != "") {
                    obj[name].push(dc_element);
                }
            }
        },
        "dct": {
            "*": function(node, obj) {
                var name = node.localName || node.nodeName.split(":").pop();
                if (!(OpenLayers.Util.isArray(obj[name]))) {
                    obj[name] = [];
                }
                obj[name].push(this.getChildValue(node));
            }
        },
        "ows": OpenLayers.Util.applyDefaults({
            "BoundingBox": function(node, obj) {
                if (obj.bounds) {
                    obj.BoundingBox = [{crs: obj.projection, value: 
                        [
                            obj.bounds.left, 
                            obj.bounds.bottom, 
                            obj.bounds.right, 
                            obj.bounds.top
                    ]
                    }];
                    delete obj.projection;
                    delete obj.bounds;
                }
                OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers["ows"]["BoundingBox"].apply(
                    this, arguments);
            }
        }, OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers["ows"])
    },
    
        write: function(options) {
        var node = this.writeNode("csw:GetRecords", options);
        this.setAttributeNS(
            node, this.namespaces.xmlns,
            "xmlns:gmd", this.namespaces.gmd
        );
        return OpenLayers.Format.XML.prototype.write.apply(this, [node]);
    },

        writers: {
        "csw": {
            "GetRecords": function(options) {
                if (!options) {
                    options = {};
                }
                var node = this.createElementNSPlus("csw:GetRecords", {
                    attributes: {
                        service: "CSW",
                        version: this.version,
                        requestId: options.requestId || this.requestId,
                        resultType: options.resultType || this.resultType,
                        outputFormat: options.outputFormat || this.outputFormat,
                        outputSchema: options.outputSchema || this.outputSchema,
                        startPosition: options.startPosition || this.startPosition,
                        maxRecords: options.maxRecords || this.maxRecords
                    }
                });
                if (options.DistributedSearch || this.DistributedSearch) {
                    this.writeNode(
                        "csw:DistributedSearch",
                        options.DistributedSearch || this.DistributedSearch,
                        node
                    );
                }
                var ResponseHandler = options.ResponseHandler || this.ResponseHandler;
                if (OpenLayers.Util.isArray(ResponseHandler) && ResponseHandler.length > 0) {
                    for(var i=0, len=ResponseHandler.length; i<len; i++) {
                        this.writeNode(
                            "csw:ResponseHandler",
                            ResponseHandler[i],
                            node
                        );
                    }
                }
                this.writeNode("Query", options.Query || this.Query, node);
                return node;
            },
            "DistributedSearch": function(options) {
                var node = this.createElementNSPlus("csw:DistributedSearch", {
                    attributes: {
                        hopCount: options.hopCount
                    }
                });
                return node;
            },
            "ResponseHandler": function(options) {
                var node = this.createElementNSPlus("csw:ResponseHandler", {
                    value: options.value
                });
                return node;
            },
            "Query": function(options) {
                if (!options) {
                    options = {};
                }
                var node = this.createElementNSPlus("csw:Query", {
                    attributes: {
                        typeNames: options.typeNames || "csw:Record"
                    }
                });
                var ElementName = options.ElementName;
                if (OpenLayers.Util.isArray(ElementName) && ElementName.length > 0) {
                    for(var i=0, len=ElementName.length; i<len; i++) {
                        this.writeNode(
                            "csw:ElementName",
                            ElementName[i],
                            node
                        );
                    }
                } else {
                    this.writeNode(
                        "csw:ElementSetName",
                        options.ElementSetName || {value: 'summary'},
                        node
                    );
                }
                if (options.Constraint) {
                    this.writeNode(
                        "csw:Constraint",
                        options.Constraint,
                        node
                    );
                }
                if (options.SortBy) {
                    this.writeNode(
                        "ogc:SortBy",
                        options.SortBy,
                        node
                    );
                }
                return node;
            },
            "ElementName": function(options) {
                var node = this.createElementNSPlus("csw:ElementName", {
                    value: options.value
                });
                return node;
            },
            "ElementSetName": function(options) {
                var node = this.createElementNSPlus("csw:ElementSetName", {
                    attributes: {
                        typeNames: options.typeNames
                    },
                    value: options.value
                });
                return node;
            },
            "Constraint": function(options) {
                var node = this.createElementNSPlus("csw:Constraint", {
                    attributes: {
                        version: options.version
                    }
                });
                if (options.Filter) {
                    var format = new OpenLayers.Format.Filter({
                        version: options.version
                    });
                    node.appendChild(format.write(options.Filter));
                } else if (options.CqlText) {
                    var child = this.createElementNSPlus("CqlText", {
                        value: options.CqlText.value
                    });
                    node.appendChild(child);
                }
                return node;
            }
        },
        "ogc": OpenLayers.Format.Filter.v1_1_0.prototype.writers["ogc"]
    },
   
    CLASS_NAME: "OpenLayers.Format.CSWGetRecords.v2_0_2" 
});
