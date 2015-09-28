/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Date = {

        dateRegEx: /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))|Z)?$/,

        toISOString: (function() {
        if ("toISOString" in Date.prototype) {
            return function(date) {
                return date.toISOString();
            };
        } else {
            return function(date) {
                var str;
                if (isNaN(date.getTime())) {
                    str = "Invalid Date";
                } else {
                    str =
                        date.getUTCFullYear() + "-" +
                        OpenLayers.Number.zeroPad(date.getUTCMonth() + 1, 2) + "-" +
                        OpenLayers.Number.zeroPad(date.getUTCDate(), 2) + "T" +
                        OpenLayers.Number.zeroPad(date.getUTCHours(), 2) + ":" +
                        OpenLayers.Number.zeroPad(date.getUTCMinutes(), 2) + ":" +
                        OpenLayers.Number.zeroPad(date.getUTCSeconds(), 2) + "." +
                        OpenLayers.Number.zeroPad(date.getUTCMilliseconds(), 3) + "Z";
                }
                return str;
            };
        }

    })(),

        parse: function(str) {
        var date;
        var match = str.match(this.dateRegEx);
        if (match && (match[1] || match[7])) { // must have at least year or time
            var year = parseInt(match[1], 10) || 0;
            var month = (parseInt(match[2], 10) - 1) || 0;
            var day = parseInt(match[3], 10) || 1;
            date = new Date(Date.UTC(year, month, day));
            var type = match[7];
            if (type) {
                var hours = parseInt(match[4], 10);
                var minutes = parseInt(match[5], 10);
                var secFrac = parseFloat(match[6]);
                var seconds = secFrac | 0;
                var milliseconds = Math.round(1000 * (secFrac - seconds));
                date.setUTCHours(hours, minutes, seconds, milliseconds);
                if (type !== "Z") {
                    var hoursOffset = parseInt(type, 10);
                    var minutesOffset = parseInt(match[8], 10) || 0;
                    var offset = -1000 * (60 * (hoursOffset * 60) + minutesOffset * 60);
                    date = new Date(date.getTime() + offset);
                }
            }
        } else {
            date = new Date("invalid");
        }
        return date;
    }
};
