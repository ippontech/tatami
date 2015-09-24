/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.CSWGetDomain = function(options) {
    options = OpenLayers.Util.applyDefaults(
        options, OpenLayers.Format.CSWGetDomain.DEFAULTS
    );
    var cls = OpenLayers.Format.CSWGetDomain["v"+options.version.replace(/\./g, "_")];
    if(!cls) {
        throw "Unsupported CSWGetDomain version: " + options.version;
    }
    return new cls(options);
};

OpenLayers.Format.CSWGetDomain.DEFAULTS = {
    "version": "2.0.2"
};
