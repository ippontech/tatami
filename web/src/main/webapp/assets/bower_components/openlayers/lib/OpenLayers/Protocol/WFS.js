/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Protocol.WFS = function(options) {
    options = OpenLayers.Util.applyDefaults(
        options, OpenLayers.Protocol.WFS.DEFAULTS
    );
    var cls = OpenLayers.Protocol.WFS["v"+options.version.replace(/\./g, "_")];
    if(!cls) {
        throw "Unsupported WFS version: " + options.version;
    }
    return new cls(options);
};

OpenLayers.Protocol.WFS.fromWMSLayer = function(layer, options) {
    var typeName, featurePrefix;
    var param = layer.params["LAYERS"];
    var parts = (OpenLayers.Util.isArray(param) ? param[0] : param).split(":");
    if(parts.length > 1) {
        featurePrefix = parts[0];
    }
    typeName = parts.pop();
    var protocolOptions = {
        url: layer.url,
        featureType: typeName,
        featurePrefix: featurePrefix,
        srsName: layer.projection && layer.projection.getCode() ||
                 layer.map && layer.map.getProjectionObject().getCode(),
        version: "1.1.0"
    };
    return new OpenLayers.Protocol.WFS(OpenLayers.Util.applyDefaults(
        options, protocolOptions
    ));
};

OpenLayers.Protocol.WFS.DEFAULTS = {
    "version": "1.0.0"
};
