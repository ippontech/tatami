/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.OGCExceptionReport = OpenLayers.Class(OpenLayers.Format.XML, {

        namespaces: {
        ogc: "http://www.opengis.net/ogc"
    },

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

        defaultPrefix: "ogc",

    
        read: function(data) {
        var result;
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        var exceptionInfo = {exceptionReport: null}; 
        if (root) {
            this.readChildNodes(data, exceptionInfo);
            if (exceptionInfo.exceptionReport === null) {
                exceptionInfo = new OpenLayers.Format.OWSCommon().read(data);
            }
        }
        return exceptionInfo;
    },

        readers: {
        "ogc": {
            "ServiceExceptionReport": function(node, obj) {
                obj.exceptionReport = {exceptions: []};
                this.readChildNodes(node, obj.exceptionReport);
            },
            "ServiceException": function(node, exceptionReport) {
                var exception = {
                    code: node.getAttribute("code"),
                    locator: node.getAttribute("locator"),
                    text: this.getChildValue(node)
                };
                exceptionReport.exceptions.push(exception);
            }
        }
    },
    
    CLASS_NAME: "OpenLayers.Format.OGCExceptionReport"
    
});
