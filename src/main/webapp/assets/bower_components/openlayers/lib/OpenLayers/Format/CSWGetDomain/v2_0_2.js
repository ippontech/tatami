/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.CSWGetDomain.v2_0_2 = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        csw: "http://www.opengis.net/cat/csw/2.0.2"
    },

        defaultPrefix: "csw",
    
        version: "2.0.2",
    
        schemaLocation: "http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd",

        PropertyName: null,

        ParameterName: null,
    
    
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
            "GetDomainResponse": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "DomainValues": function(node, obj) {
                if (!(OpenLayers.Util.isArray(obj.DomainValues))) {
                    obj.DomainValues = [];
                }
                var attrs = node.attributes;
                var domainValue = {};
                for(var i=0, len=attrs.length; i<len; ++i) {
                    domainValue[attrs[i].name] = attrs[i].nodeValue;
                }
                this.readChildNodes(node, domainValue);
                obj.DomainValues.push(domainValue);
            },
            "PropertyName": function(node, obj) {
                obj.PropertyName = this.getChildValue(node);
            },
            "ParameterName": function(node, obj) {
                obj.ParameterName = this.getChildValue(node);
            },
            "ListOfValues": function(node, obj) {
                if (!(OpenLayers.Util.isArray(obj.ListOfValues))) {
                    obj.ListOfValues = [];
                }
                this.readChildNodes(node, obj.ListOfValues);
            },
            "Value": function(node, obj) {
                var attrs = node.attributes;
                var value = {};
                for(var i=0, len=attrs.length; i<len; ++i) {
                    value[attrs[i].name] = attrs[i].nodeValue;
                }
                value.value = this.getChildValue(node);
                obj.push({Value: value});
            },
            "ConceptualScheme": function(node, obj) {
                obj.ConceptualScheme = {};
                this.readChildNodes(node, obj.ConceptualScheme);
            },
            "Name": function(node, obj) {
                obj.Name = this.getChildValue(node);
            },
            "Document": function(node, obj) {
                obj.Document = this.getChildValue(node);
            },
            "Authority": function(node, obj) {
                obj.Authority = this.getChildValue(node);
            },
            "RangeOfValues": function(node, obj) {
                obj.RangeOfValues = {};
                this.readChildNodes(node, obj.RangeOfValues);
            },
            "MinValue": function(node, obj) {
                var attrs = node.attributes;
                var value = {};
                for(var i=0, len=attrs.length; i<len; ++i) {
                    value[attrs[i].name] = attrs[i].nodeValue;
                }
                value.value = this.getChildValue(node);
                obj.MinValue = value;
            },
            "MaxValue": function(node, obj) {
                var attrs = node.attributes;
                var value = {};
                for(var i=0, len=attrs.length; i<len; ++i) {
                    value[attrs[i].name] = attrs[i].nodeValue;
                }
                value.value = this.getChildValue(node);
                obj.MaxValue = value;
            }
        }
    },
    
        write: function(options) {
        var node = this.writeNode("csw:GetDomain", options);
        return OpenLayers.Format.XML.prototype.write.apply(this, [node]);
    },

        writers: {
        "csw": {
            "GetDomain": function(options) {
                var node = this.createElementNSPlus("csw:GetDomain", {
                    attributes: {
                        service: "CSW",
                        version: this.version
                    }
                });
                if (options.PropertyName || this.PropertyName) {
                    this.writeNode(
                        "csw:PropertyName",
                        options.PropertyName || this.PropertyName,
                        node
                    );
                } else if (options.ParameterName || this.ParameterName) {
                    this.writeNode(
                        "csw:ParameterName",
                        options.ParameterName || this.ParameterName,
                        node
                    );
                }
                this.readChildNodes(node, options);
                return node;
            },
            "PropertyName": function(value) {
                var node = this.createElementNSPlus("csw:PropertyName", {
                    value: value
                });
                return node;
            },
            "ParameterName": function(value) {
                var node = this.createElementNSPlus("csw:ParameterName", {
                    value: value
                });
                return node;
            }
        }
    },
   
    CLASS_NAME: "OpenLayers.Format.CSWGetDomain.v2_0_2" 
});
