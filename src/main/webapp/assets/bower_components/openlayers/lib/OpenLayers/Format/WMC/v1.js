/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMC.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        ol: "http://openlayers.org/context",
        wmc: "http://www.opengis.net/context",
        sld: "http://www.opengis.net/sld",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },
    
        schemaLocation: "",

        getNamespacePrefix: function(uri) {
        var prefix = null;
        if(uri == null) {
            prefix = this.namespaces[this.defaultPrefix];
        } else {
            for(prefix in this.namespaces) {
                if(this.namespaces[prefix] == uri) {
                    break;
                }
            }
        }
        return prefix;
    },
    
        defaultPrefix: "wmc",

        rootPrefix: null,
    
        defaultStyleName: "",
    
        defaultStyleTitle: "Default",
    
        initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },

        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        this.rootPrefix = root.prefix;
        var context = {
            version: root.getAttribute("version")
        };
        this.runChildNodes(context, root);
        return context;
    },
    
        runChildNodes: function(obj, node) {
        var children = node.childNodes;
        var childNode, processor, prefix, local;
        for(var i=0, len=children.length; i<len; ++i) {
            childNode = children[i];
            if(childNode.nodeType == 1) {
                prefix = this.getNamespacePrefix(childNode.namespaceURI);
                local = childNode.nodeName.split(":").pop();
                processor = this["read_" + prefix + "_" + local];
                if(processor) {
                    processor.apply(this, [obj, childNode]);
                }
            }
        }
    },
    
        read_wmc_General: function(context, node) {
        this.runChildNodes(context, node);
    },
    
        read_wmc_BoundingBox: function(context, node) {
        context.projection = node.getAttribute("SRS");
        context.bounds = new OpenLayers.Bounds(
            node.getAttribute("minx"), node.getAttribute("miny"),
            node.getAttribute("maxx"), node.getAttribute("maxy")
        );
    },
    
        read_wmc_LayerList: function(context, node) {
        context.layersContext = [];
        this.runChildNodes(context, node);
    },
    
        read_wmc_Layer: function(context, node) {
        var layerContext = {
            visibility: (node.getAttribute("hidden") != "1"),
            queryable: (node.getAttribute("queryable") == "1"),
            formats: [],
             styles: [],
             metadata: {}
        };

        this.runChildNodes(layerContext, node);
        context.layersContext.push(layerContext);
    },
    
        read_wmc_Extension: function(obj, node) {
        this.runChildNodes(obj, node);
    },

        read_ol_units: function(layerContext, node) {
        layerContext.units = this.getChildValue(node);
    },
    
        read_ol_maxExtent: function(obj, node) {
        var bounds = new OpenLayers.Bounds(
            node.getAttribute("minx"), node.getAttribute("miny"),
            node.getAttribute("maxx"), node.getAttribute("maxy")
        );
        obj.maxExtent = bounds;
    },
    
        read_ol_transparent: function(layerContext, node) {
        layerContext.transparent = this.getChildValue(node);
    },

        read_ol_numZoomLevels: function(layerContext, node) {
        layerContext.numZoomLevels = parseInt(this.getChildValue(node));
    },

        read_ol_opacity: function(layerContext, node) {
        layerContext.opacity = parseFloat(this.getChildValue(node));
    },

        read_ol_singleTile: function(layerContext, node) {
        layerContext.singleTile = (this.getChildValue(node) == "true");
    },

        read_ol_tileSize: function(layerContext, node) {
        var obj = {"width": node.getAttribute("width"), "height": node.getAttribute("height")};
        layerContext.tileSize = obj;
    },

        read_ol_gutter: function(layerContext, node) {
        layerContext.gutter = parseInt(this.getChildValue(node));
    },

        read_ol_isBaseLayer: function(layerContext, node) {
        layerContext.isBaseLayer = (this.getChildValue(node) == "true");
    },

        read_ol_displayInLayerSwitcher: function(layerContext, node) {
        layerContext.displayInLayerSwitcher = (this.getChildValue(node) == "true");
    },

        read_ol_attribution: function(obj, node) {
        obj.attribution = {};
        this.runChildNodes(obj.attribution, node);
    },

        read_wmc_Server: function(layerContext, node) {
        layerContext.version = node.getAttribute("version");
         layerContext.url = this.getOnlineResource_href(node);
         layerContext.metadata.servertitle = node.getAttribute("title");
    },

        read_wmc_FormatList: function(layerContext, node) {
        this.runChildNodes(layerContext, node);
    },

        read_wmc_Format: function(layerContext, node) {
        var format = {
            value: this.getChildValue(node)
        };
        if(node.getAttribute("current") == "1") {
            format.current = true;
        }
        layerContext.formats.push(format);
    },
    
        read_wmc_StyleList: function(layerContext, node) {
        this.runChildNodes(layerContext, node);
    },

        read_wmc_Style: function(layerContext, node) {
        var style = {};
        this.runChildNodes(style, node);
        if(node.getAttribute("current") == "1") {
            style.current = true;
        }
        layerContext.styles.push(style);
    },
    
        read_wmc_SLD: function(style, node) {
        this.runChildNodes(style, node);
    },
    
        read_sld_StyledLayerDescriptor: function(sld, node) {
        var xml = OpenLayers.Format.XML.prototype.write.apply(this, [node]);
        sld.body = xml;
    },

         read_sld_FeatureTypeStyle: function(sld, node) {
         var xml = OpenLayers.Format.XML.prototype.write.apply(this, [node]);
         sld.body = xml;
     },

         read_wmc_OnlineResource: function(obj, node) {
        obj.href = this.getAttributeNS(
            node, this.namespaces.xlink, "href"
        );
    },
    
        read_wmc_Name: function(obj, node) {
        var name = this.getChildValue(node);
        if(name) {
            obj.name = name;
        }
    },

        read_wmc_Title: function(obj, node) {
        var title = this.getChildValue(node);
        if(title) {
            obj.title = title;
        }
    },

        read_wmc_MetadataURL: function(layerContext, node) {
         layerContext.metadataURL = this.getOnlineResource_href(node);
     },

          read_wmc_KeywordList: function(context, node) {
         context.keywords = [];
         this.runChildNodes(context.keywords, node);
    },

         read_wmc_Keyword: function(keywords, node) {
         keywords.push(this.getChildValue(node));
     },

         read_wmc_Abstract: function(obj, node) {
        var abst = this.getChildValue(node);
        if(abst) {
            obj["abstract"] = abst;
        }
    },
    
         read_wmc_LogoURL: function(context, node) {
         context.logo = {
             width:  node.getAttribute("width"),
             height: node.getAttribute("height"),
             format: node.getAttribute("format"),
             href:   this.getOnlineResource_href(node)
         };
     },

          read_wmc_DescriptionURL: function(context, node) {
         context.descriptionURL = this.getOnlineResource_href(node);
     },

          read_wmc_ContactInformation: function(obj, node) {
         var contact = {};
         this.runChildNodes(contact, node);
         obj.contactInformation = contact;
     },

          read_wmc_ContactPersonPrimary: function(contact, node) {
         var personPrimary = {};
         this.runChildNodes(personPrimary, node);
         contact.personPrimary = personPrimary;
     },

          read_wmc_ContactPerson: function(primaryPerson, node) {
         var person = this.getChildValue(node);
         if (person) {
             primaryPerson.person = person;
         }
     },

          read_wmc_ContactOrganization: function(primaryPerson, node) {
         var organization = this.getChildValue(node);
         if (organization) {
             primaryPerson.organization = organization;
         }
     },

          read_wmc_ContactPosition: function(contact, node) {
         var position = this.getChildValue(node);
         if (position) {
             contact.position = position;
         }
     },

          read_wmc_ContactAddress: function(contact, node) {
         var contactAddress = {};
         this.runChildNodes(contactAddress, node);
         contact.contactAddress = contactAddress;
     },

          read_wmc_AddressType: function(contactAddress, node) {
         var type = this.getChildValue(node);
         if (type) {
             contactAddress.type = type;
         }
     },

          read_wmc_Address: function(contactAddress, node) {
         var address = this.getChildValue(node);
         if (address) {
             contactAddress.address = address;
         }
     },

          read_wmc_City: function(contactAddress, node) {
         var city = this.getChildValue(node);
         if (city) {
             contactAddress.city = city;
         }
     },

          read_wmc_StateOrProvince: function(contactAddress, node) {
         var stateOrProvince = this.getChildValue(node);
         if (stateOrProvince) {
             contactAddress.stateOrProvince = stateOrProvince;
         }
     },

          read_wmc_PostCode: function(contactAddress, node) {
         var postcode = this.getChildValue(node);
         if (postcode) {
             contactAddress.postcode = postcode;
         }
     },

          read_wmc_Country: function(contactAddress, node) {
         var country = this.getChildValue(node);
         if (country) {
             contactAddress.country = country;
         }
     },

          read_wmc_ContactVoiceTelephone: function(contact, node) {
         var phone = this.getChildValue(node);
         if (phone) {
             contact.phone = phone;
         }
     },

          read_wmc_ContactFacsimileTelephone: function(contact, node) {
         var fax = this.getChildValue(node);
         if (fax) {
             contact.fax = fax;
         }
     },

          read_wmc_ContactElectronicMailAddress: function(contact, node) {
         var email = this.getChildValue(node);
         if (email) {
             contact.email = email;
         }
     },

          read_wmc_DataURL: function(layerContext, node) {
         layerContext.dataURL = this.getOnlineResource_href(node);
     },

         read_wmc_LegendURL: function(style, node) {
        var legend = {
            width: node.getAttribute('width'),
             height: node.getAttribute('height'),
             format: node.getAttribute('format'),
             href:   this.getOnlineResource_href(node)
        };
        style.legend = legend;
    },
    
         read_wmc_DimensionList: function(layerContext, node) {
         layerContext.dimensions = {};
         this.runChildNodes(layerContext.dimensions, node);
     },
          read_wmc_Dimension: function(dimensions, node) {
         var name = node.getAttribute("name").toLowerCase();

         var dim = {
             name:           name,
             units:          node.getAttribute("units")          ||  "",
             unitSymbol:     node.getAttribute("unitSymbol")     ||  "",
             userValue:      node.getAttribute("userValue")      ||  "",
             nearestValue:   node.getAttribute("nearestValue")   === "1",
             multipleValues: node.getAttribute("multipleValues") === "1",
             current:        node.getAttribute("current")        === "1",
             "default":      node.getAttribute("default")        ||  ""
         };
         var values = this.getChildValue(node);
         dim.values = values.split(",");

         dimensions[dim.name] = dim;
     },

         write: function(context, options) {
        var root = this.createElementDefaultNS("ViewContext");
        this.setAttributes(root, {
            version: this.VERSION,
            id: (options && typeof options.id == "string") ?
                    options.id :
                    OpenLayers.Util.createUniqueID("OpenLayers_Context_")
        });
        this.setAttributeNS(
            root, this.namespaces.xsi,
            "xsi:schemaLocation", this.schemaLocation
        );
        root.appendChild(this.write_wmc_General(context));
        root.appendChild(this.write_wmc_LayerList(context));

        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },
    
        createElementDefaultNS: function(name, childValue, attributes) {
        var node = this.createElementNS(
            this.namespaces[this.defaultPrefix],
            name
        );
        if(childValue) {
            node.appendChild(this.createTextNode(childValue));
        }
        if(attributes) {
            this.setAttributes(node, attributes);
        }
        return node;
    },
    
        setAttributes: function(node, obj) {
        var value;
        for(var name in obj) {
            value = obj[name].toString();
            if(value.match(/[A-Z]/)) {
                this.setAttributeNS(node, null, name, value);
            } else {
                node.setAttribute(name, value);
            }
        }
    },

        write_wmc_General: function(context) {
        var node = this.createElementDefaultNS("General");
        if(context.size) {
            node.appendChild(this.createElementDefaultNS(
                "Window", null,
                {
                    width: context.size.w,
                    height: context.size.h
                }
            ));
        }
        var bounds = context.bounds;
        node.appendChild(this.createElementDefaultNS(
            "BoundingBox", null,
            {
                minx: bounds.left.toPrecision(18),
                miny: bounds.bottom.toPrecision(18),
                maxx: bounds.right.toPrecision(18),
                maxy: bounds.top.toPrecision(18),
                SRS: context.projection
            }
        ));
        node.appendChild(this.createElementDefaultNS(
            "Title", context.title
        ));
         if (context.keywords) {
             node.appendChild(this.write_wmc_KeywordList(context.keywords));
         }
         if (context["abstract"]) {
             node.appendChild(this.createElementDefaultNS(
                 "Abstract", context["abstract"]
             ));
         }
         if (context.logo) {
             node.appendChild(this.write_wmc_URLType("LogoURL", context.logo.href, context.logo));
         }
         if (context.descriptionURL) {
             node.appendChild(this.write_wmc_URLType("DescriptionURL", context.descriptionURL));
         }
         if (context.contactInformation) {
             node.appendChild(this.write_wmc_ContactInformation(context.contactInformation));
         }
        node.appendChild(this.write_ol_MapExtension(context));
        
        return node;
    },
    
         write_wmc_KeywordList: function(keywords) {
         var node = this.createElementDefaultNS("KeywordList");

         for (var i=0, len=keywords.length; i<len; i++) {
             node.appendChild(this.createElementDefaultNS(
                 "Keyword", keywords[i]
             ));
         }
         return node;
     },
          write_wmc_ContactInformation: function(contact) {
         var node = this.createElementDefaultNS("ContactInformation");

         if (contact.personPrimary) {
             node.appendChild(this.write_wmc_ContactPersonPrimary(contact.personPrimary));
         }
         if (contact.position) {
             node.appendChild(this.createElementDefaultNS(
                 "ContactPosition", contact.position
             ));
         }
         if (contact.contactAddress) {
             node.appendChild(this.write_wmc_ContactAddress(contact.contactAddress));
         }
         if (contact.phone) {
             node.appendChild(this.createElementDefaultNS(
                 "ContactVoiceTelephone", contact.phone
             ));
         }
         if (contact.fax) {
             node.appendChild(this.createElementDefaultNS(
                 "ContactFacsimileTelephone", contact.fax
             ));
         }
         if (contact.email) {
             node.appendChild(this.createElementDefaultNS(
                 "ContactElectronicMailAddress", contact.email
             ));
         }
         return node;
     },

          write_wmc_ContactPersonPrimary: function(personPrimary) {
         var node = this.createElementDefaultNS("ContactPersonPrimary");
         if (personPrimary.person) {
             node.appendChild(this.createElementDefaultNS(
                 "ContactPerson", personPrimary.person
             ));
         }
         if (personPrimary.organization) {
             node.appendChild(this.createElementDefaultNS(
                 "ContactOrganization", personPrimary.organization
             ));
         }
         return node;
     },

          write_wmc_ContactAddress: function(contactAddress) {
         var node = this.createElementDefaultNS("ContactAddress");
         if (contactAddress.type) {
             node.appendChild(this.createElementDefaultNS(
                 "AddressType", contactAddress.type
             ));
         }
         if (contactAddress.address) {
             node.appendChild(this.createElementDefaultNS(
                 "Address", contactAddress.address
             ));
         }
         if (contactAddress.city) {
             node.appendChild(this.createElementDefaultNS(
                 "City", contactAddress.city
             ));
         }
         if (contactAddress.stateOrProvince) {
             node.appendChild(this.createElementDefaultNS(
                 "StateOrProvince", contactAddress.stateOrProvince
             ));
         }
         if (contactAddress.postcode) {
             node.appendChild(this.createElementDefaultNS(
                 "PostCode", contactAddress.postcode
             ));
         }
         if (contactAddress.country) {
             node.appendChild(this.createElementDefaultNS(
                 "Country", contactAddress.country
             ));
         }
         return node;
     },

         write_ol_MapExtension: function(context) {
        var node = this.createElementDefaultNS("Extension");
        
        var bounds = context.maxExtent;
        if(bounds) {
            var maxExtent = this.createElementNS(
                this.namespaces.ol, "ol:maxExtent"
            );
            this.setAttributes(maxExtent, {
                minx: bounds.left.toPrecision(18),
                miny: bounds.bottom.toPrecision(18),
                maxx: bounds.right.toPrecision(18),
                maxy: bounds.top.toPrecision(18)
            });
            node.appendChild(maxExtent);
        }
        
        return node;
    },
    
        write_wmc_LayerList: function(context) {
        var list = this.createElementDefaultNS("LayerList");
        
        for(var i=0, len=context.layersContext.length; i<len; ++i) {
            list.appendChild(this.write_wmc_Layer(context.layersContext[i]));
        }
        
        return list;
    },

        write_wmc_Layer: function(context) {
        var node = this.createElementDefaultNS(
            "Layer", null, {
                queryable: context.queryable ? "1" : "0",
                hidden: context.visibility ? "0" : "1"
            }
        );
        node.appendChild(this.write_wmc_Server(context));
        node.appendChild(this.createElementDefaultNS(
            "Name", context.name
        ));
        node.appendChild(this.createElementDefaultNS(
            "Title", context.title
        ));
         if (context["abstract"]) {
             node.appendChild(this.createElementDefaultNS(
                 "Abstract", context["abstract"]
             ));
         }
         if (context.dataURL) {
             node.appendChild(this.write_wmc_URLType("DataURL", context.dataURL));
         }
        if (context.metadataURL) {
             node.appendChild(this.write_wmc_URLType("MetadataURL", context.metadataURL));
        }
        
        return node;
    },

        write_ol_attribution: function(attribution) {
        if (typeof attribution == "string") {
            attribution = {title: attribution};
        }
        var node = this.createElementNS(this.namespaces.ol, "ol:attribution");
        node.appendChild(this.createElementDefaultNS(
            "Title", attribution.title
        ));
        if (attribution.href) {
            node.appendChild(this.write_wmc_OnlineResource(attribution.href));
        }
        if (attribution.logo) {
            node.appendChild(
                this.write_wmc_URLType("LogoURL", 
                    attribution.logo.href, attribution.logo)
            );
        }
        return node;
    },

        write_wmc_LayerExtension: function(context) {
        var node = this.createElementDefaultNS("Extension");
        
        var bounds = context.maxExtent;
        var maxExtent = this.createElementNS(
            this.namespaces.ol, "ol:maxExtent"
        );
        this.setAttributes(maxExtent, {
            minx: bounds.left.toPrecision(18),
            miny: bounds.bottom.toPrecision(18),
            maxx: bounds.right.toPrecision(18),
            maxy: bounds.top.toPrecision(18)
        });
        node.appendChild(maxExtent);
        
        if (context.tileSize && !context.singleTile) {
            var size = this.createElementNS(
                this.namespaces.ol, "ol:tileSize"
            );
            this.setAttributes(size, context.tileSize);
            node.appendChild(size);
        }

        var properties = [
            "transparent", "numZoomLevels", "units", "isBaseLayer",
            "opacity", "displayInLayerSwitcher", "singleTile", "gutter"
        ];
        var child;
        for(var i=0, len=properties.length; i<len; ++i) {
            child = this.createOLPropertyNode(context, properties[i]);
            if(child) {
                node.appendChild(child);
            }
        }

        if (context.attribution) {
            var attribution = this.write_ol_attribution(context.attribution);
            node.appendChild(attribution);
        }

        return node;
    },
    
        createOLPropertyNode: function(obj, prop) {
        var node = null;
        if(obj[prop] != null) {
            node = this.createElementNS(this.namespaces.ol, "ol:" + prop);
            node.appendChild(this.createTextNode(obj[prop].toString()));
        }
        return node;
    },

        write_wmc_Server: function(context) {
         var server = context.server;
        var node = this.createElementDefaultNS("Server");
         var attributes = {
            service: "OGC:WMS",
             version: server.version
         };
         if (server.title) {
             attributes.title = server.title;
         }
         this.setAttributes(node, attributes);
         node.appendChild(this.write_wmc_OnlineResource(server.url));
        
        return node;
    },

         write_wmc_URLType: function(elName, url, attr) {
         var node = this.createElementDefaultNS(elName);
         node.appendChild(this.write_wmc_OnlineResource(url));
         if (attr) {
             var optionalAttributes = ["width", "height", "format"];
             for (var i=0; i<optionalAttributes.length; i++) {
                 if (optionalAttributes[i] in attr) {
                     node.setAttribute(optionalAttributes[i], attr[optionalAttributes[i]]);
                 }
             }
         }
         return node;
     },

          write_wmc_DimensionList: function(context) {
         var node = this.createElementDefaultNS("DimensionList");
         var required_attributes = {
             name: true,
             units: true,
             unitSymbol: true,
             userValue: true
         };
         for (var dim in context.dimensions) {
             var attributes = {};
             var dimension = context.dimensions[dim];
             for (var name in dimension) {
                 if (typeof dimension[name] == "boolean") {
                     attributes[name] = Number(dimension[name]);
                 } else {
                     attributes[name] = dimension[name];
                 }
             }
             var values = "";
             if (attributes.values) {
                 values = attributes.values.join(",");
                 delete attributes.values;
             }

             node.appendChild(this.createElementDefaultNS(
                 "Dimension", values, attributes
             ));
         }
        return node;
    },

        write_wmc_FormatList: function(context) {
        var node = this.createElementDefaultNS("FormatList");
        for (var i=0, len=context.formats.length; i<len; i++) {
            var format = context.formats[i];
            node.appendChild(this.createElementDefaultNS(
                "Format",
                format.value,
                (format.current && format.current == true) ?
                    {current: "1"} : null
            ));
        }

        return node;
    },

        write_wmc_StyleList: function(layer) {
        var node = this.createElementDefaultNS("StyleList");

        var styles = layer.styles;
        if (styles && OpenLayers.Util.isArray(styles)) {
            var sld;
            for (var i=0, len=styles.length; i<len; i++) {
                var s = styles[i];
                var style = this.createElementDefaultNS(
                    "Style",
                    null,
                    (s.current && s.current == true) ?
                    {current: "1"} : null
                );
                if(s.href) { // [1]
                    sld = this.createElementDefaultNS("SLD");
                     if (s.name) {
                    sld.appendChild(this.createElementDefaultNS("Name", s.name));
                     }
                    if (s.title) {
                        sld.appendChild(this.createElementDefaultNS("Title", s.title));
                    }
                     if (s.legend) {
                         sld.appendChild(this.write_wmc_URLType("LegendURL", s.legend.href, s.legend));
                     }

                     var link = this.write_wmc_OnlineResource(s.href);
                     sld.appendChild(link);
                    style.appendChild(sld);
                } else if(s.body) { // [2]
                    sld = this.createElementDefaultNS("SLD");
                     if (s.name) {
                         sld.appendChild(this.createElementDefaultNS("Name", s.name));
                     }
                     if (s.title) {
                         sld.appendChild(this.createElementDefaultNS("Title", s.title));
                     }
                     if (s.legend) {
                         sld.appendChild(this.write_wmc_URLType("LegendURL", s.legend.href, s.legend));
                     }
                    var doc = OpenLayers.Format.XML.prototype.read.apply(this, [s.body]);
                    var imported = doc.documentElement;
                    if(sld.ownerDocument && sld.ownerDocument.importNode) {
                        imported = sld.ownerDocument.importNode(imported, true);
                    }
                    sld.appendChild(imported);
                    style.appendChild(sld);            
                } else { // [3]
                    style.appendChild(this.createElementDefaultNS("Name", s.name));
                    style.appendChild(this.createElementDefaultNS("Title", s.title));
                    if (s['abstract']) { // abstract is a js keyword
                        style.appendChild(this.createElementDefaultNS(
                            "Abstract", s['abstract']
                        ));
                    }
                     if (s.legend) {
                         style.appendChild(this.write_wmc_URLType("LegendURL", s.legend.href, s.legend));
                }
                 }
                node.appendChild(style);
            }
        }

        return node;
    },

        write_wmc_OnlineResource: function(href) {
        var node = this.createElementDefaultNS("OnlineResource");
        this.setAttributeNS(node, this.namespaces.xlink, "xlink:type", "simple");
        this.setAttributeNS(node, this.namespaces.xlink, "xlink:href", href);
        return node;
    },

          getOnlineResource_href: function(node) {
         var object = {};
         var links = node.getElementsByTagName("OnlineResource");
         if(links.length > 0) {
             this.read_wmc_OnlineResource(object, links[0]);
         }
         return object.href;
     },


    CLASS_NAME: "OpenLayers.Format.WMC.v1" 

});
