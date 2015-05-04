/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.OWSContext.v0_3_1 = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        owc: "http://www.opengis.net/ows-context",
        gml: "http://www.opengis.net/gml",
        kml: "http://www.opengis.net/kml/2.2",
        ogc: "http://www.opengis.net/ogc",
        ows: "http://www.opengis.net/ows",
        sld: "http://www.opengis.net/sld",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

        VERSION: "0.3.1", 

        schemaLocation: "http://www.opengis.net/ows-context http://www.ogcnetwork.net/schemas/owc/0.3.1/owsContext.xsd",

        defaultPrefix: "owc",

        extractAttributes: true,
    
        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

        featureNS: "http://mapserver.gis.umn.edu/mapserver",

        featureType: 'vector',
              
        geometryName: 'geometry',

        nestingLayerLookup: null,

        initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        OpenLayers.Format.GML.v2.prototype.setGeometryTypes.call(this);
    },

        setNestingPath : function(l){
        if(l.layersContext){
            for (var i = 0, len = l.layersContext.length; i < len; i++) {
                var layerContext = l.layersContext[i];
                var nPath = [];
                var nTitle = l.title || "";
                if(l.metadata && l.metadata.nestingPath){
                    nPath = l.metadata.nestingPath.slice();
                }
                if (nTitle != "") {
                    nPath.push(nTitle);
                }
                layerContext.metadata.nestingPath = nPath;
                if(layerContext.layersContext){
                    this.setNestingPath(layerContext);
                }
            }
        }
    },

        decomposeNestingPath: function(nPath){
        var a = [];
        if (OpenLayers.Util.isArray(nPath)) {
            var path = nPath.slice();
            while (path.length > 0) {
                a.push(path.slice());
                path.pop();
            }
            a.reverse();
        }
        return a;
    },

        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var context = {};
        this.readNode(data, context);
        this.setNestingPath({layersContext : context.layersContext});
        var layers = [];
        this.processLayer(layers, context);
        delete context.layersContext;
        context.layersContext = layers;
        return context;
    },

        processLayer: function(layerArray, layer) {
        if (layer.layersContext) {
            for (var i=0, len = layer.layersContext.length; i<len; i++) {
                var l = layer.layersContext[i];
                layerArray.push(l);
                if (l.layersContext) {
                    this.processLayer(layerArray, l);
                }
            }
        }
    },

        write: function(context, options) {
        var name = "OWSContext";
        this.nestingLayerLookup = {}; //start with empty lookup
        options = options || {};
        OpenLayers.Util.applyDefaults(options, context);
        var root = this.writeNode(name, options);
        this.nestingLayerLookup = null; //clear lookup
        this.setAttributeNS(
            root, this.namespaces["xsi"],
            "xsi:schemaLocation", this.schemaLocation
        );
        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    }, 

        readers: {
        "kml": {
            "Document": function(node, obj) {
                obj.features = new OpenLayers.Format.KML(
                    {kmlns: this.namespaces.kml, 
                        extractStyles: true}).read(node);
            }
        },
        "owc": { 
            "OWSContext": function(node, obj) {
                this.readChildNodes(node, obj);
            }, 
            "General": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "ResourceList": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Layer": function(node, obj) {
                var layerContext = {
                    metadata: {},
                    visibility: (node.getAttribute("hidden") != "1"),
                    queryable: (node.getAttribute("queryable") == "1"),
                    opacity: ((node.getAttribute("opacity") != null) ? 
                        parseFloat(node.getAttribute("opacity")) : null),
                    name: node.getAttribute("name"),
                    /* A category layer is a dummy layer meant for creating
                       hierarchies. It is not a physical layer in the 
                       OpenLayers sense. The assumption we make here is that
                       category layers do not have a name attribute */
                    categoryLayer: (node.getAttribute("name") == null),
                    formats: [],
                    styles: []
                };
                if (!obj.layersContext) {
                    obj.layersContext = [];
                }
                obj.layersContext.push(layerContext);
                this.readChildNodes(node, layerContext);
            },
            "InlineGeometry": function(node, obj) {
                obj.features = [];
                var elements = this.getElementsByTagNameNS(node, 
                    this.namespaces.gml, "featureMember");
                var el;
                if (elements.length >= 1) {
                    el = elements[0];
                }
                if (el && el.firstChild) {
                    var featurenode = (el.firstChild.nextSibling) ? 
                        el.firstChild.nextSibling : el.firstChild;
                    this.setNamespace("feature", featurenode.namespaceURI);
                    this.featureType = featurenode.localName || 
                        featurenode.nodeName.split(":").pop();
                    this.readChildNodes(node, obj);
                }
            },
            "Server": function(node, obj) {
                if ((!obj.service && !obj.version) || 
                    (obj.service != 
                        OpenLayers.Format.Context.serviceTypes.WMS)) {
                            obj.service = node.getAttribute("service");
                            obj.version = node.getAttribute("version");
                            this.readChildNodes(node, obj);
                }
            },
            "Name": function(node, obj) {
                obj.name = this.getChildValue(node);
                this.readChildNodes(node, obj);
            },
            "Title": function(node, obj) {
                obj.title = this.getChildValue(node);
                this.readChildNodes(node, obj);
            },
            "StyleList": function(node, obj) {
                this.readChildNodes(node, obj.styles);
            },
            "Style": function(node, obj) {
                var style = {};
                obj.push(style);
                this.readChildNodes(node, style);
            },
            "LegendURL": function(node, obj) {
                var legend = {};
                obj.legend = legend;
                this.readChildNodes(node, legend);
            },
            "OnlineResource": function(node, obj) {
                obj.url = this.getAttributeNS(node, this.namespaces.xlink, 
                    "href");
                this.readChildNodes(node, obj);
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows,
        "gml": OpenLayers.Format.GML.v2.prototype.readers.gml,
        "sld": OpenLayers.Format.SLD.v1_0_0.prototype.readers.sld,
        "feature": OpenLayers.Format.GML.v2.prototype.readers.feature
    },

        writers: {
        "owc": {
            "OWSContext": function(options) {
                var node = this.createElementNSPlus("OWSContext", {
                    attributes: {
                        version: this.VERSION,
                        id: options.id || OpenLayers.Util.createUniqueID("OpenLayers_OWSContext_")
                    } 
                }); 
                this.writeNode("General", options, node);
                this.writeNode("ResourceList", options, node);
                return node; 
            },
            "General": function(options) {
                var node = this.createElementNSPlus("General");
                this.writeNode("ows:BoundingBox", options, node);
                this.writeNode("ows:Title", options.title || 'OpenLayers OWSContext', node);
                return node;
            },
            "ResourceList": function(options) {
                var node = this.createElementNSPlus("ResourceList");
                for (var i=0, len=options.layers.length; i<len; i++) {
                    var layer = options.layers[i];
                    var decomposedPath = this.decomposeNestingPath(layer.metadata.nestingPath);
                    this.writeNode("_Layer", {layer: layer, subPaths: decomposedPath}, node);
                }
                return node;
            },
            "Server": function(options) {
                var node = this.createElementNSPlus("Server", {attributes: {
                    version: options.version,
                    service: options.service }
                });
                this.writeNode("OnlineResource", options, node);
                return node;
            },
            "OnlineResource": function(options) {
                var node = this.createElementNSPlus("OnlineResource", {attributes: {
                    "xlink:href": options.url }
                });
                return node;
            },
            "InlineGeometry": function(layer) {
                var node = this.createElementNSPlus("InlineGeometry"),
                    dataExtent = layer.getDataExtent();
                if (dataExtent !== null) {
                    this.writeNode("gml:boundedBy", dataExtent, node);
                }
                for (var i=0, len=layer.features.length; i<len; i++) {
                    this.writeNode("gml:featureMember", layer.features[i], node);
                }
                return node;
            },
            "StyleList": function(styles) {
                var node = this.createElementNSPlus("StyleList");
                for (var i=0, len=styles.length; i<len; i++) {
                    this.writeNode("Style", styles[i], node);
                }
                return node;
            },
            "Style": function(style) {
                var node = this.createElementNSPlus("Style");
                this.writeNode("Name", style, node);
                this.writeNode("Title", style, node);
                if (style.legend) {
                    this.writeNode("LegendURL", style, node);
                }
                return node;
            },
            "Name": function(obj) {
                var node = this.createElementNSPlus("Name", {
                    value: obj.name });
                return node;
            },
            "Title": function(obj) {
                var node = this.createElementNSPlus("Title", {
                    value: obj.title });
                return node;
            },
            "LegendURL": function(style) {
                var node = this.createElementNSPlus("LegendURL");
                this.writeNode("OnlineResource", style.legend, node);
                return node;
            },
            "_WMS": function(layer) {
                var node = this.createElementNSPlus("Layer", {attributes: {
                    name: layer.params.LAYERS,
                    queryable: layer.queryable ? "1" : "0",
                    hidden: layer.visibility ? "0" : "1",
                    opacity: layer.hasOwnProperty("opacity") ? layer.opacity : null}
                });
                this.writeNode("ows:Title", layer.name, node);
                this.writeNode("ows:OutputFormat", layer.params.FORMAT, node);
                this.writeNode("Server", {service: 
                    OpenLayers.Format.Context.serviceTypes.WMS,
                    version: layer.params.VERSION, url: layer.url}, node);
                if (layer.metadata.styles && layer.metadata.styles.length > 0) {
                    this.writeNode("StyleList", layer.metadata.styles, node);
                }
                return node;
            },
            "_Layer": function(options) {
                var layer, subPaths, node, title;
                layer = options.layer;
                subPaths = options.subPaths;
                node = null;
                title = null;
                if(subPaths.length > 0){
                    var path = subPaths[0].join("/");
                    var index = path.lastIndexOf("/");
                    node = this.nestingLayerLookup[path];
                    title = (index > 0)?path.substring(index + 1, path.length):path;
                    if(!node){
                        node = this.createElementNSPlus("Layer");
                        this.writeNode("ows:Title", title, node);
                        this.nestingLayerLookup[path] = node;
                    }
                    options.subPaths.shift();//remove a path after each call
                    this.writeNode("_Layer", options, node);
                    return node;
                } else {
                    if (layer instanceof OpenLayers.Layer.WMS) {
                        node = this.writeNode("_WMS", layer);
                    } else if (layer instanceof OpenLayers.Layer.Vector) {
                        if (layer.protocol instanceof OpenLayers.Protocol.WFS.v1) {
                            node = this.writeNode("_WFS", layer);
                        } else if (layer.protocol instanceof OpenLayers.Protocol.HTTP) {
                            if (layer.protocol.format instanceof OpenLayers.Format.GML) {
                                layer.protocol.format.version = "2.1.2";
                                node = this.writeNode("_GML", layer);
                            } else if (layer.protocol.format instanceof OpenLayers.Format.KML) {
                                layer.protocol.format.version = "2.2";
                                node = this.writeNode("_KML", layer);
                            }
                        } else {
                            this.setNamespace("feature", this.featureNS);
                            node = this.writeNode("_InlineGeometry", layer);
                        }
                    }
                    if (layer.options.maxScale) {
                        this.writeNode("sld:MinScaleDenominator", 
                            layer.options.maxScale, node);
                    }
                    if (layer.options.minScale) {
                        this.writeNode("sld:MaxScaleDenominator", 
                            layer.options.minScale, node);
                    }
                    this.nestingLayerLookup[layer.name] = node;
                    return node;
                }
            },
            "_WFS": function(layer) {
                var node = this.createElementNSPlus("Layer", {attributes: {
                    name: layer.protocol.featurePrefix + ":" + layer.protocol.featureType,
                    hidden: layer.visibility ? "0" : "1" }
                });
                this.writeNode("ows:Title", layer.name, node);
                this.writeNode("Server", {service: 
                    OpenLayers.Format.Context.serviceTypes.WFS, 
                    version: layer.protocol.version, 
                    url: layer.protocol.url}, node);
                return node;
            },
            "_InlineGeometry": function(layer) {
                var node = this.createElementNSPlus("Layer", {attributes: {
                    name: this.featureType,
                    hidden: layer.visibility ? "0" : "1" }
                });
                this.writeNode("ows:Title", layer.name, node);
                this.writeNode("InlineGeometry", layer, node);
                return node;
            },
            "_GML": function(layer) {
                var node = this.createElementNSPlus("Layer");
                this.writeNode("ows:Title", layer.name, node);
                this.writeNode("Server", {service: 
                    OpenLayers.Format.Context.serviceTypes.GML, 
                    url: layer.protocol.url, version: 
                    layer.protocol.format.version}, node);
                return node;
            },
            "_KML": function(layer) {
                var node = this.createElementNSPlus("Layer");
                this.writeNode("ows:Title", layer.name, node);
                this.writeNode("Server", {service: 
                    OpenLayers.Format.Context.serviceTypes.KML,
                    version: layer.protocol.format.version, url: 
                    layer.protocol.url}, node);
                return node;
            }
        },
        "gml": OpenLayers.Util.applyDefaults({
            "boundedBy": function(bounds) {
                var node = this.createElementNSPlus("gml:boundedBy");
                this.writeNode("gml:Box", bounds, node);
                return node;
            }
        }, OpenLayers.Format.GML.v2.prototype.writers.gml),
        "ows": OpenLayers.Format.OWSCommon.v1_0_0.prototype.writers.ows,
        "sld": OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld,
        "feature": OpenLayers.Format.GML.v2.prototype.writers.feature
    },
    
    CLASS_NAME: "OpenLayers.Format.OWSContext.v0_3_1" 

});
