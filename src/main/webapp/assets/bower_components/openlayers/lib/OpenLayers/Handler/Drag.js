/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.Drag = OpenLayers.Class(OpenLayers.Handler, {
  
        started: false,

        stopDown: true,

        dragging: false,

        last: null,

        start: null,

        lastMoveEvt: null,

        oldOnselectstart: null,
    
        interval: 0,
    
        timeoutId: null,
    
        documentDrag: false,
    
        documentEvents: null,

        initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        
        if (this.documentDrag === true) {
            var me = this;
            this._docMove = function(evt) {
                me.mousemove({
                    xy: {x: evt.clientX, y: evt.clientY},
                    element: document
                });
            };
            this._docUp = function(evt) {
                me.mouseup({xy: {x: evt.clientX, y: evt.clientY}});
            };
        }
    },

    
        dragstart: function (evt) {
        var propagate = true;
        this.dragging = false;
        if (this.checkModifiers(evt) &&
               this._pointerId == evt.pointerId &&
               (OpenLayers.Event.isLeftClick(evt) ||
                OpenLayers.Event.isSingleTouch(evt))) {
            this.started = true;
            this.start = evt.xy;
            this.last = evt.xy;
            OpenLayers.Element.addClass(
                this.map.viewPortDiv, "olDragDown"
            );
            this.down(evt);
            this.callback("down", [evt.xy]);
            OpenLayers.Event.preventDefault(evt);

            if(!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart ?
                    document.onselectstart : OpenLayers.Function.True;
            }
            document.onselectstart = OpenLayers.Function.False;

            propagate = !this.stopDown;
        } else {
            delete this._pointerId;
            this.started = false;
            this.start = null;
            this.last = null;
        }
        return propagate;
    },

        dragmove: function (evt) {
        this.lastMoveEvt = evt;
        if (this.started && this._pointerId == evt.pointerId &&
            !this.timeoutId && (evt.xy.x != this.last.x ||
                                evt.xy.y != this.last.y)) {
            if(this.documentDrag === true && this.documentEvents) {
                if(evt.element === document) {
                    this.adjustXY(evt);
                    this.setEvent(evt);
                } else {
                    this.removeDocumentEvents();
                }
            }
            if (this.interval > 0) {
                this.timeoutId = setTimeout(
                    OpenLayers.Function.bind(this.removeTimeout, this),
                    this.interval);
            }
            this.dragging = true;

            this.move(evt);
            this.callback("move", [evt.xy]);
            if(!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart;
                document.onselectstart = OpenLayers.Function.False;
            }
            this.last = evt.xy;
        }
        return true;
    },

        dragend: function (evt) {
        if (this.started && this._pointerId == evt.pointerId) {
            if(this.documentDrag === true && this.documentEvents) {
                this.adjustXY(evt);
                this.removeDocumentEvents();
            }
            var dragged = (this.start != this.last);
            this.started = false;
            this.dragging = false;
            delete this._pointerId;
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, "olDragDown"
            );
            this.up(evt);
            this.callback("up", [evt.xy]);
            if(dragged) {
                this.callback("done", [evt.xy]);
            }
            document.onselectstart = this.oldOnselectstart;
        }
        return true;
    },

    
        down: function(evt) {
    },

        move: function(evt) {
    },

        up: function(evt) {
    },

        out: function(evt) {
    },

    
        mousedown: function(evt) {
        return this.dragstart(evt);
    },

        touchstart: function(evt) {
        this.startTouch();
        if (!("_pointerId" in this)) {
            this._pointerId = evt.pointerId;
        }
        return this.dragstart(evt);
    },

        mousemove: function(evt) {
        return this.dragmove(evt);
    },

        touchmove: function(evt) {
        return this.dragmove(evt);
    },

        removeTimeout: function() {
        this.timeoutId = null;
        if(this.dragging) {
            this.mousemove(this.lastMoveEvt);
        }
    },

        mouseup: function(evt) {
        return this.dragend(evt);
    },

        touchend: function(evt) {
        evt.xy = this.last;
        return this.dragend(evt);
    },

        mouseout: function (evt) {
        if (this.started && OpenLayers.Util.mouseLeft(evt, this.map.viewPortDiv)) {
            if(this.documentDrag === true) {
                this.addDocumentEvents();
            } else {
                var dragged = (this.start != this.last);
                this.started = false; 
                this.dragging = false;
                OpenLayers.Element.removeClass(
                    this.map.viewPortDiv, "olDragDown"
                );
                this.out(evt);
                this.callback("out", []);
                if(dragged) {
                    this.callback("done", [evt.xy]);
                }
                if(document.onselectstart) {
                    document.onselectstart = this.oldOnselectstart;
                }
            }
        }
        return true;
    },

        click: function (evt) {
        return (this.start == this.last);
    },

        activate: function() {
        var activated = false;
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            activated = true;
        }
        return activated;
    },

        deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.started = false;
            this.dragging = false;
            this.start = null;
            this.last = null;
            deactivated = true;
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, "olDragDown"
            );
        }
        return deactivated;
    },
    
        adjustXY: function(evt) {
        var pos = OpenLayers.Util.pagePosition(this.map.viewPortDiv);
        evt.xy.x -= pos[0];
        evt.xy.y -= pos[1];
    },
    
        addDocumentEvents: function() {
        OpenLayers.Element.addClass(document.body, "olDragDown");
        this.documentEvents = true;
        OpenLayers.Event.observe(document, "mousemove", this._docMove);
        OpenLayers.Event.observe(document, "mouseup", this._docUp);
    },
    
        removeDocumentEvents: function() {
        OpenLayers.Element.removeClass(document.body, "olDragDown");
        this.documentEvents = false;
        OpenLayers.Event.stopObserving(document, "mousemove", this._docMove);
        OpenLayers.Event.stopObserving(document, "mouseup", this._docUp);
    },

    CLASS_NAME: "OpenLayers.Handler.Drag"
});
