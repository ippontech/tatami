/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMTSCapabilities.v1_0_0 = OpenLayers.Class(
    OpenLayers.Format.OWSCommon.v1_1_0, {
        
        version: "1.0.0",

        namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        wmts: "http://www.opengis.net/wmts/1.0",
        xlink: "http://www.w3.org/1999/xlink"
    },    
    
        yx: null,

        defaultPrefix: "wmts",

        initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        this.options = options;
        var yx = OpenLayers.Util.extend(
            {}, OpenLayers.Format.WMTSCapabilities.prototype.yx
        );
        this.yx = OpenLayers.Util.extend(yx, this.yx);
    },

        read: function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var capabilities = {};
        this.readNode(data, capabilities);
        capabilities.version = this.version;
        return capabilities;
    },

        readers: {        
        "wmts": {
            "Capabilities": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Contents": function(node, obj) {
                obj.contents = {};                
                obj.contents.layers = [];
                obj.contents.tileMatrixSets = {};                
                this.readChildNodes(node, obj.contents);
            },
            "Layer": function(node, obj) {
                var layer = {
                    styles: [],
                    formats: [],
                    dimensions: [],
                    tileMatrixSetLinks: []
                };
                this.readChildNodes(node, layer);
                obj.layers.push(layer);
            },
            "Style": function(node, obj) {
                var style = {};
                style.isDefault = (node.getAttribute("isDefault") === "true");
                this.readChildNodes(node, style);
                obj.styles.push(style);
            },
            "Format": function(node, obj) {
                obj.formats.push(this.getChildValue(node)); 
            },
            "TileMatrixSetLink": function(node, obj) {
                var tileMatrixSetLink = {};
                this.readChildNodes(node, tileMatrixSetLink);
                obj.tileMatrixSetLinks.push(tileMatrixSetLink);
            },
            "TileMatrixSet": function(node, obj) {
                if (obj.layers) {
                    var tileMatrixSet = {
                        matrixIds: []
                    };
                    this.readChildNodes(node, tileMatrixSet);
                    obj.tileMatrixSets[tileMatrixSet.identifier] = tileMatrixSet;
                } else {
                    obj.tileMatrixSet = this.getChildValue(node);
                }
            },
            "TileMatrixSetLimits": function(node, obj) {
                obj.tileMatrixSetLimits = [];
                this.readChildNodes(node, obj);
            },
            "TileMatrixLimits": function(node, obj) {
                var tileMatrixLimits = {};
                this.readChildNodes(node, tileMatrixLimits);
                obj.tileMatrixSetLimits.push(tileMatrixLimits);
            },
            "MinTileRow": function(node, obj) {
                obj.minTileRow = parseInt(this.getChildValue(node)); 
            },
            "MaxTileRow": function(node, obj) {
                obj.maxTileRow = parseInt(this.getChildValue(node)); 
            },
            "MinTileCol": function(node, obj) {
                obj.minTileCol = parseInt(this.getChildValue(node)); 
            },
            "MaxTileCol": function(node, obj) {
                obj.maxTileCol = parseInt(this.getChildValue(node)); 
            },
            "TileMatrix": function(node, obj) {
                if (obj.identifier) {
                    var tileMatrix = {
                        supportedCRS: obj.supportedCRS
                    };
                    this.readChildNodes(node, tileMatrix);
                    obj.matrixIds.push(tileMatrix);
                } else {
                    obj.tileMatrix = this.getChildValue(node);
                }
            },
            "ScaleDenominator": function(node, obj) {
                obj.scaleDenominator = parseFloat(this.getChildValue(node)); 
            },
            "TopLeftCorner": function(node, obj) {                
                var topLeftCorner = this.getChildValue(node);
                var coords = topLeftCorner.split(" ");
                var yx;
                if (obj.supportedCRS) {
                    var crs = obj.supportedCRS.replace(
                        /urn:ogc:def:crs:(\w+):.+:(\w+)$/, 
                        "urn:ogc:def:crs:$1::$2"
                    );
                    yx = !!this.yx[crs];
                }
                if (yx) {
                    obj.topLeftCorner = new OpenLayers.LonLat(
                        coords[1], coords[0]
                    );
                } else {
                    obj.topLeftCorner = new OpenLayers.LonLat(
                        coords[0], coords[1]
                    );
                }
            },
            "TileWidth": function(node, obj) {
                obj.tileWidth = parseInt(this.getChildValue(node)); 
            },
            "TileHeight": function(node, obj) {
                obj.tileHeight = parseInt(this.getChildValue(node)); 
            },
            "MatrixWidth": function(node, obj) {
                obj.matrixWidth = parseInt(this.getChildValue(node)); 
            },
            "MatrixHeight": function(node, obj) {
                obj.matrixHeight = parseInt(this.getChildValue(node)); 
            },
            "ResourceURL": function(node, obj) {
                obj.resourceUrl = obj.resourceUrl || {};
                var resourceType = node.getAttribute("resourceType");
                if (!obj.resourceUrls) {
                    obj.resourceUrls = [];
                }
                var resourceUrl = obj.resourceUrl[resourceType] = {
                    format: node.getAttribute("format"),
                    template: node.getAttribute("template"),
                    resourceType: resourceType
                };
                obj.resourceUrls.push(resourceUrl);
            },
            "LegendURL": function(node, obj) {
                obj.legends = obj.legends || [];
                var legend = {
                    format: node.getAttribute("format"),
                    href: node.getAttribute("xlink:href")
                };
                var width = node.getAttribute("width"),
                    height = node.getAttribute("height"),
                    minScaleDenominator = node.getAttribute("minScaleDenominator"),
                    maxScaleDenominator = node.getAttribute("maxScaleDenominator");
                if (width !== null) {
                    legend.width = parseInt(width);
                }
                if (height !== null) {
                    legend.height = parseInt(height);
                }
                if (minScaleDenominator !== null) {
                    legend.minScaleDenominator = parseInt(minScaleDenominator);
                }
                if (maxScaleDenominator !== null) {
                    legend.maxScaleDenominator = parseInt(maxScaleDenominator);
                }
                obj.legends.push(legend);
            },
            "InfoFormat": function(node, obj) {
                obj.infoFormats = obj.infoFormats || [];
                obj.infoFormats.push(this.getChildValue(node));
            },
            /*"Themes": function(node, obj) {
                obj.themes = [];
                this.readChildNodes(node, obj.themes);
            },
            "Theme": function(node, obj) {
                var theme = {};                
                this.readChildNodes(node, theme);
                obj.push(theme);
            },*/
            "WSDL": function(node, obj) {
                obj.wsdl = {};
                obj.wsdl.href = node.getAttribute("xlink:href");
            },
            "ServiceMetadataURL": function(node, obj) {
                obj.serviceMetadataUrl = {};
                obj.serviceMetadataUrl.href = node.getAttribute("xlink:href");
            },
            "Dimension": function(node, obj) {
                var dimension = {values: []};
                this.readChildNodes(node, dimension);
                obj.dimensions.push(dimension);
            },
            "Default": function(node, obj) {
                obj["default"] = this.getChildValue(node);
            },
            "Value": function(node, obj) {
                obj.values.push(this.getChildValue(node));
            }
        },
        "ows": OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]
    },    
    
    CLASS_NAME: "OpenLayers.Format.WMTSCapabilities.v1_0_0" 

});
