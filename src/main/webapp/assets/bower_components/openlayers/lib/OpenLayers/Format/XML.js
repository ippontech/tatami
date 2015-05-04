/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.XML = OpenLayers.Class(OpenLayers.Format, {
    
        namespaces: null,
    
        namespaceAlias: null,
    
        defaultPrefix: null,
    
        readers: {},
    
        writers: {},

        xmldom: null,

        initialize: function(options) {
        if (OpenLayers.Format.XML.supportActiveX) {
            this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
        }
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
        this.namespaces = OpenLayers.Util.extend({}, this.namespaces);
        this.namespaceAlias = {};
        for(var alias in this.namespaces) {
            this.namespaceAlias[this.namespaces[alias]] = alias;
        }
    },
    
        destroy: function() {
        this.xmldom = null;
        OpenLayers.Format.prototype.destroy.apply(this, arguments);
    },
    
        setNamespace: function(alias, uri) {
        this.namespaces[alias] = uri;
        this.namespaceAlias[uri] = alias;
    },

        read: function(text) {
        var index = text.indexOf('<');
        if(index > 0) {
            text = text.substring(index);
        }
        var node = OpenLayers.Util.Try(
            OpenLayers.Function.bind((
                function() {
                    var xmldom;
                                        if (OpenLayers.Format.XML.supportActiveX && !this.xmldom) {
                        xmldom = new ActiveXObject("Microsoft.XMLDOM");
                    } else {
                        xmldom = this.xmldom;
                        
                    }
                    xmldom.loadXML(text);
                    return xmldom;
                }
            ), this),
            function() {
                return new DOMParser().parseFromString(text, 'text/xml');
            },
            function() {
                var req = new XMLHttpRequest();
                req.open("GET", "data:" + "text/xml" +
                         ";charset=utf-8," + encodeURIComponent(text), false);
                if(req.overrideMimeType) {
                    req.overrideMimeType("text/xml");
                }
                req.send(null);
                return req.responseXML;
            }
        );

        if(this.keepData) {
            this.data = node;
        }

        return node;
    },

        write: function(node) {
        var data;
        if(this.xmldom) {
            data = node.xml;
        } else {
            var serializer = new XMLSerializer();
            if (node.nodeType == 1) {
                var doc = document.implementation.createDocument("", "", null);
                if (doc.importNode) {
                    node = doc.importNode(node, true);
                }
                doc.appendChild(node);
                data = serializer.serializeToString(doc);
            } else {
                data = serializer.serializeToString(node);
            }
        }
        return data;
    },

        createElementNS: function(uri, name) {
        var element;
        if(this.xmldom) {
            if(typeof uri == "string") {
                element = this.xmldom.createNode(1, name, uri);
            } else {
                element = this.xmldom.createNode(1, name, "");
            }
        } else {
            element = document.createElementNS(uri, name);
        }
        return element;
    },

        createDocumentFragment: function() {
        var element;
        if (this.xmldom) {
            element = this.xmldom.createDocumentFragment();
        } else {
            element = document.createDocumentFragment();
        }
        return element;
    },

        createTextNode: function(text) {
        var node;
        if (typeof text !== "string") {
            text = String(text);
        }
        if(this.xmldom) {
            node = this.xmldom.createTextNode(text);
        } else {
            node = document.createTextNode(text);
        }
        return node;
    },

        getElementsByTagNameNS: function(node, uri, name) {
        var elements = [];
        if(node.getElementsByTagNameNS) {
            elements = node.getElementsByTagNameNS(uri, name);
        } else {
            var allNodes = node.getElementsByTagName("*");
            var potentialNode, fullName;
            for(var i=0, len=allNodes.length; i<len; ++i) {
                potentialNode = allNodes[i];
                fullName = (potentialNode.prefix) ?
                           (potentialNode.prefix + ":" + name) : name;
                if((name == "*") || (fullName == potentialNode.nodeName)) {
                    if((uri == "*") || (uri == potentialNode.namespaceURI)) {
                        elements.push(potentialNode);
                    }
                }
            }
        }
        return elements;
    },

        getAttributeNodeNS: function(node, uri, name) {
        var attributeNode = null;
        if(node.getAttributeNodeNS) {
            attributeNode = node.getAttributeNodeNS(uri, name);
        } else {
            var attributes = node.attributes;
            var potentialNode, fullName;
            for(var i=0, len=attributes.length; i<len; ++i) {
                potentialNode = attributes[i];
                if(potentialNode.namespaceURI == uri) {
                    fullName = (potentialNode.prefix) ?
                               (potentialNode.prefix + ":" + name) : name;
                    if(fullName == potentialNode.nodeName) {
                        attributeNode = potentialNode;
                        break;
                    }
                }
            }
        }
        return attributeNode;
    },

        getAttributeNS: function(node, uri, name) {
        var attributeValue = "";
        if(node.getAttributeNS) {
            attributeValue = node.getAttributeNS(uri, name) || "";
        } else {
            var attributeNode = this.getAttributeNodeNS(node, uri, name);
            if(attributeNode) {
                attributeValue = attributeNode.nodeValue;
            }
        }
        return attributeValue;
    },
    
        getChildValue: function(node, def) {
        var value = def || "";
        if(node) {
            for(var child=node.firstChild; child; child=child.nextSibling) {
                switch(child.nodeType) {
                    case 3: // text node
                    case 4: // cdata section
                        value += child.nodeValue;
                }
            }
        }
        return value;
    },

        isSimpleContent: function(node) {
        var simple = true;
        for(var child=node.firstChild; child; child=child.nextSibling) {
            if(child.nodeType === 1) {
                simple = false;
                break;
            }
        }
        return simple;
    },
    
        contentType: function(node) {
        var simple = false,
            complex = false;
            
        var type = OpenLayers.Format.XML.CONTENT_TYPE.EMPTY;

        for(var child=node.firstChild; child; child=child.nextSibling) {
            switch(child.nodeType) {
                case 1: // element
                    complex = true;
                    break;
                case 8: // comment
                    break;
                default:
                    simple = true;
            }
            if(complex && simple) {
                break;
            }
        }
        
        if(complex && simple) {
            type = OpenLayers.Format.XML.CONTENT_TYPE.MIXED;
        } else if(complex) {
            return OpenLayers.Format.XML.CONTENT_TYPE.COMPLEX;
        } else if(simple) {
            return OpenLayers.Format.XML.CONTENT_TYPE.SIMPLE;
        }
        return type;
    },

        hasAttributeNS: function(node, uri, name) {
        var found = false;
        if(node.hasAttributeNS) {
            found = node.hasAttributeNS(uri, name);
        } else {
            found = !!this.getAttributeNodeNS(node, uri, name);
        }
        return found;
    },
    
        setAttributeNS: function(node, uri, name, value) {
        if(node.setAttributeNS) {
            node.setAttributeNS(uri, name, value);
        } else {
            if(this.xmldom) {
                if(uri) {
                    var attribute = node.ownerDocument.createNode(
                        2, name, uri
                    );
                    attribute.nodeValue = value;
                    node.setAttributeNode(attribute);
                } else {
                    node.setAttribute(name, value);
                }
            } else {
                throw "setAttributeNS not implemented";
            }
        }
    },

        createElementNSPlus: function(name, options) {
        options = options || {};
        var uri = options.uri || this.namespaces[options.prefix];
        if(!uri) {
            var loc = name.indexOf(":");
            uri = this.namespaces[name.substring(0, loc)];
        }
        if(!uri) {
            uri = this.namespaces[this.defaultPrefix];
        }
        var node = this.createElementNS(uri, name);
        if(options.attributes) {
            this.setAttributes(node, options.attributes);
        }
        var value = options.value;
        if(value != null) {
            node.appendChild(this.createTextNode(value));
        }
        return node;
    },
    
        setAttributes: function(node, obj) {
        var value, uri;
        for(var name in obj) {
            if(obj[name] != null && obj[name].toString) {
                value = obj[name].toString();
                uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
                this.setAttributeNS(node, uri, name, value);
            }
        }
    },

        getFirstElementChild: function(node) {
        if (node.firstElementChild) {
            return node.firstElementChild;
        }
        else {
            var child = node.firstChild;
            while (child.nodeType != 1 && (child = child.nextSibling)) {}
            return child;
        }
    },

        readNode: function(node, obj) {
        if(!obj) {
            obj = {};
        }
        var group = this.readers[node.namespaceURI ? this.namespaceAlias[node.namespaceURI]: this.defaultPrefix];
        if(group) {
            var local = node.localName || node.nodeName.split(":").pop();
            var reader = group[local] || group["*"];
            if(reader) {
                reader.apply(this, [node, obj]);
            }
        }
        return obj;
    },

        readChildNodes: function(node, obj) {
        if(!obj) {
            obj = {};
        }
        var children = node.childNodes;
        var child;
        for(var i=0, len=children.length; i<len; ++i) {
            child = children[i];
            if(child.nodeType == 1) {
                this.readNode(child, obj);
            }
        }
        return obj;
    },

        writeNode: function(name, obj, parent) {
        var prefix, local;
        var split = name.indexOf(":");
        if(split > 0) {
            prefix = name.substring(0, split);
            local = name.substring(split + 1);
        } else {
            if(parent) {
                prefix = this.namespaceAlias[parent.namespaceURI];
            } else {
                prefix = this.defaultPrefix;
            }
            local = name;
        }
        var child = this.writers[prefix][local].apply(this, [obj]);
        if(parent) {
            parent.appendChild(child);
        }
        return child;
    },

        getChildEl: function(node, name, uri) {
        return node && this.getThisOrNextEl(node.firstChild, name, uri);
    },
    
        getNextEl: function(node, name, uri) {
        return node && this.getThisOrNextEl(node.nextSibling, name, uri);
    },
    
        getThisOrNextEl: function(node, name, uri) {
        outer: for(var sibling=node; sibling; sibling=sibling.nextSibling) {
            switch(sibling.nodeType) {
                case 1: // Element
                    if((!name || name === (sibling.localName || sibling.nodeName.split(":").pop())) &&
                       (!uri || uri === sibling.namespaceURI)) {
                        break outer;
                    }
                    sibling = null;
                    break outer;
                case 3: // Text
                    if(/^\s*$/.test(sibling.nodeValue)) {
                        break;
                    }
                case 4: // CDATA
                case 6: // ENTITY_NODE
                case 12: // NOTATION_NODE
                case 10: // DOCUMENT_TYPE_NODE
                case 11: // DOCUMENT_FRAGMENT_NODE
                    sibling = null;
                    break outer;
            } // ignore comments and processing instructions
        }
        return sibling || null;
    },
    
        lookupNamespaceURI: function(node, prefix) {
        var uri = null;
        if(node) {
            if(node.lookupNamespaceURI) {
                uri = node.lookupNamespaceURI(prefix);
            } else {
                outer: switch(node.nodeType) {
                    case 1: // ELEMENT_NODE
                        if(node.namespaceURI !== null && node.prefix === prefix) {
                            uri = node.namespaceURI;
                            break outer;
                        }
                        var len = node.attributes.length;
                        if(len) {
                            var attr;
                            for(var i=0; i<len; ++i) {
                                attr = node.attributes[i];
                                if(attr.prefix === "xmlns" && attr.name === "xmlns:" + prefix) {
                                    uri = attr.value || null;
                                    break outer;
                                } else if(attr.name === "xmlns" && prefix === null) {
                                    uri = attr.value || null;
                                    break outer;
                                }
                            }
                        }
                        uri = this.lookupNamespaceURI(node.parentNode, prefix);
                        break outer;
                    case 2: // ATTRIBUTE_NODE
                        uri = this.lookupNamespaceURI(node.ownerElement, prefix);
                        break outer;
                    case 9: // DOCUMENT_NODE
                        uri = this.lookupNamespaceURI(node.documentElement, prefix);
                        break outer;
                    case 6: // ENTITY_NODE
                    case 12: // NOTATION_NODE
                    case 10: // DOCUMENT_TYPE_NODE
                    case 11: // DOCUMENT_FRAGMENT_NODE
                        break outer;
                    default: 
                        uri =  this.lookupNamespaceURI(node.parentNode, prefix);
                        break outer;
                }
            }
        }
        return uri;
    },
    
        getXMLDoc: function() {
        if (!OpenLayers.Format.XML.document && !this.xmldom) {
            if (document.implementation && document.implementation.createDocument) {
                OpenLayers.Format.XML.document =
                    document.implementation.createDocument("", "", null);
            } else if (!this.xmldom && OpenLayers.Format.XML.supportActiveX) {
                this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
            }
        }
        return OpenLayers.Format.XML.document || this.xmldom;
    },

    CLASS_NAME: "OpenLayers.Format.XML" 

});     

OpenLayers.Format.XML.CONTENT_TYPE = {EMPTY: 0, SIMPLE: 1, COMPLEX: 2, MIXED: 3};

OpenLayers.Format.XML.lookupNamespaceURI = OpenLayers.Function.bind(
    OpenLayers.Format.XML.prototype.lookupNamespaceURI,
    OpenLayers.Format.XML.prototype
);

OpenLayers.Format.XML.document = null;

OpenLayers.Format.XML.supportActiveX = (function () {
    return (Object.getOwnPropertyDescriptor &&
            Object.getOwnPropertyDescriptor(window, "ActiveXObject")) ||
            ("ActiveXObject" in window);
})();
