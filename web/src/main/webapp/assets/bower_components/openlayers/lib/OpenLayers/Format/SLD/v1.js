/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.SLD.v1 = OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0, {
    
        namespaces: {
        sld: "http://www.opengis.net/sld",
        ogc: "http://www.opengis.net/ogc",
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        xmlns: "http://www.w3.org/2000/xmlns/"
    },
    
        defaultPrefix: "sld",

        schemaLocation: null,
    
        multipleSymbolizers: false,

        featureTypeCounter: null,

        defaultSymbolizer: {
        fillColor: "#808080",
        fillOpacity: 1,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDashstyle: "solid",
        pointRadius: 3,
        graphicName: "square"
    },
    
        
        read: function(data, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var sld = {
            namedLayers: options.namedLayersAsArray === true ? [] : {}
        };
        this.readChildNodes(data, sld);
        return sld;
    },
    
        readers: OpenLayers.Util.applyDefaults({
        "sld": {
            "StyledLayerDescriptor": function(node, sld) {
                sld.version = node.getAttribute("version");
                this.readChildNodes(node, sld);
            },
            "Name": function(node, obj) {
                obj.name = this.getChildValue(node);
            },
            "Title": function(node, obj) {
                obj.title = this.getChildValue(node);
            },
            "Abstract": function(node, obj) {
                obj.description = this.getChildValue(node);
            },
            "NamedLayer": function(node, sld) {
                var layer = {
                    userStyles: [],
                    namedStyles: []
                };
                this.readChildNodes(node, layer);
                for(var i=0, len=layer.userStyles.length; i<len; ++i) {
                    layer.userStyles[i].layerName = layer.name;
                }
                if(OpenLayers.Util.isArray(sld.namedLayers)) {
                    sld.namedLayers.push(layer);                
                } else {
                    sld.namedLayers[layer.name] = layer;
                }
            },
            "NamedStyle": function(node, layer) {
                layer.namedStyles.push(
                    this.getChildValue(node.firstChild)
                );
            },
            "UserStyle": function(node, layer) {
                var obj = {defaultsPerSymbolizer: true, rules: []};
                this.featureTypeCounter = -1;
                this.readChildNodes(node, obj);
                var style;
                if (this.multipleSymbolizers) {
                    delete obj.defaultsPerSymbolizer;
                    style = new OpenLayers.Style2(obj);
                } else {
                    style = new OpenLayers.Style(this.defaultSymbolizer, obj);
                }
                layer.userStyles.push(style);
            },
            "IsDefault": function(node, style) {
                if(this.getChildValue(node) == "1") {
                    style.isDefault = true;
                }
            },
            "FeatureTypeStyle": function(node, style) {
                ++this.featureTypeCounter;
                var obj = {
                    rules: this.multipleSymbolizers ? style.rules : []
                };
                this.readChildNodes(node, obj);
                if (!this.multipleSymbolizers) {
                    style.rules = obj.rules;
                }
            },
            "Rule": function(node, obj) {
                var config;
                if (this.multipleSymbolizers) {
                    config = {symbolizers: []};
                }
                var rule = new OpenLayers.Rule(config);
                this.readChildNodes(node, rule);
                obj.rules.push(rule);
            },
            "ElseFilter": function(node, rule) {
                rule.elseFilter = true;
            },
            "MinScaleDenominator": function(node, rule) {
                rule.minScaleDenominator = parseFloat(this.getChildValue(node));
            },
            "MaxScaleDenominator": function(node, rule) {
                rule.maxScaleDenominator = parseFloat(this.getChildValue(node));
            },
            "TextSymbolizer": function(node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Text(config)
                    );
                } else {
                    rule.symbolizer["Text"] = OpenLayers.Util.applyDefaults(
                        config, rule.symbolizer["Text"]
                    );
                }
            },
            "LabelPlacement": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "PointPlacement": function(node, symbolizer) {
                var config = {};
                this.readChildNodes(node, config);
                config.labelRotation = config.rotation;
                delete config.rotation;
                var labelAlign,
                    x = symbolizer.labelAnchorPointX,
                    y = symbolizer.labelAnchorPointY;
                if (x <= 1/3) {
                    labelAlign = 'l';
                } else if (x > 1/3 && x < 2/3) {
                    labelAlign = 'c';
                } else if (x >= 2/3) {
                    labelAlign = 'r';
                }
                if (y <= 1/3) {
                    labelAlign += 'b';
                } else if (y > 1/3 && y < 2/3) {
                    labelAlign += 'm';
                } else if (y >= 2/3) {
                    labelAlign += 't';
                }
                config.labelAlign = labelAlign;
                OpenLayers.Util.applyDefaults(symbolizer, config);
            },
            "AnchorPoint": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "AnchorPointX": function(node, symbolizer) {
                var labelAnchorPointX = this.readers.ogc._expression.call(this, node);
                if(labelAnchorPointX) {
                    symbolizer.labelAnchorPointX = labelAnchorPointX;
                }
            },
            "AnchorPointY": function(node, symbolizer) {
                var labelAnchorPointY = this.readers.ogc._expression.call(this, node);
                if(labelAnchorPointY) {
                    symbolizer.labelAnchorPointY = labelAnchorPointY;
                }
            },
            "Displacement": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "DisplacementX": function(node, symbolizer) {
                var labelXOffset = this.readers.ogc._expression.call(this, node);
                if(labelXOffset) {
                    symbolizer.labelXOffset = labelXOffset;
                }
            },
            "DisplacementY": function(node, symbolizer) {
                var labelYOffset = this.readers.ogc._expression.call(this, node);
                if(labelYOffset) {
                    symbolizer.labelYOffset = labelYOffset;
                }
            },
            "LinePlacement": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "PerpendicularOffset": function(node, symbolizer) {
                var labelPerpendicularOffset = this.readers.ogc._expression.call(this, node);
                if(labelPerpendicularOffset) {
                    symbolizer.labelPerpendicularOffset = labelPerpendicularOffset;
                }
            },
            "Label": function(node, symbolizer) {
                var value = this.readers.ogc._expression.call(this, node);
                if (value) {
                    symbolizer.label = OpenLayers.String.trim(value);
                }
            },
            "Font": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "Halo": function(node, symbolizer) {
                var obj = {};
                this.readChildNodes(node, obj);
                symbolizer.haloRadius = obj.haloRadius;
                symbolizer.haloColor = obj.fillColor;
                symbolizer.haloOpacity = obj.fillOpacity;
            },
            "Radius": function(node, symbolizer) {
                var radius = this.readers.ogc._expression.call(this, node);
                if(radius != null) {
                    symbolizer.haloRadius = radius;
                }
            },
            "RasterSymbolizer": function(node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Raster(config)
                    );
                } else {
                    rule.symbolizer["Raster"] = OpenLayers.Util.applyDefaults(
                        config, rule.symbolizer["Raster"]
                    );
                }
            },
            "Geometry": function(node, obj) {
                obj.geometry = {};
                this.readChildNodes(node, obj.geometry);
            },
            "ColorMap": function(node, symbolizer) {
                symbolizer.colorMap = [];
                this.readChildNodes(node, symbolizer.colorMap);
            },
            "ColorMapEntry": function(node, colorMap) {
                var q = node.getAttribute("quantity");
                var o = node.getAttribute("opacity");
                colorMap.push({
                    color: node.getAttribute("color"),
                    quantity: q !== null ? parseFloat(q) : undefined,
                    label: node.getAttribute("label") || undefined,
                    opacity: o !== null ? parseFloat(o) : undefined
                });
            },
            "LineSymbolizer": function(node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Line(config)
                    );
                } else {
                    rule.symbolizer["Line"] = OpenLayers.Util.applyDefaults(
                        config, rule.symbolizer["Line"]
                    );
                }
            },
            "PolygonSymbolizer": function(node, rule) {
                var config = {
                    fill: false,
                    stroke: false
                };
                if (!this.multipleSymbolizers) {
                    config = rule.symbolizer["Polygon"] || config;
                }
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Polygon(config)
                    );
                } else {
                    rule.symbolizer["Polygon"] = config;
                }
            },
            "PointSymbolizer": function(node, rule) {
                var config = {
                    fill: false,
                    stroke: false,
                    graphic: false
                };
                if (!this.multipleSymbolizers) {
                    config = rule.symbolizer["Point"] || config;
                }
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Point(config)
                    );
                } else {
                    rule.symbolizer["Point"] = config;
                }
            },
            "Stroke": function(node, symbolizer) {
                symbolizer.stroke = true;
                this.readChildNodes(node, symbolizer);
            },
            "Fill": function(node, symbolizer) {
                symbolizer.fill = true;
                this.readChildNodes(node, symbolizer);
            },
            "CssParameter": function(node, symbolizer) {
                var cssProperty = node.getAttribute("name");
                var symProperty = this.cssMap[cssProperty];
                if (symbolizer.label) {
                    if (cssProperty === 'fill') {
                        symProperty = "fontColor";
                    } else if (cssProperty === 'fill-opacity') {
                        symProperty = "fontOpacity";
                    }
                }
                if(symProperty) {
                    var value = this.readers.ogc._expression.call(this, node);
                    if(value) {
                        symbolizer[symProperty] = value;
                    }
                }
            },
            "Graphic": function(node, symbolizer) {
                symbolizer.graphic = true;
                var graphic = {};
                this.readChildNodes(node, graphic);
                var properties = [
                    "stroke", "strokeColor", "strokeWidth", "strokeOpacity",
                    "strokeLinecap", "fill", "fillColor", "fillOpacity",
                    "graphicName", "rotation", "graphicFormat"
                ];
                var prop, value;
                for(var i=0, len=properties.length; i<len; ++i) {
                    prop = properties[i];
                    value = graphic[prop];
                    if(value != undefined) {
                        symbolizer[prop] = value;
                    }
                }
                if(graphic.opacity != undefined) {
                    symbolizer.graphicOpacity = graphic.opacity;
                }
                if(graphic.size != undefined) {
                    var pointRadius = graphic.size / 2;
                    if (isNaN(pointRadius)) {
                        symbolizer.graphicWidth = graphic.size;
                    } else {
                        symbolizer.pointRadius = graphic.size / 2;
                    }
                }
                if(graphic.href != undefined) {
                    symbolizer.externalGraphic = graphic.href;
                }
                if(graphic.rotation != undefined) {
                    symbolizer.rotation = graphic.rotation;
                }
            },
            "ExternalGraphic": function(node, graphic) {
                this.readChildNodes(node, graphic);
            },
            "Mark": function(node, graphic) {
                this.readChildNodes(node, graphic);
            },
            "WellKnownName": function(node, graphic) {
                graphic.graphicName = this.getChildValue(node);
            },
            "Opacity": function(node, obj) {
                var opacity = this.readers.ogc._expression.call(this, node);
                if(opacity) {
                    obj.opacity = opacity;
                }
            },
            "Size": function(node, obj) {
                var size = this.readers.ogc._expression.call(this, node);
                if(size) {
                    obj.size = size;
                }
            },
            "Rotation": function(node, obj) {
                var rotation = this.readers.ogc._expression.call(this, node);
                if(rotation) {
                    obj.rotation = rotation;
                }
            },
            "OnlineResource": function(node, obj) {
                obj.href = this.getAttributeNS(
                    node, this.namespaces.xlink, "href"
                );
            },
            "Format": function(node, graphic) {
                graphic.graphicFormat = this.getChildValue(node);
            }
        }
    }, OpenLayers.Format.Filter.v1_0_0.prototype.readers),
    
        cssMap: {
        "stroke": "strokeColor",
        "stroke-opacity": "strokeOpacity",
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-dasharray": "strokeDashstyle",
        "fill": "fillColor",
        "fill-opacity": "fillOpacity",
        "font-family": "fontFamily",
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        "font-style": "fontStyle"
    },
    
        getCssProperty: function(sym) {
        var css = null;
        for(var prop in this.cssMap) {
            if(this.cssMap[prop] == sym) {
                css = prop;
                break;
            }
        }
        return css;
    },
    
        getGraphicFormat: function(href) {
        var format, regex;
        for(var key in this.graphicFormats) {
            if(this.graphicFormats[key].test(href)) {
                format = key;
                break;
            }
        }
        return format || this.defaultGraphicFormat;
    },
    
        defaultGraphicFormat: "image/png",
    
        graphicFormats: {
        "image/jpeg": /\.jpe?g$/i,
        "image/gif": /\.gif$/i,
        "image/png": /\.png$/i
    },

        write: function(sld) {
        return this.writers.sld.StyledLayerDescriptor.apply(this, [sld]);
    },
    
        writers: OpenLayers.Util.applyDefaults({
        "sld": {
            "_OGCExpression": function(nodeName, value) {
                var node = this.createElementNSPlus(nodeName);
                var tokens = typeof value == "string" ?
                    value.split("${") :
                    [value];
                node.appendChild(this.createTextNode(tokens[0]));
                var item, last;
                for(var i=1, len=tokens.length; i<len; i++) {
                    item = tokens[i];
                    last = item.indexOf("}"); 
                    if(last > 0) {
                        this.writeNode(
                            "ogc:PropertyName",
                            {property: item.substring(0, last)},
                            node
                        );
                        node.appendChild(
                            this.createTextNode(item.substring(++last))
                        );
                    } else {
                        node.appendChild(
                            this.createTextNode("${" + item)
                        );
                    }
                }
                return node;
            },
            "StyledLayerDescriptor": function(sld) {
                var root = this.createElementNSPlus(
                    "sld:StyledLayerDescriptor",
                    {attributes: {
                        "version": this.VERSION,
                        "xsi:schemaLocation": this.schemaLocation
                    }}
                );
                this.setAttributeNS(
                    root, this.namespaces.xmlns,
                    "xmlns:ogc", this.namespaces.ogc
                );
                this.setAttributeNS(
                    root, this.namespaces.xmlns,
                    "xmlns:gml", this.namespaces.gml
                );
                if(sld.name) {
                    this.writeNode("Name", sld.name, root);
                }
                if(sld.title) {
                    this.writeNode("Title", sld.title, root);
                }
                if(sld.description) {
                    this.writeNode("Abstract", sld.description, root);
                }
                if(OpenLayers.Util.isArray(sld.namedLayers)) {
                    for(var i=0, len=sld.namedLayers.length; i<len; ++i) {
                        this.writeNode("NamedLayer", sld.namedLayers[i], root);
                    }
                } else {
                    for(var name in sld.namedLayers) {
                        this.writeNode("NamedLayer", sld.namedLayers[name], root);
                    }
                }
                return root;
            },
            "Name": function(name) {
                return this.createElementNSPlus("sld:Name", {value: name});
            },
            "Title": function(title) {
                return this.createElementNSPlus("sld:Title", {value: title});
            },
            "Abstract": function(description) {
                return this.createElementNSPlus(
                    "sld:Abstract", {value: description}
                );
            },
            "NamedLayer": function(layer) {
                var node = this.createElementNSPlus("sld:NamedLayer");
                this.writeNode("Name", layer.name, node);
                if(layer.namedStyles) {
                    for(var i=0, len=layer.namedStyles.length; i<len; ++i) {
                        this.writeNode(
                            "NamedStyle", layer.namedStyles[i], node
                        );
                    }
                }
                if(layer.userStyles) {
                    for(var i=0, len=layer.userStyles.length; i<len; ++i) {
                        this.writeNode(
                            "UserStyle", layer.userStyles[i], node
                        );
                    }
                }
                
                return node;
            },
            "NamedStyle": function(name) {
                var node = this.createElementNSPlus("sld:NamedStyle");
                this.writeNode("Name", name, node);
                return node;
            },
            "UserStyle": function(style) {
                var node = this.createElementNSPlus("sld:UserStyle");
                if(style.name) {
                    this.writeNode("Name", style.name, node);
                }
                if(style.title) {
                    this.writeNode("Title", style.title, node);
                }
                if(style.description) {
                    this.writeNode("Abstract", style.description, node);
                }
                if(style.isDefault) {
                    this.writeNode("IsDefault", style.isDefault, node);
                }
                if (this.multipleSymbolizers && style.rules) {
                    var rulesByZ = {
                        0: []
                    };
                    var zValues = [0];
                    var rule, ruleMap, symbolizer, zIndex, clone;
                    for (var i=0, ii=style.rules.length; i<ii; ++i) {
                        rule = style.rules[i];
                        if (rule.symbolizers) {
                            ruleMap = {};
                            for (var j=0, jj=rule.symbolizers.length; j<jj; ++j) {
                                symbolizer = rule.symbolizers[j];
                                zIndex = symbolizer.zIndex;
                                if (!(zIndex in ruleMap)) {
                                    clone = rule.clone();
                                    clone.symbolizers = [];
                                    ruleMap[zIndex] = clone;
                                }
                                ruleMap[zIndex].symbolizers.push(symbolizer.clone());
                            }
                            for (zIndex in ruleMap) {
                                if (!(zIndex in rulesByZ)) {
                                    zValues.push(zIndex);
                                    rulesByZ[zIndex] = [];
                                }
                                rulesByZ[zIndex].push(ruleMap[zIndex]);
                            }
                        } else {
                            rulesByZ[0].push(rule.clone());
                        }
                    }
                    zValues.sort();
                    var rules;
                    for (var i=0, ii=zValues.length; i<ii; ++i) {
                        rules = rulesByZ[zValues[i]];
                        if (rules.length > 0) {
                            clone = style.clone();
                            clone.rules = rulesByZ[zValues[i]];
                            this.writeNode("FeatureTypeStyle", clone, node);
                        }
                    }                    
                } else {
                    this.writeNode("FeatureTypeStyle", style, node);
                }
                
                return node;
            },
            "IsDefault": function(bool) {
                return this.createElementNSPlus(
                    "sld:IsDefault", {value: (bool) ? "1" : "0"}
                );
            },
            "FeatureTypeStyle": function(style) {
                var node = this.createElementNSPlus("sld:FeatureTypeStyle");
                for(var i=0, len=style.rules.length; i<len; ++i) {
                    this.writeNode("Rule", style.rules[i], node);
                }
                
                return node;
            },
            "Rule": function(rule) {
                var node = this.createElementNSPlus("sld:Rule");
                if(rule.name) {
                    this.writeNode("Name", rule.name, node);
                }
                if(rule.title) {
                    this.writeNode("Title", rule.title, node);
                }
                if(rule.description) {
                    this.writeNode("Abstract", rule.description, node);
                }
                if(rule.elseFilter) {
                    this.writeNode("ElseFilter", null, node);
                } else if(rule.filter) {
                    this.writeNode("ogc:Filter", rule.filter, node);
                }
                if(rule.minScaleDenominator != undefined) {
                    this.writeNode(
                        "MinScaleDenominator", rule.minScaleDenominator, node
                    );
                }
                if(rule.maxScaleDenominator != undefined) {
                    this.writeNode(
                        "MaxScaleDenominator", rule.maxScaleDenominator, node
                    );
                }
                
                var type, symbolizer;
                if (this.multipleSymbolizers && rule.symbolizers) {
                    var symbolizer;
                    for (var i=0, ii=rule.symbolizers.length; i<ii; ++i) {
                        symbolizer = rule.symbolizers[i];
                        type = symbolizer.CLASS_NAME.split(".").pop();
                        this.writeNode(
                            type + "Symbolizer", symbolizer, node
                        );
                    }
                } else {
                    var types = OpenLayers.Style.SYMBOLIZER_PREFIXES;
                    for(var i=0, len=types.length; i<len; ++i) {
                        type = types[i];
                        symbolizer = rule.symbolizer[type];
                        if(symbolizer) {
                            this.writeNode(
                                type + "Symbolizer", symbolizer, node
                            );
                        }
                    }
                }
                return node;

            },
            "ElseFilter": function() {
                return this.createElementNSPlus("sld:ElseFilter");
            },
            "MinScaleDenominator": function(scale) {
                return this.createElementNSPlus(
                    "sld:MinScaleDenominator", {value: scale}
                );
            },
            "MaxScaleDenominator": function(scale) {
                return this.createElementNSPlus(
                    "sld:MaxScaleDenominator", {value: scale}
                );
            },
            "LineSymbolizer": function(symbolizer) {
                var node = this.createElementNSPlus("sld:LineSymbolizer");
                if (symbolizer.geometry) {
                    this.writeNode("Geometry", symbolizer.geometry, node);
                }
                this.writeNode("Stroke", symbolizer, node);
                return node;
            },
            "Stroke": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Stroke");
                if(symbolizer.strokeColor != undefined) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "strokeColor"},
                        node
                    );
                }
                if(symbolizer.strokeOpacity != undefined) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "strokeOpacity"},
                        node
                    );
                }
                if(symbolizer.strokeWidth != undefined) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "strokeWidth"},
                        node
                    );
                }
                if(symbolizer.strokeDashstyle != undefined && symbolizer.strokeDashstyle !== "solid") {
                    this.writeNode(
                        "CssParameter", 
                        {symbolizer: symbolizer, key: "strokeDashstyle"},
                        node
                    );
                }
                if(symbolizer.strokeLinecap != undefined) {
                    this.writeNode(
                        "CssParameter", 
                        {symbolizer: symbolizer, key: "strokeLinecap"},
                        node
                    );
                }
                return node;
            },
            "CssParameter": function(obj) {
                return this.createElementNSPlus("sld:CssParameter", {
                    attributes: {name: this.getCssProperty(obj.key)},
                    value: obj.symbolizer[obj.key]
                });
            },
            "TextSymbolizer": function(symbolizer) {
                var node = this.createElementNSPlus("sld:TextSymbolizer");
                if (symbolizer.geometry) {
                    this.writeNode("Geometry", symbolizer.geometry, node);
                }
                if(symbolizer.label != null) {
                    this.writeNode("Label", symbolizer.label, node);
                }
                if(symbolizer.fontFamily != null ||
                    symbolizer.fontSize != null ||
                    symbolizer.fontWeight != null ||
                    symbolizer.fontStyle != null) {
                        this.writeNode("Font", symbolizer, node);
                }
                if (symbolizer.labelAnchorPointX != null ||
                    symbolizer.labelAnchorPointY != null || 
                    symbolizer.labelAlign != null ||
                    symbolizer.labelXOffset != null ||
                    symbolizer.labelYOffset != null ||
                    symbolizer.labelRotation != null ||
                    symbolizer.labelPerpendicularOffset != null) {
                        this.writeNode("LabelPlacement", symbolizer, node);
                }
                if(symbolizer.haloRadius != null ||
                    symbolizer.haloColor != null ||
                    symbolizer.haloOpacity != null) {
                        this.writeNode("Halo", symbolizer, node);
                }
                if(symbolizer.fontColor != null ||
                   symbolizer.fontOpacity != null) {
                    this.writeNode("Fill", {
                        fillColor: symbolizer.fontColor,
                        fillOpacity: symbolizer.fontOpacity
                    }, node);
                }
                return node;
            },
            "LabelPlacement": function(symbolizer) {
                var node = this.createElementNSPlus("sld:LabelPlacement");
                if ((symbolizer.labelAnchorPointX != null ||
                    symbolizer.labelAnchorPointY != null ||
                    symbolizer.labelAlign != null ||
                    symbolizer.labelXOffset != null ||
                    symbolizer.labelYOffset != null ||
                    symbolizer.labelRotation != null) && 
                    symbolizer.labelPerpendicularOffset == null) {
                        this.writeNode("PointPlacement", symbolizer, node);
                }
                if (symbolizer.labelPerpendicularOffset != null) {
                    this.writeNode("LinePlacement", symbolizer, node);
                }
                return node;
            },
            "LinePlacement": function(symbolizer) {
                var node = this.createElementNSPlus("sld:LinePlacement");
                this.writeNode("PerpendicularOffset", symbolizer.labelPerpendicularOffset, node);
                return node;
            },
            "PerpendicularOffset": function(value) {
                return this.createElementNSPlus("sld:PerpendicularOffset", {
                    value: value
                });
            },
            "PointPlacement": function(symbolizer) {
                var node = this.createElementNSPlus("sld:PointPlacement");
                if (symbolizer.labelAnchorPointX != null ||
                    symbolizer.labelAnchorPointY != null ||
                    symbolizer.labelAlign != null) {
                        this.writeNode("AnchorPoint", symbolizer, node);
                }
                if (symbolizer.labelXOffset != null ||
                    symbolizer.labelYOffset != null) {
                        this.writeNode("Displacement", symbolizer, node);
                }
                if (symbolizer.labelRotation != null) {
                    this.writeNode("Rotation", symbolizer.labelRotation, node);
                }
                return node;
            },
            "AnchorPoint": function(symbolizer) {
                var node = this.createElementNSPlus("sld:AnchorPoint");
                var x = symbolizer.labelAnchorPointX,
                    y = symbolizer.labelAnchorPointY;
                if (x != null) {
                    this.writeNode("AnchorPointX", x, node);
                }
                if (y != null) {
                    this.writeNode("AnchorPointY", y, node);
                }
                if (x == null && y == null) {
                    var xAlign = symbolizer.labelAlign.substr(0, 1),
                        yAlign = symbolizer.labelAlign.substr(1, 1);
                    if (xAlign === "l") {
                        x = 0;
                    } else if (xAlign === "c") {
                        x = 0.5;
                    } else if (xAlign === "r") {
                        x = 1;
                    }
                    if (yAlign === "b") {
                        y = 0;
                    } else if (yAlign === "m") {
                        y = 0.5;
                    } else if (yAlign === "t") {
                        y = 1;
                    }
                    this.writeNode("AnchorPointX", x, node);
                    this.writeNode("AnchorPointY", y, node);
                }
                return node;
            },
            "AnchorPointX": function(value) {
                return this.createElementNSPlus("sld:AnchorPointX", {
                    value: value
                }); 
            },
            "AnchorPointY": function(value) {
                return this.createElementNSPlus("sld:AnchorPointY", {
                    value: value
                });
            },
            "Displacement": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Displacement");
                if (symbolizer.labelXOffset != null) {
                    this.writeNode("DisplacementX", symbolizer.labelXOffset, node);
                }
                if (symbolizer.labelYOffset != null) {
                    this.writeNode("DisplacementY", symbolizer.labelYOffset, node);
                }
                return node;
            },
            "DisplacementX": function(value) {
                return this.createElementNSPlus("sld:DisplacementX", {
                    value: value
                });
            },
            "DisplacementY": function(value) {
                return this.createElementNSPlus("sld:DisplacementY", {
                    value: value
                });
            },
            "Font": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Font");
                if(symbolizer.fontFamily) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "fontFamily"},
                        node
                    );
                }
                if(symbolizer.fontSize) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "fontSize"},
                        node
                    );
                }
                if(symbolizer.fontWeight) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "fontWeight"},
                        node
                    );
                }
                if(symbolizer.fontStyle) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "fontStyle"},
                        node
                    );
                }
                return node;
            },
            "Label": function(label) {
                return this.writers.sld._OGCExpression.call(
                    this, "sld:Label", label
                );
            },
            "Halo": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Halo");
                if(symbolizer.haloRadius) {
                    this.writeNode("Radius", symbolizer.haloRadius, node);
                }
                if(symbolizer.haloColor || symbolizer.haloOpacity) {
                    this.writeNode("Fill", {
                        fillColor: symbolizer.haloColor,
                        fillOpacity: symbolizer.haloOpacity
                    }, node);
                }
                return node;
            },
            "Radius": function(value) {
                return this.createElementNSPlus("sld:Radius", {
                    value: value
                });
            },
            "RasterSymbolizer": function(symbolizer) {
                var node = this.createElementNSPlus("sld:RasterSymbolizer");
                if (symbolizer.geometry) {
                    this.writeNode("Geometry", symbolizer.geometry, node);
                }
                if (symbolizer.opacity) {
                    this.writeNode("Opacity", symbolizer.opacity, node);
                }
                if (symbolizer.colorMap) {
                    this.writeNode("ColorMap", symbolizer.colorMap, node);
                }
                return node;
            },
            "Geometry": function(geometry) {
                var node = this.createElementNSPlus("sld:Geometry");
                if (geometry.property) {
                    this.writeNode("ogc:PropertyName", geometry, node);
                }
                return node;
            },
            "ColorMap": function(colorMap) {
                var node = this.createElementNSPlus("sld:ColorMap");
                for (var i=0, len=colorMap.length; i<len; ++i) {
                    this.writeNode("ColorMapEntry", colorMap[i], node);
                }
                return node;
            },
            "ColorMapEntry": function(colorMapEntry) {
                var node = this.createElementNSPlus("sld:ColorMapEntry");
                var a = colorMapEntry;
                node.setAttribute("color", a.color);
                a.opacity !== undefined && node.setAttribute("opacity",
                    parseFloat(a.opacity));
                a.quantity !== undefined && node.setAttribute("quantity",
                    parseFloat(a.quantity));
                a.label !== undefined && node.setAttribute("label", a.label);
                return node;
            },
            "PolygonSymbolizer": function(symbolizer) {
                var node = this.createElementNSPlus("sld:PolygonSymbolizer");
                if (symbolizer.geometry) {
                    this.writeNode("Geometry", symbolizer.geometry, node);
                }
                if(symbolizer.fill !== false) {
                    this.writeNode("Fill", symbolizer, node);
                }
                if(symbolizer.stroke !== false) {
                    this.writeNode("Stroke", symbolizer, node);
                }
                return node;
            },
            "Fill": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Fill");
                if(symbolizer.fillColor) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "fillColor"},
                        node
                    );
                }
                if(symbolizer.fillOpacity != null) {
                    this.writeNode(
                        "CssParameter",
                        {symbolizer: symbolizer, key: "fillOpacity"},
                        node
                    );
                }
                return node;
            },
            "PointSymbolizer": function(symbolizer) {
                var node = this.createElementNSPlus("sld:PointSymbolizer");
                if (symbolizer.geometry) {
                    this.writeNode("Geometry", symbolizer.geometry, node);
                }
                this.writeNode("Graphic", symbolizer, node);
                return node;
            },
            "Graphic": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Graphic");
                if(symbolizer.externalGraphic != undefined) {
                    this.writeNode("ExternalGraphic", symbolizer, node);
                } else {
                    this.writeNode("Mark", symbolizer, node);
                }
                
                if(symbolizer.graphicOpacity != undefined) {
                    this.writeNode("Opacity", symbolizer.graphicOpacity, node);
                }
                if(symbolizer.pointRadius != undefined) {
                    this.writeNode("Size", symbolizer.pointRadius * 2, node);
                } else if (symbolizer.graphicWidth != undefined) {
                    this.writeNode("Size", symbolizer.graphicWidth, node);
                }
                if(symbolizer.rotation != undefined) {
                    this.writeNode("Rotation", symbolizer.rotation, node);
                }
                return node;
            },
            "ExternalGraphic": function(symbolizer) {
                var node = this.createElementNSPlus("sld:ExternalGraphic");
                this.writeNode(
                    "OnlineResource", symbolizer.externalGraphic, node
                );
                var format = symbolizer.graphicFormat ||
                             this.getGraphicFormat(symbolizer.externalGraphic);
                this.writeNode("Format", format, node);
                return node;
            },
            "Mark": function(symbolizer) {
                var node = this.createElementNSPlus("sld:Mark");
                if(symbolizer.graphicName) {
                    this.writeNode("WellKnownName", symbolizer.graphicName, node);
                }
                if (symbolizer.fill !== false) {
                    this.writeNode("Fill", symbolizer, node);
                }
                if (symbolizer.stroke !== false) {
                    this.writeNode("Stroke", symbolizer, node);
                }
                return node;
            },
            "WellKnownName": function(name) {
                return this.createElementNSPlus("sld:WellKnownName", {
                    value: name
                });
            },
            "Opacity": function(value) {
                return this.createElementNSPlus("sld:Opacity", {
                    value: value
                });
            },
            "Size": function(value) {
                return this.writers.sld._OGCExpression.call(
                    this, "sld:Size", value
                );
            },
            "Rotation": function(value) {
                return this.createElementNSPlus("sld:Rotation", {
                    value: value
                });
            },
            "OnlineResource": function(href) {
                return this.createElementNSPlus("sld:OnlineResource", {
                    attributes: {
                        "xlink:type": "simple",
                        "xlink:href": href
                    }
                });
            },
            "Format": function(format) {
                return this.createElementNSPlus("sld:Format", {
                    value: format
                });
            }
        }
    }, OpenLayers.Format.Filter.v1_0_0.prototype.writers),
    
    CLASS_NAME: "OpenLayers.Format.SLD.v1" 

});
