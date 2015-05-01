/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Filter.Comparison = OpenLayers.Class(OpenLayers.Filter, {

        type: null,
    
        property: null,
    
        value: null,
    
        matchCase: true,
    
        lowerBoundary: null,
    
        upperBoundary: null,

        initialize: function(options) {
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
        if (this.type === OpenLayers.Filter.Comparison.LIKE 
            && options.matchCase === undefined) {
                this.matchCase = null;
        }
    },

        evaluate: function(context) {
        if (context instanceof OpenLayers.Feature.Vector) {
            context = context.attributes;
        }
        var result = false;
        var got = context[this.property];
        if (got === undefined) {
            return false;
        }
        var exp;
        switch(this.type) {
            case OpenLayers.Filter.Comparison.EQUAL_TO:
                exp = this.value;
                if(!this.matchCase &&
                   typeof got == "string" && typeof exp == "string") {
                    result = (got.toUpperCase() == exp.toUpperCase());
                } else {
                    result = (got == exp);
                }
                break;
            case OpenLayers.Filter.Comparison.NOT_EQUAL_TO:
                exp = this.value;
                if(!this.matchCase &&
                   typeof got == "string" && typeof exp == "string") {
                    result = (got.toUpperCase() != exp.toUpperCase());
                } else {
                    result = (got != exp);
                }
                break;
            case OpenLayers.Filter.Comparison.LESS_THAN:
                result = got < this.value;
                break;
            case OpenLayers.Filter.Comparison.GREATER_THAN:
                result = got > this.value;
                break;
            case OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO:
                result = got <= this.value;
                break;
            case OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO:
                result = got >= this.value;
                break;
            case OpenLayers.Filter.Comparison.BETWEEN:
                result = (got >= this.lowerBoundary) &&
                    (got <= this.upperBoundary);
                break;
            case OpenLayers.Filter.Comparison.LIKE:
                var regexp = new RegExp(this.value, "gi");
                result = regexp.test(got);
                break;
            case OpenLayers.Filter.Comparison.IS_NULL:
                result = (got === null);
                break;
        }
        return result;
    },
    
        value2regex: function(wildCard, singleChar, escapeChar) {
        if (wildCard == ".") {
            throw new Error("'.' is an unsupported wildCard character for " +
                            "OpenLayers.Filter.Comparison");
        }
        wildCard = wildCard ? wildCard : "*";
        singleChar = singleChar ? singleChar : ".";
        escapeChar = escapeChar ? escapeChar : "!";
        
        this.value = this.value.replace(
                new RegExp("\\"+escapeChar+"(.|$)", "g"), "\\$1");
        this.value = this.value.replace(
                new RegExp("\\"+singleChar, "g"), ".");
        this.value = this.value.replace(
                new RegExp("\\"+wildCard, "g"), ".*");
        this.value = this.value.replace(
                new RegExp("\\\\.\\*", "g"), "\\"+wildCard);
        this.value = this.value.replace(
                new RegExp("\\\\\\.", "g"), "\\"+singleChar);
        
        return this.value;
    },
    
        regex2value: function() {
        
        var value = this.value;
        value = value.replace(/!/g, "!!");
        value = value.replace(/(\\)?\\\./g, function($0, $1) {
            return $1 ? $0 : "!.";
        });
        value = value.replace(/(\\)?\\\*/g, function($0, $1) {
            return $1 ? $0 : "!*";
        });
        value = value.replace(/\\\\/g, "\\");
        value = value.replace(/\.\*/g, "*");
        
        return value;
    },
    
        clone: function() {
        return OpenLayers.Util.extend(new OpenLayers.Filter.Comparison(), this);
    },
    
    CLASS_NAME: "OpenLayers.Filter.Comparison"
});


OpenLayers.Filter.Comparison.EQUAL_TO                 = "==";
OpenLayers.Filter.Comparison.NOT_EQUAL_TO             = "!=";
OpenLayers.Filter.Comparison.LESS_THAN                = "<";
OpenLayers.Filter.Comparison.GREATER_THAN             = ">";
OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO    = "<=";
OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = ">=";
OpenLayers.Filter.Comparison.BETWEEN                  = "..";
OpenLayers.Filter.Comparison.LIKE                     = "~";
OpenLayers.Filter.Comparison.IS_NULL                  = "NULL";
