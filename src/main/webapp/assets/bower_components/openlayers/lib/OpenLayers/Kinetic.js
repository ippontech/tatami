/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Kinetic = OpenLayers.Class({

        threshold: 0,

        deceleration: 0.0035,

        nbPoints: 100,

        delay: 200,

        points: undefined,

        timerId: undefined,

        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

        begin: function() {
        OpenLayers.Animation.stop(this.timerId);
        this.timerId = undefined;
        this.points = [];
    },

        update: function(xy) {
        this.points.unshift({xy: xy, tick: new Date().getTime()});
        if (this.points.length > this.nbPoints) {
            this.points.pop();
        }
    },

        end: function(xy) {
        var last, now = new Date().getTime();
        for (var i = 0, l = this.points.length, point; i < l; i++) {
            point = this.points[i];
            if (now - point.tick > this.delay) {
                break;
            }
            last = point;
        }
        if (!last) {
            return;
        }
        var time = new Date().getTime() - last.tick;
        var dist = Math.sqrt(Math.pow(xy.x - last.xy.x, 2) +
                             Math.pow(xy.y - last.xy.y, 2));
        var speed = dist / time;
        if (speed == 0 || speed < this.threshold) {
            return;
        }
        var theta = Math.asin((xy.y - last.xy.y) / dist);
        if (last.xy.x <= xy.x) {
            theta = Math.PI - theta;
        }
        return {speed: speed, theta: theta};
    },

        move: function(info, callback) {
        var v0 = info.speed;
        var fx = Math.cos(info.theta);
        var fy = -Math.sin(info.theta);

        var initialTime = new Date().getTime();

        var lastX = 0;
        var lastY = 0;

        var timerCallback = function() {
            if (this.timerId == null) {
                return;
            }

            var t = new Date().getTime() - initialTime;

            var p = (-this.deceleration * Math.pow(t, 2)) / 2.0 + v0 * t;
            var x = p * fx;
            var y = p * fy;

            var args = {};
            args.end = false;
            var v = -this.deceleration * t + v0;

            if (v <= 0) {
                OpenLayers.Animation.stop(this.timerId);
                this.timerId = null;
                args.end = true;
            }

            args.x = x - lastX;
            args.y = y - lastY;
            lastX = x;
            lastY = y;
            callback(args.x, args.y, args.end);
        };

        this.timerId = OpenLayers.Animation.start(
            OpenLayers.Function.bind(timerCallback, this)
        );
    },

    CLASS_NAME: "OpenLayers.Kinetic"
});
