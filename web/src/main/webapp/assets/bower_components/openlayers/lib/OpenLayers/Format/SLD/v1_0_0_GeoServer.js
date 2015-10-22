/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.SLD.v1_0_0_GeoServer = OpenLayers.Class(
    OpenLayers.Format.SLD.v1_0_0, {

        version: "1.0.0",

        profile: "GeoServer",

   
        readers: OpenLayers.Util.applyDefaults({
        "sld": OpenLayers.Util.applyDefaults({
            "Priority": function(node, obj) {
                var value = this.readers.ogc._expression.call(this, node);
                if (value) {
                    obj.priority = OpenLayers.String.trim(value);
                }
            },
            "VendorOption": function(node, obj) {
                if (!obj.vendorOptions) {
                    obj.vendorOptions = {};
                }
                obj.vendorOptions[node.getAttribute("name")] = this.getChildValue(node);
            },
            "TextSymbolizer": function(node, rule) {
                OpenLayers.Format.SLD.v1_0_0.prototype.readers.sld.TextSymbolizer.apply(this, arguments);
                var symbolizer = this.multipleSymbolizers ? rule.symbolizers[rule.symbolizers.length-1] : rule.symbolizer["Text"];
                if (symbolizer.graphic === undefined) {
                    symbolizer.graphic = false;
                }
            }
        }, OpenLayers.Format.SLD.v1_0_0.prototype.readers["sld"])
    }, OpenLayers.Format.SLD.v1_0_0.prototype.readers),

        writers: OpenLayers.Util.applyDefaults({
        "sld": OpenLayers.Util.applyDefaults({
            "Priority": function(priority) {
                return this.writers.sld._OGCExpression.call(
                    this, "sld:Priority", priority
                );
            },
            "VendorOption": function(option) {
                return this.createElementNSPlus("sld:VendorOption", {
                    attributes: {name: option.name},
                    value: option.value
                });
            },
            "TextSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["TextSymbolizer"].apply(this, arguments);
                if (symbolizer.graphic !== false && (symbolizer.externalGraphic || symbolizer.graphicName)) {
                    this.writeNode("Graphic", symbolizer, node);
                }
                if ("priority" in symbolizer) {
                    this.writeNode("Priority", symbolizer.priority, node);
                }
                return this.addVendorOptions(node, symbolizer);
            },
            "PointSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["PointSymbolizer"].apply(this, arguments);
                return this.addVendorOptions(node, symbolizer);
            },
            "LineSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["LineSymbolizer"].apply(this, arguments);
                return this.addVendorOptions(node, symbolizer);
            },
            "PolygonSymbolizer": function(symbolizer) {
                var writers = OpenLayers.Format.SLD.v1_0_0.prototype.writers;
                var node = writers["sld"]["PolygonSymbolizer"].apply(this, arguments);
                return this.addVendorOptions(node, symbolizer);
            }
        }, OpenLayers.Format.SLD.v1_0_0.prototype.writers["sld"])
    }, OpenLayers.Format.SLD.v1_0_0.prototype.writers),

        addVendorOptions: function(node, symbolizer) {
        var options = symbolizer.vendorOptions;
        if (options) {
            for (var key in symbolizer.vendorOptions) {
                this.writeNode("VendorOption", {
                    name: key, 
                    value: symbolizer.vendorOptions[key]
                }, node);
            }
        }
        return node;
    },

    CLASS_NAME: "OpenLayers.Format.SLD.v1_0_0_GeoServer"

});
