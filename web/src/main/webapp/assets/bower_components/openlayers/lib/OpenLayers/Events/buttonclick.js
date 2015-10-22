/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Events.buttonclick = OpenLayers.Class({
    
        target: null,
    
        events: [
        'mousedown', 'mouseup', 'click', 'dblclick',
        'touchstart', 'touchmove', 'touchend', 'keydown'
    ],
    
        startRegEx: /^mousedown|touchstart$/,

        cancelRegEx: /^touchmove$/,

        completeRegEx: /^mouseup|touchend$/,

        isDeviceTouchCapable: 'ontouchstart' in window ||
        window.DocumentTouch && document instanceof window.DocumentTouch,
    
        
        initialize: function(target) {
        this.target = target;
        for (var i=this.events.length-1; i>=0; --i) {
            this.target.register(this.events[i], this, this.buttonClick, {
                extension: true
            });
        }
    },
    
        destroy: function() {
        for (var i=this.events.length-1; i>=0; --i) {
            this.target.unregister(this.events[i], this, this.buttonClick);
        }
        delete this.target;
    },

        getPressedButton: function(element) {
        var depth = 3, // limit the search depth
            button;
        do {
            if(OpenLayers.Element.hasClass(element, "olButton")) {
                button = element;
                break;
            }
            element = element.parentNode;
        } while(--depth > 0 && element);
        return button;
    },
    
        ignore: function(element) {
        var depth = 3,
            ignore = false;
        do {
            if (element.nodeName.toLowerCase() === 'a') {
                ignore = true;
                break;
            }
            element = element.parentNode;
        } while (--depth > 0 && element);
        return ignore;
    },

        buttonClick: function(evt) {
        var propagate = true,
            element = OpenLayers.Event.element(evt);

        if (element &&
           (OpenLayers.Event.isLeftClick(evt) &&
            !this.isDeviceTouchCapable ||
            !~evt.type.indexOf("mouse"))) {
            var button = this.getPressedButton(element);
            if (button) {
                if (evt.type === "keydown") {
                    switch (evt.keyCode) {
                    case OpenLayers.Event.KEY_RETURN:
                    case OpenLayers.Event.KEY_SPACE:
                        this.target.triggerEvent("buttonclick", {
                            buttonElement: button
                        });
                        OpenLayers.Event.stop(evt);
                        propagate = false;
                        break;
                    }
                } else if (this.startEvt) {
                    if (this.completeRegEx.test(evt.type)) {
                        var pos = OpenLayers.Util.pagePosition(button);
                        var viewportElement = OpenLayers.Util.getViewportElement();
                        var scrollTop = window.pageYOffset || viewportElement.scrollTop;
                        var scrollLeft = window.pageXOffset || viewportElement.scrollLeft;
                        pos[0] = pos[0] - scrollLeft;
                        pos[1] = pos[1] - scrollTop;
                        
                        this.target.triggerEvent("buttonclick", {
                            buttonElement: button,
                            buttonXY: {
                                x: this.startEvt.clientX - pos[0],
                                y: this.startEvt.clientY - pos[1]
                            }
                        });
                    }
                    if (this.cancelRegEx.test(evt.type)) {
                        if (evt.touches && this.startEvt.touches &&
                                (Math.abs(evt.touches[0].olClientX - this.startEvt.touches[0].olClientX) > 4 ||
                                Math.abs(evt.touches[0].olClientY - this.startEvt.touches[0].olClientY)) > 4) {
                            delete this.startEvt;
                        }
                    }
                    OpenLayers.Event.stop(evt);
                    propagate = false;
                }
                if (this.startRegEx.test(evt.type)) {
                    this.startEvt = evt;
                    OpenLayers.Event.stop(evt);
                    propagate = false;
                }
            } else {
                propagate = !this.ignore(OpenLayers.Event.element(evt));
                delete this.startEvt;
            }
        }
        return propagate;
    }
    
});
