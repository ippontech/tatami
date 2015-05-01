/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Animation = (function(window) {
    
        var requestAnimationFrame = OpenLayers.Util.vendorPrefix.js(window, "requestAnimationFrame");
    var isNative = !!(requestAnimationFrame);
    
        var requestFrame = (function() {
        var request = window[requestAnimationFrame] ||
            function(callback, element) {
                window.setTimeout(callback, 16);
            };
        return function(callback, element) {
            request.apply(window, [callback, element]);
        };
    })();
    var counter = 0;
    var loops = {};
    
        function start(callback, duration, element) {
        duration = duration > 0 ? duration : Number.POSITIVE_INFINITY;
        var id = ++counter;
        var start = +new Date;
        loops[id] = function() {
            if (loops[id] && +new Date - start <= duration) {
                callback();
                if (loops[id]) {
                    requestFrame(loops[id], element);
                }
            } else {
                delete loops[id];
            }
        };
        requestFrame(loops[id], element);
        return id;
    }
    
        function stop(id) {
        delete loops[id];
    }
    
    return {
        isNative: isNative,
        requestFrame: requestFrame,
        start: start,
        stop: stop
    };
    
})(window);
