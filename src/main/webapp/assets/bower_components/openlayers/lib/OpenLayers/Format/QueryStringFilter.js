/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.QueryStringFilter = (function() {

        var cmpToStr = {};
    cmpToStr[OpenLayers.Filter.Comparison.EQUAL_TO] = "eq";
    cmpToStr[OpenLayers.Filter.Comparison.NOT_EQUAL_TO] = "ne";
    cmpToStr[OpenLayers.Filter.Comparison.LESS_THAN] = "lt";
    cmpToStr[OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO] = "lte";
    cmpToStr[OpenLayers.Filter.Comparison.GREATER_THAN] = "gt";
    cmpToStr[OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO] = "gte";
    cmpToStr[OpenLayers.Filter.Comparison.LIKE] = "ilike";

        function regex2value(value) {
        value = value.replace(/%/g, "\\%");
        value = value.replace(/\\\\\.(\*)?/g, function($0, $1) {
            return $1 ? $0 : "\\\\_";
        });
        value = value.replace(/\\\\\.\*/g, "\\\\%");
        value = value.replace(/(\\)?\.(\*)?/g, function($0, $1, $2) {
            return $1 || $2 ? $0 : "_";
        });
        value = value.replace(/(\\)?\.\*/g, function($0, $1) {
            return $1 ? $0 : "%";
        });
        value = value.replace(/\\\./g, ".");
        value = value.replace(/(\\)?\\\*/g, function($0, $1) {
            return $1 ? $0 : "*";
        });

        return value;
    }
    
    return OpenLayers.Class(OpenLayers.Format, {
        
                wildcarded: false,

                srsInBBOX: false,

                write: function(filter, params) {
            params = params || {};
            var className = filter.CLASS_NAME;
            var filterType = className.substring(className.lastIndexOf(".") + 1);
            switch (filterType) {
                case "Spatial":
                    switch (filter.type) {
                        case OpenLayers.Filter.Spatial.BBOX:
                            params.bbox = filter.value.toArray();
                            if (this.srsInBBOX && filter.projection) {
                                params.bbox.push(filter.projection.getCode());
                            }
                            break;
                        case OpenLayers.Filter.Spatial.DWITHIN:
                            params.tolerance = filter.distance;
                        case OpenLayers.Filter.Spatial.WITHIN:
                            params.lon = filter.value.x;
                            params.lat = filter.value.y;
                            break;
                        default:
                            OpenLayers.Console.warn(
                                "Unknown spatial filter type " + filter.type);
                    }
                    break;
                case "Comparison":
                    var op = cmpToStr[filter.type];
                    if (op !== undefined) {
                        var value = filter.value;
                        if (filter.type == OpenLayers.Filter.Comparison.LIKE) {
                            value = regex2value(value);
                            if (this.wildcarded) {
                                value = "%" + value + "%";
                            }
                        }
                        params[filter.property + "__" + op] = value;
                        params.queryable = params.queryable || [];
                        params.queryable.push(filter.property);
                    } else {
                        OpenLayers.Console.warn(
                            "Unknown comparison filter type " + filter.type);
                    }
                    break;
                case "Logical":
                    if (filter.type === OpenLayers.Filter.Logical.AND) {
                        for (var i=0,len=filter.filters.length; i<len; i++) {
                            params = this.write(filter.filters[i], params);
                        }
                    } else {
                        OpenLayers.Console.warn(
                            "Unsupported logical filter type " + filter.type);
                    }
                    break;
                default:
                    OpenLayers.Console.warn("Unknown filter type " + filterType);
            }
            return params;
        },
        
        CLASS_NAME: "OpenLayers.Format.QueryStringFilter"
        
    });


})();
