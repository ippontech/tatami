/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

 
OpenLayers.StyleMap = OpenLayers.Class({
    
        styles: null,
    
        extendDefault: true,
    
        initialize: function (style, options) {
        this.styles = {
            "default": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        };
        if(style instanceof OpenLayers.Style) {
            this.styles["default"] = style;
            this.styles["select"] = style;
            this.styles["temporary"] = style;
            this.styles["delete"] = style;
        } else if(typeof style == "object") {
            for(var key in style) {
                if(style[key] instanceof OpenLayers.Style) {
                    this.styles[key] = style[key];
                } else if(typeof style[key] == "object") {
                    this.styles[key] = new OpenLayers.Style(style[key]);
                } else {
                    this.styles["default"] = new OpenLayers.Style(style);
                    this.styles["select"] = new OpenLayers.Style(style);
                    this.styles["temporary"] = new OpenLayers.Style(style);
                    this.styles["delete"] = new OpenLayers.Style(style);
                    break;
                }
            }
        }
        OpenLayers.Util.extend(this, options);
    },

        destroy: function() {
        for(var key in this.styles) {
            this.styles[key].destroy();
        }
        this.styles = null;
    },
    
        createSymbolizer: function(feature, intent) {
        if(!feature) {
            feature = new OpenLayers.Feature.Vector();
        }
        if(!this.styles[intent]) {
            intent = "default";
        }
        feature.renderIntent = intent;
        var defaultSymbolizer = {};
        if(this.extendDefault && intent != "default") {
            defaultSymbolizer = this.styles["default"].createSymbolizer(feature);
        }
        return OpenLayers.Util.extend(defaultSymbolizer,
            this.styles[intent].createSymbolizer(feature));
    },
    
        addUniqueValueRules: function(renderIntent, property, symbolizers, context) {
        var rules = [];
        for (var value in symbolizers) {
            rules.push(new OpenLayers.Rule({
                symbolizer: symbolizers[value],
                context: context,
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: property,
                    value: value
                })
            }));
        }
        this.styles[renderIntent].addRules(rules);
    },

    CLASS_NAME: "OpenLayers.StyleMap"
});
