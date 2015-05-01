/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.String = {

        startsWith: function(str, sub) {
        return (str.indexOf(sub) == 0);
    },

        contains: function(str, sub) {
        return (str.indexOf(sub) != -1);
    },
    
        trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    
        camelize: function(str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i=1, len=oStringList.length; i<len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },
    
        format: function(template, context, args) {
        if(!context) {
            context = window;
        }
        var replacer = function(str, match) {
            var replacement;
            var subs = match.split(/\.+/);
            for (var i=0; i< subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }
                if (replacement === undefined) {
                    break;
                }
                replacement = replacement[subs[i]];
            }

            if(typeof replacement == "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement; 
            }
        };

        return template.replace(OpenLayers.String.tokenRegEx, replacer);
    },

        tokenRegEx:  /\$\{([\w.]+?)\}/g,
    
        numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,
    
        isNumeric: function(value) {
        return OpenLayers.String.numberRegEx.test(value);
    },
    
        numericIf: function(value, trimWhitespace) {
        var originalValue = value;
        if (trimWhitespace === true && value != null && value.replace) {
            value = value.replace(/^\s*|\s*$/g, "");
        }
        return OpenLayers.String.isNumeric(value) ? parseFloat(value) : originalValue;
    }

};

OpenLayers.Number = {

        decimalSeparator: ".",
    
        thousandsSeparator: ",",
    
        limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    
        format: function(num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0; 
        tsep = (typeof tsep != "undefined") ? tsep :
            OpenLayers.Number.thousandsSeparator; 
        dsep = (typeof dsep != "undefined") ? dsep :
            OpenLayers.Number.decimalSeparator;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            dec = 0;
        }
        
        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/; 
            while(thousands.test(integer)) { 
                integer = integer.replace(thousands, "$1" + tsep + "$2"); 
            }
        }
        
        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    },

        zeroPad: function(num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }    
};

OpenLayers.Function = {
        bind: function(func, object) {
        var args = Array.prototype.slice.call(arguments, 2);
        return function() {
            var newArgs = args.concat(
                Array.prototype.slice.call(arguments, 0)
            );
            return func.apply(object, newArgs);
        };
    },
    
        bindAsEventListener: function(func, object) {
        return function(event) {
            return func.call(object, event || window.event);
        };
    },
    
        False : function() {
        return false;
    },

        True : function() {
        return true;
    },
    
        Void: function() {}

};

OpenLayers.Array = {

        filter: function(array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for(var i=0; i<len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }        
        }
        return selected;
    }
    
};
