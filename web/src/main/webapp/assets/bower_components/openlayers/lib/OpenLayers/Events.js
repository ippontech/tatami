/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Event = {

        observers: false,

        KEY_SPACE: 32,
    
        KEY_BACKSPACE: 8,

        KEY_TAB: 9,

        KEY_RETURN: 13,

        KEY_ESC: 27,

        KEY_LEFT: 37,

        KEY_UP: 38,

        KEY_RIGHT: 39,

        KEY_DOWN: 40,

        KEY_DELETE: 46,


        element: function(event) {
        return event.target || event.srcElement;
    },

        isSingleTouch: function(event) {
        return event.touches && event.touches.length == 1;
    },

        isMultiTouch: function(event) {
        return event.touches && event.touches.length > 1;
    },

        isTouchEvent: function(evt) {
        return ("" + evt.type).indexOf("touch") === 0 || (
                "pointerType" in evt && (
                     evt.pointerType === evt.MSPOINTER_TYPE_MOUSE /*IE10 pointer*/ ||
                     evt.pointerType === "touch" /*W3C pointer*/));
    },

        isLeftClick: function(event) {
        return (((event.which) && (event.which == 1)) ||
                ((event.button) && (event.button == 1)));
    },

         isRightClick: function(event) {
        return (((event.which) && (event.which == 3)) ||
                ((event.button) && (event.button == 2)));
    },
     
        stop: function(event, allowDefault) {
        
        if (!allowDefault) { 
            OpenLayers.Event.preventDefault(event);
        }
                
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

        preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

        findElement: function(event, tagName) {
        var element = OpenLayers.Event.element(event);
        while (element.parentNode && (!element.tagName ||
              (element.tagName.toUpperCase() != tagName.toUpperCase()))){
            element = element.parentNode;
        }
        return element;
    },

        observe: function(elementParam, name, observer, useCapture) {
        var element = OpenLayers.Util.getElement(elementParam);
        useCapture = useCapture || false;

        if (name == 'keypress' &&
           (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
           || element.attachEvent)) {
            name = 'keydown';
        }
        if (!this.observers) {
            this.observers = {};
        }
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = OpenLayers.Util.createUniqueID(idPrefix);
        }

        var cacheID = element._eventCacheID;
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },

        stopObservingElement: function(elementParam) {
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        this._removeElementObservers(OpenLayers.Event.observers[cacheID]);
    },

        _removeElementObservers: function(elementObservers) {
        if (elementObservers) {
            for(var i = elementObservers.length-1; i >= 0; i--) {
                var entry = elementObservers[i];
                OpenLayers.Event.stopObserving.apply(this, [
                    entry.element, entry.name, entry.observer, entry.useCapture
                ]);
            }
        }
    },

        stopObserving: function(elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
    
        var element = OpenLayers.Util.getElement(elementParam);
        var cacheID = element._eventCacheID;

        if (name == 'keypress') {
            if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                 element.detachEvent) {
              name = 'keydown';
            }
        }
        var foundEntry = false;
        var elementObservers = OpenLayers.Event.observers[cacheID];
        if (elementObservers) {
            var i=0;
            while(!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
    
                if ((cacheEntry.name == name) &&
                    (cacheEntry.observer == observer) &&
                    (cacheEntry.useCapture == useCapture)) {
    
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete OpenLayers.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break; 
                }
                i++;           
            }
        }
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
        unloadCache: function() {
        if (OpenLayers.Event && OpenLayers.Event.observers) {
            for (var cacheID in OpenLayers.Event.observers) {
                var elementObservers = OpenLayers.Event.observers[cacheID];
                OpenLayers.Event._removeElementObservers.apply(this, 
                                                           [elementObservers]);
            }
            OpenLayers.Event.observers = false;
        }
    },

    CLASS_NAME: "OpenLayers.Event"
};

/* prevent memory leaks in IE */
OpenLayers.Event.observe(window, 'unload', OpenLayers.Event.unloadCache, false);

OpenLayers.Events = OpenLayers.Class({

        BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick", "rightclick", "dblrightclick",
        "resize", "focus", "blur",
        "touchstart", "touchmove", "touchend",
        "keydown"
    ],
    
        TOUCH_MODEL_POINTER: "pointer",

        TOUCH_MODEL_MSPOINTER: "MSPointer",

        TOUCH_MODEL_TOUCH: "touch",

        listeners: null,

        object: null,

        element: null,

        eventHandler: null,

        fallThrough: null,

        includeXY: false,      
    
        extensions: null,
    
        extensionCount: null,

        clearMouseListener: null,

        initialize: function (object, element, eventTypes, fallThrough, options) {
        OpenLayers.Util.extend(this, options);
        this.object     = object;
        this.fallThrough = fallThrough;
        this.listeners  = {};
        this.extensions = {};
        this.extensionCount = {};
        this._pointerTouches = [];
        if (element != null) {
            this.attachToElement(element);
        }
    },

        destroy: function () {
        for (var e in this.extensions) {
            if (typeof this.extensions[e] !== "boolean") {
                this.extensions[e].destroy();
            }
        }
        this.extensions = null;
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
            if(this.element.hasScrollEvent) {
                OpenLayers.Event.stopObserving(
                    window, "scroll", this.clearMouseListener
                );
            }
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

        addEventType: function(eventName) {
    },

        attachToElement: function (element) {
        if (this.element) {
            OpenLayers.Event.stopObservingElement(this.element);
        } else {
            this.eventHandler = OpenLayers.Function.bindAsEventListener(
                this.handleBrowserEvent, this
            );
            this.clearMouseListener = OpenLayers.Function.bind(
                this.clearMouseCache, this
            );
        }
        this.element = element;
        var touchModel = this.getTouchModel();
        var type;
        for (var i = 0, len = this.BROWSER_EVENTS.length; i < len; i++) {
            type = this.BROWSER_EVENTS[i];
            OpenLayers.Event.observe(element, type, this.eventHandler
            );
            if ((touchModel === this.TOUCH_MODEL_POINTER ||
                    touchModel === this.TOUCH_MODEL_MSPOINTER) &&
                    type.indexOf('touch') === 0) {
                this.addPointerTouchListener(element, type, this.eventHandler);
            }
        }
        OpenLayers.Event.observe(element, "dragstart", OpenLayers.Event.stop);
    },
    
        on: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.register(type, object.scope, object[type]);
            }
        }
    },

        register: function (type, obj, func, priority) {
        if (type in OpenLayers.Events && !this.extensions[type]) {
            this.extensions[type] = new OpenLayers.Events[type](this);
        }
        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (!listeners) {
                listeners = [];
                this.listeners[type] = listeners;
                this.extensionCount[type] = 0;
            }
            var listener = {obj: obj, func: func};
            if (priority) {
                listeners.splice(this.extensionCount[type], 0, listener);
                if (typeof priority === "object" && priority.extension) {
                    this.extensionCount[type]++;
                }
            } else {
                listeners.push(listener);
            }
        }
    },

        registerPriority: function (type, obj, func) {
        this.register(type, obj, func, true);
    },
    
        un: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },

        unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i=0, len=listeners.length; i<len; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

        remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },

        triggerEvent: function (type, evt) {
        var listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            return undefined;
        }
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if(!evt.type) {
            evt.type = type;
        }
        listeners = listeners.slice();
        var continueChain;
        for (var i=0, len=listeners.length; i<len; i++) {
            var callback = listeners[i];
            continueChain = callback.func.apply(callback.obj, [evt]);

            if ((continueChain != undefined) && (continueChain == false)) {
                break;
            }
        }
        if (!this.fallThrough) {           
            OpenLayers.Event.stop(evt, true);
        }
        return continueChain;
    },

        handleBrowserEvent: function (evt) {
        var type = evt.type, listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            return;
        }
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i=0; i<num; ++i) {
                touch = this.getTouchClientXY(touches[i]);
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        if (this.includeXY) {
            evt.xy = this.getMousePosition(evt);
        } 
        this.triggerEvent(type, evt);
    },
    
        getTouchClientXY: function (evt) {
        var win = window.olMockWin || window,
            winPageX = win.pageXOffset,
            winPageY = win.pageYOffset,
            x = evt.clientX,
            y = evt.clientY;
        
        if (evt.pageY === 0 && Math.floor(y) > Math.floor(evt.pageY) ||
            evt.pageX === 0 && Math.floor(x) > Math.floor(evt.pageX)) {
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < (evt.pageY - winPageY) || x < (evt.pageX - winPageX) ) {
            x = evt.pageX - winPageX;
            y = evt.pageY - winPageY;
        }
        
        evt.olClientX = x;
        evt.olClientY = y;
        
        return {
            clientX: x,
            clientY: y
        };
    },
    
        clearMouseCache: function() { 
        this.element.scrolls = null;
        this.element.lefttop = null;
        this.element.offsets = null;
    },      

        getMousePosition: function (evt) {
        if (!this.includeXY) {
            this.clearMouseCache();
        } else if (!this.element.hasScrollEvent) {
            OpenLayers.Event.observe(window, "scroll", this.clearMouseListener);
            this.element.hasScrollEvent = true;
        }
        
        if (!this.element.scrolls) {
            var viewportElement = OpenLayers.Util.getViewportElement();
            this.element.scrolls = [
                window.pageXOffset || viewportElement.scrollLeft,
                window.pageYOffset || viewportElement.scrollTop
            ];
        }

        if (!this.element.lefttop) {
            this.element.lefttop = [
                (document.documentElement.clientLeft || 0),
                (document.documentElement.clientTop  || 0)
            ];
        }
        
        if (!this.element.offsets) {
            this.element.offsets = OpenLayers.Util.pagePosition(this.element);
        }

        return new OpenLayers.Pixel(
            (evt.clientX + this.element.scrolls[0]) - this.element.offsets[0]
                         - this.element.lefttop[0], 
            (evt.clientY + this.element.scrolls[1]) - this.element.offsets[1]
                         - this.element.lefttop[1]
        ); 
    },

        getTouchModel: function() {
        if (!("_TOUCH_MODEL" in OpenLayers.Events)) {
            OpenLayers.Events._TOUCH_MODEL =
                    (window.PointerEvent && "pointer") ||
                    (window.MSPointerEvent && "MSPointer") ||
                    (("ontouchdown" in document) && "touch") ||
                    null;
        }
        return OpenLayers.Events._TOUCH_MODEL;
    },

        addPointerTouchListener: function (element, type, handler) {
        var eventHandler = this.eventHandler;
        var touches = this._pointerTouches;

        function pointerHandler(evt) {
            handler(OpenLayers.Util.applyDefaults({
                stopPropagation: function() {
                    for (var i=touches.length-1; i>=0; --i) {
                        touches[i].stopPropagation();
                    }
                },
                preventDefault: function() {
                    for (var i=touches.length-1; i>=0; --i) {
                        touches[i].preventDefault();
                    }
                },
                type: type
            }, evt));
        }

        switch (type) {
            case 'touchstart':
                return this.addPointerTouchListenerStart(element, type, pointerHandler);
            case 'touchend':
                return this.addPointerTouchListenerEnd(element, type, pointerHandler);
            case 'touchmove':
                return this.addPointerTouchListenerMove(element, type, pointerHandler);
            default:
                throw 'Unknown touch event type';
        }
    },

        addPointerTouchListenerStart: function(element, type, handler) {
        var touches = this._pointerTouches;

        var cb = function(e) {
            if (!OpenLayers.Event.isTouchEvent(e)) {
                return;
            }

            var alreadyInArray = false;
            for (var i=0, ii=touches.length; i<ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    alreadyInArray = true;
                    break;
                }
            }
            if (!alreadyInArray) {
                touches.push(e);
            }

            e.touches = touches.slice();
            handler(e);
        };

        OpenLayers.Event.observe(element,
                this.getTouchModel() === this.TOUCH_MODEL_MSPOINTER ?
                        'MSPointerDown' : 'pointerdown',
                cb);
        var internalCb = function (e) {
            if (!OpenLayers.Event.isTouchEvent(e)) {
            	return;
            }

            var up = false;
            for (var i = 0, ii = touches.length; i < ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    if (this.clientWidth != 0 && this.clientHeight != 0) {
                        if ((Math.ceil(e.clientX) >= this.clientWidth || Math.ceil(e.clientY) >= this.clientHeight)) {
                            touches.splice(i, 1);
                        }
                    }
                    break;
                }
            }
        };
        OpenLayers.Event.observe(element,
                this.getTouchModel() === this.TOUCH_MODEL_MSPOINTER ?
                        'MSPointerOut' : 'pointerout',
                internalCb);
    },

        addPointerTouchListenerMove: function (element, type, handler) {
        var touches = this._pointerTouches;
        var cb = function(e) {
            if (!OpenLayers.Event.isTouchEvent(e)) {
                return;
            }

            if (touches.length == 1 && touches[0].pageX == e.pageX &&
                    touches[0].pageY == e.pageY) {
                return;
            }
            for (var i=0, ii=touches.length; i<ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    touches[i] = e;
                    break;
                }
            }

            e.touches = touches.slice();
            handler(e);
        };

        OpenLayers.Event.observe(element,
                this.getTouchModel() === this.TOUCH_MODEL_MSPOINTER ?
                        'MSPointerMove' : 'pointermove',
                cb);
    },

        addPointerTouchListenerEnd: function (element, type, handler) {
        var touches = this._pointerTouches;

        var cb = function(e) {
            if (!OpenLayers.Event.isTouchEvent(e)) {
            	return;
            }

            for (var i=0, ii=touches.length; i<ii; ++i) {
                if (touches[i].pointerId == e.pointerId) {
                    touches.splice(i, 1);
                    break;
                }
            }
            
            e.touches = touches.slice();
            handler(e);
        };

        OpenLayers.Event.observe(element,
                this.getTouchModel() === this.TOUCH_MODEL_MSPOINTER ?
                        'MSPointerUp' : 'pointerup',
                cb);
    },

    CLASS_NAME: "OpenLayers.Events"
});
