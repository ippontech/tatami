/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

 
OpenLayers.Format.WFSDescribeFeatureType = OpenLayers.Class(
    OpenLayers.Format.XML, {

        regExes: {
        trimSpace: (/^\s*|\s*$/g)
    },
    
        namespaces: {
        xsd: "http://www.w3.org/2001/XMLSchema"
    },
    
        
        readers: {
        "xsd": {
            "schema": function(node, obj) {
                var complexTypes = [];
                var customTypes = {};
                var schema = {
                    complexTypes: complexTypes,
                    customTypes: customTypes
                };
                var i, len;
                
                this.readChildNodes(node, schema);

                var attributes = node.attributes;
                var attr, name;
                for(i=0, len=attributes.length; i<len; ++i) {
                    attr = attributes[i];
                    name = attr.name;
                    if(name.indexOf("xmlns") === 0) {
                        this.setNamespace(name.split(":")[1] || "", attr.value);
                    } else {
                        obj[name] = attr.value;
                    }
                }
                obj.featureTypes = complexTypes;                
                obj.targetPrefix = this.namespaceAlias[obj.targetNamespace];
                var complexType, customType;
                for(i=0, len=complexTypes.length; i<len; ++i) {
                    complexType = complexTypes[i];
                    customType = customTypes[complexType.typeName];
                    if(customTypes[complexType.typeName]) {
                        complexType.typeName = customType.name;
                    }
                }
            },
            "complexType": function(node, obj) {
                var complexType = {
                    "typeName": node.getAttribute("name")
                };
                this.readChildNodes(node, complexType);
                obj.complexTypes.push(complexType);
            },
            "complexContent": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "extension": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "sequence": function(node, obj) {
                var sequence = {
                    elements: []
                };
                this.readChildNodes(node, sequence);
                obj.properties = sequence.elements;
            },
            "element": function(node, obj) {
                var type;
                if(obj.elements) {
                    var element = {};
                    var attributes = node.attributes;
                    var attr;
                    for(var i=0, len=attributes.length; i<len; ++i) {
                        attr = attributes[i];
                        element[attr.name] = attr.value;
                    }
                    
                    type = element.type;
                    if(!type) {
                        type = {};
                        this.readChildNodes(node, type);
                        element.restriction = type;
                        element.type = type.base;
                    }
                    var fullType = type.base || type;
                    element.localType = fullType.split(":").pop();
                    obj.elements.push(element);
                    this.readChildNodes(node, element);
                }
                
                if(obj.complexTypes) {
                    type = node.getAttribute("type");
                    var localType = type.split(":").pop();
                    obj.customTypes[localType] = {
                        "name": node.getAttribute("name"),
                        "type": type
                    };
                }
            },
            "annotation": function(node, obj) {
                obj.annotation = {};
                this.readChildNodes(node, obj.annotation);
            },
            "appinfo": function(node, obj) {
                if (!obj.appinfo) {
                    obj.appinfo = [];
                }
                obj.appinfo.push(this.getChildValue(node));
            },
            "documentation": function(node, obj) {
                if (!obj.documentation) {
                    obj.documentation = [];
                }
                var value = this.getChildValue(node);
                obj.documentation.push({
                    lang: node.getAttribute("xml:lang"),
                    textContent: value.replace(this.regExes.trimSpace, "")
                });
            },
            "simpleType": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "restriction": function(node, obj) {
                obj.base = node.getAttribute("base");
                this.readRestriction(node, obj);
            }
        }
    },
    
        readRestriction: function(node, obj) {
        var children = node.childNodes;
        var child, nodeName, value;
        for(var i=0, len=children.length; i<len; ++i) {
            child = children[i];
            if(child.nodeType == 1) {
                nodeName = child.nodeName.split(":").pop();
                value = child.getAttribute("value");
                if(!obj[nodeName]) {
                    obj[nodeName] = value;
                } else {
                    if(typeof obj[nodeName] == "string") {
                        obj[nodeName] = [obj[nodeName]];
                    }
                    obj[nodeName].push(value);
                }
            }
        }
    },
    
        read: function(data) {
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var schema = {};
        if (data.nodeName.split(":").pop() === 'ExceptionReport') {
            var parser = new OpenLayers.Format.OGCExceptionReport();
            schema.error = parser.read(data);
        } else {
            this.readNode(data, schema);
        }
        return schema;
    },
    
    CLASS_NAME: "OpenLayers.Format.WFSDescribeFeatureType" 

});
