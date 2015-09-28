/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.TouchNavigation = OpenLayers.Class(OpenLayers.Control, {

        dragPan: null,

        dragPanOptions: null,

        pinchZoom: null,

        pinchZoomOptions: null,

        clickHandlerOptions: null,

        documentDrag: false,

        autoActivate: true,

        initialize: function(options) {
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

        destroy: function() {
        this.deactivate();
        if(this.dragPan) {
            this.dragPan.destroy();
        }
        this.dragPan = null;
        if (this.pinchZoom) {
            this.pinchZoom.destroy();
            delete this.pinchZoom;
        }
        OpenLayers.Control.prototype.destroy.apply(this,arguments);
    },

        activate: function() {
        if(OpenLayers.Control.prototype.activate.apply(this,arguments)) {
            this.dragPan.activate();
            this.handlers.click.activate();
            this.pinchZoom.activate();
            return true;
        }
        return false;
    },

        deactivate: function() {
        if(OpenLayers.Control.prototype.deactivate.apply(this,arguments)) {
            this.dragPan.deactivate();
            this.handlers.click.deactivate();
            this.pinchZoom.deactivate();
            return true;
        }
        return false;
    },
    
        draw: function() {
        var clickCallbacks = {
            click: this.defaultClick,
            dblclick: this.defaultDblClick
        };
        var clickOptions = OpenLayers.Util.extend({
            "double": true,
            stopDouble: true,
            pixelTolerance: 2
        }, this.clickHandlerOptions);
        this.handlers.click = new OpenLayers.Handler.Click(
            this, clickCallbacks, clickOptions
        );
        this.dragPan = new OpenLayers.Control.DragPan(
            OpenLayers.Util.extend({
                map: this.map,
                documentDrag: this.documentDrag
            }, this.dragPanOptions)
        );
        this.dragPan.draw();
        this.pinchZoom = new OpenLayers.Control.PinchZoom(
            OpenLayers.Util.extend({map: this.map}, this.pinchZoomOptions)
        );
    },

        defaultClick: function (evt) {
        if(evt.lastTouches && evt.lastTouches.length == 2) {
            this.map.zoomOut();
        }
    },

        defaultDblClick: function (evt) {
        this.map.zoomTo(this.map.zoom + 1, evt.xy);
    },

    CLASS_NAME: "OpenLayers.Control.TouchNavigation"
});
