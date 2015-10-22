/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


 OpenLayers.Protocol.SOS.v1_0_0 = OpenLayers.Class(OpenLayers.Protocol, {

        fois: null,

        formatOptions: null,
   
        initialize: function(options) {
        OpenLayers.Protocol.prototype.initialize.apply(this, [options]);
        if(!options.format) {
            this.format = new OpenLayers.Format.SOSGetFeatureOfInterest(
                this.formatOptions);
        }
    },
   
        destroy: function() {
        if(this.options && !this.options.format) {
            this.format.destroy();
        }
        this.format = null;
        OpenLayers.Protocol.prototype.destroy.apply(this);
    },

        read: function(options) {
        options = OpenLayers.Util.extend({}, options);
        OpenLayers.Util.applyDefaults(options, this.options || {});
        var response = new OpenLayers.Protocol.Response({requestType: "read"});
        var format = this.format;
        var data = OpenLayers.Format.XML.prototype.write.apply(format,
            [format.writeNode("sos:GetFeatureOfInterest", {fois: this.fois})]
        );
        response.priv = OpenLayers.Request.POST({
            url: options.url,
            callback: this.createCallback(this.handleRead, response, options),
            data: data
        });
        return response;
    },
   
        handleRead: function(response, options) {
        if(options.callback) {
            var request = response.priv;
            if(request.status >= 200 && request.status < 300) {
                response.features = this.parseFeatures(request);
                response.code = OpenLayers.Protocol.Response.SUCCESS;
            } else {
                response.code = OpenLayers.Protocol.Response.FAILURE;
            }
            options.callback.call(options.scope, response);
        }
    },

        parseFeatures: function(request) {
        var doc = request.responseXML;
        if(!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        if(!doc || doc.length <= 0) {
            return null;
        }
        return this.format.read(doc);
    },

    CLASS_NAME: "OpenLayers.Protocol.SOS.v1_0_0"
});
