/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Protocol.SOS = function(options) {
    options = OpenLayers.Util.applyDefaults(
        options, OpenLayers.Protocol.SOS.DEFAULTS
    );
    var cls = OpenLayers.Protocol.SOS["v"+options.version.replace(/\./g, "_")];
    if(!cls) {
        throw "Unsupported SOS version: " + options.version;
    }
    return new cls(options);
};

OpenLayers.Protocol.SOS.DEFAULTS = {
    "version": "1.0.0"
};
