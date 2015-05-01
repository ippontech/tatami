/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.Click = OpenLayers.Class(OpenLayers.Handler, {
        delay: 300,
    
        single: true,
    
        'double': false,
    
        pixelTolerance: 0,
        
        dblclickTolerance: 13,
        
        stopSingle: false,
    
        stopDouble: false,

        timerId: null,
    
        down: null,

        last: null,

        first: null,

        rightclickTimerId: null,
    
        
        touchstart: function(evt) {
        this.startTouch();
        this.down = this.getEventInfo(evt);
        this.last = this.getEventInfo(evt);
        return true;
    },
    
        touchmove: function(evt) {
        this.last = this.getEventInfo(evt);
        return true;
    },

        touchend: function(evt) {
        if (this.down) {
            evt.xy = this.last.xy;
            evt.lastTouches = this.last.touches;
            this.handleSingle(evt);
            this.down = null;
        }
        return true;
    },

        mousedown: function(evt) {
        this.down = this.getEventInfo(evt);
        this.last = this.getEventInfo(evt);
        return true;
    },

        mouseup: function (evt) {
        var propagate = true;
        if (this.checkModifiers(evt) && this.control.handleRightClicks &&
           OpenLayers.Event.isRightClick(evt)) {
            propagate = this.rightclick(evt);
        }

        return propagate;
    },
    
        rightclick: function(evt) {
        if(this.passesTolerance(evt)) {
           if(this.rightclickTimerId != null) {
                this.clearTimer();
                this.callback('dblrightclick', [evt]);
                return !this.stopDouble;
            } else { 
                var clickEvent = this['double'] ?
                    OpenLayers.Util.extend({}, evt) : 
                    this.callback('rightclick', [evt]);

                var delayedRightCall = OpenLayers.Function.bind(
                    this.delayedRightCall, 
                    this, 
                    clickEvent
                );
                this.rightclickTimerId = window.setTimeout(
                    delayedRightCall, this.delay
                );
            } 
        }
        return !this.stopSingle;
    },
    
        delayedRightCall: function(evt) {
        this.rightclickTimerId = null;
        if (evt) {
           this.callback('rightclick', [evt]);
        }
    },
    
        click: function(evt) {
        if (!this.last) {
            this.last = this.getEventInfo(evt);
        }
        this.handleSingle(evt);
        return !this.stopSingle;
    },

        dblclick: function(evt) {
        this.handleDouble(evt);
        return !this.stopDouble;
    },
    
        handleDouble: function(evt) {
        if (this.passesDblclickTolerance(evt)) {
            if (this["double"]) {
                this.callback("dblclick", [evt]);
            }
            this.clearTimer();
        }
    },
    
        handleSingle: function(evt) {
        if (this.passesTolerance(evt)) {
            if (this.timerId != null) {
                if (this.last.touches && this.last.touches.length === 1) {
                    if (this["double"]) {
                        OpenLayers.Event.preventDefault(evt);
                    }
                    this.handleDouble(evt);
                }
                if (!this.last.touches || this.last.touches.length !== 2) {
                    this.clearTimer();
                }
            } else {
                this.first = this.getEventInfo(evt);
                var clickEvent = this.single ?
                    OpenLayers.Util.extend({}, evt) : null;
                this.queuePotentialClick(clickEvent);
            }
        }
    },
    
        queuePotentialClick: function(evt) {
        this.timerId = window.setTimeout(
            OpenLayers.Function.bind(this.delayedCall, this, evt),
            this.delay
        );
    },

        passesTolerance: function(evt) {
        var passes = true;
        if (this.pixelTolerance != null && this.down && this.down.xy) {
            passes = this.pixelTolerance >= this.down.xy.distanceTo(evt.xy);
            if (passes && this.touch && 
                this.down.touches.length === this.last.touches.length) {
                for (var i=0, ii=this.down.touches.length; i<ii; ++i) {
                    if (this.getTouchDistance(
                            this.down.touches[i], 
                            this.last.touches[i]
                        ) > this.pixelTolerance) {
                        passes = false;
                        break;
                    }
                }
            }
        }
        return passes;
    },
    
        getTouchDistance: function(from, to) {
        return Math.sqrt(
            Math.pow(from.clientX - to.clientX, 2) +
            Math.pow(from.clientY - to.clientY, 2)
        );
    },
    
        passesDblclickTolerance: function(evt) {
        var passes = true;
        if (this.down && this.first) {
            passes = this.down.xy.distanceTo(this.first.xy) <= this.dblclickTolerance;
        }
        return passes;
    },

        clearTimer: function() {
        if (this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
        if (this.rightclickTimerId != null) {
            window.clearTimeout(this.rightclickTimerId);
            this.rightclickTimerId = null;
        }
    },
    
        delayedCall: function(evt) {
        this.timerId = null;
        if (evt) {
            this.callback("click", [evt]);
        }
    },

        getEventInfo: function(evt) {
        var touches;
        if (evt.touches) {
            var len = evt.touches.length;
            touches = new Array(len);
            var touch;
            for (var i=0; i<len; i++) {
                touch = evt.touches[i];
                touches[i] = {
                    clientX: touch.olClientX,
                    clientY: touch.olClientY
                };
            }
        }
        return {
            xy: evt.xy,
            touches: touches
        };
    },

        deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.clearTimer();
            this.down = null;
            this.first = null;
            this.last = null;
            deactivated = true;
        }
        return deactivated;
    },

    CLASS_NAME: "OpenLayers.Handler.Click"
});
