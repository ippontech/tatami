/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Tween = OpenLayers.Class({
    
        easing: null,
    
        begin: null,
    
        finish: null,
    
        duration: null,
    
        callbacks: null,
    
        time: null,
    
        minFrameRate: null,

        startTime: null,
    
        animationId: null,
    
        playing: false,
    
        start: function(begin, finish, duration, options) {
        this.playing = true;
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.callbacks = options.callbacks;
        this.minFrameRate = options.minFrameRate || 30;
        this.time = 0;
        this.startTime = new Date().getTime();
        OpenLayers.Animation.stop(this.animationId);
        this.animationId = null;
        if (this.callbacks && this.callbacks.start) {
            this.callbacks.start.call(this, this.begin);
        }
        this.animationId = OpenLayers.Animation.start(
            OpenLayers.Function.bind(this.play, this)
        );
    },
    
        stop: function() {
        if (!this.playing) {
            return;
        }
        
        if (this.callbacks && this.callbacks.done) {
            this.callbacks.done.call(this, this.finish);
        }
        OpenLayers.Animation.stop(this.animationId);
        this.animationId = null;
        this.playing = false;
    },
    
        play: function() {
        var value = {};
        for (var i in this.begin) {
            var b = this.begin[i];
            var f = this.finish[i];
            if (b == null || f == null || isNaN(b) || isNaN(f)) {
                throw new TypeError('invalid value for Tween');
            }

            var c = f - b;
            value[i] = this.easing.apply(this, [this.time, b, c, this.duration]);
        }
        this.time++;
        
        if (this.callbacks && this.callbacks.eachStep) {
            if ((new Date().getTime() - this.startTime) / this.time <= 1000 / this.minFrameRate) {
                this.callbacks.eachStep.call(this, value);
            }
        }
        
        if (this.time > this.duration) {
            this.stop();
        }
    },
    
        CLASS_NAME: "OpenLayers.Tween"
});

OpenLayers.Easing = {
        CLASS_NAME: "OpenLayers.Easing"
};

OpenLayers.Easing.Linear = {
    
        easeIn: function(t, b, c, d) {
        return c*t/d + b;
    },
    
        easeOut: function(t, b, c, d) {
        return c*t/d + b;
    },
    
        easeInOut: function(t, b, c, d) {
        return c*t/d + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Linear"
};

OpenLayers.Easing.Expo = {
    
        easeIn: function(t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    
        easeOut: function(t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    
        easeInOut: function(t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Expo"
};

OpenLayers.Easing.Quad = {
    
        easeIn: function(t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    
        easeOut: function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    
        easeInOut: function(t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    CLASS_NAME: "OpenLayers.Easing.Quad"
};
