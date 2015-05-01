/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WCSDescribeCoverage.v1 = OpenLayers.Class(
    OpenLayers.Format.XML, {

    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        splitSpace: (/\s+/)
    },

        defaultPrefix: "wcs",

        read: function(data) {
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var schema = {};
        if (data.nodeName.split(":").pop() === 'ExceptionReport') {
            var parser = new OpenLayers.Format.OGCExceptionReport();
            schema.error = parser.read(data);
        } else {
            this.readNode(data, schema);
        }
        return schema;
    },

    CLASS_NAME: "OpenLayers.Format.WCSDescribeCoverage.v1" 

});
