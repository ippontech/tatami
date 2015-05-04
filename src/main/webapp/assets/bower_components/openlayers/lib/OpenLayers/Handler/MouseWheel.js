/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.MouseWheel = OpenLayers.Class(OpenLayers.Handler, {
        wheelListener: null,

        interval: 0,
    
        maxDelta: Number.POSITIVE_INFINITY,
    
        delta: 0,
    
        cumulative: true,
    
        initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.wheelListener = OpenLayers.Function.bindAsEventListener(
            this.onWheelEvent, this
        );
    },

    
        onWheelEvent: function(e){
        if (!this.map || !this.checkModifiers(e)) {
            return;
        }
        var overScrollableDiv = false;
        var allowScroll = false;
        var overMapDiv = false;
        
        var elem = OpenLayers.Event.element(e);
        while((elem != null) && !overMapDiv && !overScrollableDiv) {

            if (!overScrollableDiv) {
                try {
                    var overflow;
                    if (elem.currentStyle) {
                        overflow = elem.currentStyle["overflow"];
                    } else {
                        var style = 
                            document.defaultView.getComputedStyle(elem, null);
                        overflow = style.getPropertyValue("overflow");
                    }
                    overScrollableDiv = ( overflow && 
                        (overflow == "auto") || (overflow == "scroll") );
                } catch(err) {
                }
            }

            if (!allowScroll) {
                allowScroll = OpenLayers.Element.hasClass(elem, 'olScrollable');
                if (!allowScroll) {
                    for (var i = 0, len = this.map.layers.length; i < len; i++) {
                        var layer = this.map.layers[i];
                        if (elem == layer.div || elem == layer.pane) {
                            allowScroll = true;
                            break;
                        }
                    }
                }
            }
            overMapDiv = (elem == this.map.div);

            elem = elem.parentNode;
        }
        if (!overScrollableDiv && overMapDiv) {
            if (allowScroll) {
                var delta = 0;
                
                if (e.wheelDelta) {
                    delta = e.wheelDelta;
                    if (delta % 160 === 0) {
                        delta = delta * 0.75;
                    }
                    delta = delta / 120;
                } else if (e.detail) {
                    delta = - (e.detail / Math.abs(e.detail));
                }
                this.delta += delta;

                window.clearTimeout(this._timeoutId);
                if(this.interval && Math.abs(this.delta) < this.maxDelta) {
                    var evt = OpenLayers.Util.extend({}, e);
                    this._timeoutId = window.setTimeout(
                        OpenLayers.Function.bind(function(){
                            this.wheelZoom(evt);
                        }, this),
                        this.interval
                    );
                } else {
                    this.wheelZoom(e);
                }
            }
            OpenLayers.Event.stop(e);
        }
    },

        wheelZoom: function(e) {
        var delta = this.delta;
        this.delta = 0;
        
        if (delta) {
            e.xy = this.map.events.getMousePosition(e);
            if (delta < 0) {
                this.callback("down",
                    [e, this.cumulative ? Math.max(-this.maxDelta, delta) : -1]);
            } else {
                this.callback("up",
                    [e, this.cumulative ? Math.min(this.maxDelta, delta) : 1]);
            }
        }
    },
    
        activate: function (evt) {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            var wheelListener = this.wheelListener;
            OpenLayers.Event.observe(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.observe(window, "mousewheel", wheelListener);
            OpenLayers.Event.observe(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },

        deactivate: function (evt) {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            var wheelListener = this.wheelListener;
            OpenLayers.Event.stopObserving(window, "DOMMouseScroll", wheelListener);
            OpenLayers.Event.stopObserving(window, "mousewheel", wheelListener);
            OpenLayers.Event.stopObserving(document, "mousewheel", wheelListener);
            return true;
        } else {
            return false;
        }
    },

    CLASS_NAME: "OpenLayers.Handler.MouseWheel"
});
