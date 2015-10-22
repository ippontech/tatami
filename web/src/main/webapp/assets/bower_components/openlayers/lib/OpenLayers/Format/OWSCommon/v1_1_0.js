/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.OWSCommon.v1_1_0 = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1, {

        namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        xlink: "http://www.w3.org/1999/xlink"
    },    
    
        readers: {
        "ows": OpenLayers.Util.applyDefaults({
            "ExceptionReport": function(node, obj) {
                obj.exceptionReport = {
                    version: node.getAttribute('version'),
                    language: node.getAttribute('xml:lang'),
                    exceptions: []
                };
                this.readChildNodes(node, obj.exceptionReport);
            },
            "AllowedValues": function(node, parameter) {
                parameter.allowedValues = {};
                this.readChildNodes(node, parameter.allowedValues);
            },
            "AnyValue": function(node, parameter) {
                parameter.anyValue = true;
            },
            "DataType": function(node, parameter) {
                parameter.dataType = this.getChildValue(node);
            },
            "Range": function(node, allowedValues) {
                allowedValues.range = {};
                this.readChildNodes(node, allowedValues.range);
            },
            "MinimumValue": function(node, range) {
                range.minValue = this.getChildValue(node);
            },
            "MaximumValue": function(node, range) {
                range.maxValue = this.getChildValue(node);
            },
            "Identifier": function(node, obj) {
                obj.identifier = this.getChildValue(node);
            },
            "SupportedCRS": function(node, obj) {
                obj.supportedCRS = this.getChildValue(node);
            }
        }, OpenLayers.Format.OWSCommon.v1.prototype.readers["ows"])
    },

        writers: {
        "ows": OpenLayers.Util.applyDefaults({
            "Range": function(range) {
                var node = this.createElementNSPlus("ows:Range", {
                    attributes: {
                        'ows:rangeClosure': range.closure
                    }
                });
                this.writeNode("ows:MinimumValue", range.minValue, node);
                this.writeNode("ows:MaximumValue", range.maxValue, node);
                return node;
            },
            "MinimumValue": function(minValue) {
                var node = this.createElementNSPlus("ows:MinimumValue", {
                    value: minValue
                });
                return node;
            },
            "MaximumValue": function(maxValue) {
                var node = this.createElementNSPlus("ows:MaximumValue", {
                    value: maxValue
                });
                return node;
            },
            "Value": function(value) {
                var node = this.createElementNSPlus("ows:Value", {
                    value: value
                });
                return node;
            }
        }, OpenLayers.Format.OWSCommon.v1.prototype.writers["ows"])
    },

    CLASS_NAME: "OpenLayers.Format.OWSCommon.v1_1_0"

});
