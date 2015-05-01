/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Navigation = OpenLayers.Class(OpenLayers.Control, {

        dragPan: null,

        dragPanOptions: null,

        pinchZoom: null,

        pinchZoomOptions: null,

        documentDrag: false,

        zoomBox: null,

        zoomBoxEnabled: true, 

        zoomWheelEnabled: true,
    
        mouseWheelOptions: null,

        handleRightClicks: false,

        zoomBoxKeyMask: OpenLayers.Handler.MOD_SHIFT,
    
        autoActivate: true,

        initialize: function(options) {
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

        destroy: function() {
        this.deactivate();

        if (this.dragPan) {
            this.dragPan.destroy();
        }
        this.dragPan = null;

        if (this.zoomBox) {
            this.zoomBox.destroy();
        }
        this.zoomBox = null;

        if (this.pinchZoom) {
            this.pinchZoom.destroy();
        }
        this.pinchZoom = null;

        OpenLayers.Control.prototype.destroy.apply(this,arguments);
    },
    
        activate: function() {
        this.dragPan.activate();
        if (this.zoomWheelEnabled) {
            this.handlers.wheel.activate();
        }    
        this.handlers.click.activate();
        if (this.zoomBoxEnabled) {
            this.zoomBox.activate();
        }
        if (this.pinchZoom) {
            this.pinchZoom.activate();
        }
        return OpenLayers.Control.prototype.activate.apply(this,arguments);
    },

        deactivate: function() {
        if (this.pinchZoom) {
            this.pinchZoom.deactivate();
        }
        this.zoomBox.deactivate();
        this.dragPan.deactivate();
        this.handlers.click.deactivate();
        this.handlers.wheel.deactivate();
        return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
    },
    
        draw: function() {
        if (this.handleRightClicks) {
            this.map.viewPortDiv.oncontextmenu = OpenLayers.Function.False;
        }

        var clickCallbacks = { 
            'click': this.defaultClick,
            'dblclick': this.defaultDblClick, 
            'dblrightclick': this.defaultDblRightClick 
        };
        var clickOptions = {
            'double': true, 
            'stopDouble': true
        };
        this.handlers.click = new OpenLayers.Handler.Click(
            this, clickCallbacks, clickOptions
        );
        this.dragPan = new OpenLayers.Control.DragPan(
            OpenLayers.Util.extend({
                map: this.map,
                documentDrag: this.documentDrag
            }, this.dragPanOptions)
        );
        this.zoomBox = new OpenLayers.Control.ZoomBox(
                    {map: this.map, keyMask: this.zoomBoxKeyMask});
        this.dragPan.draw();
        this.zoomBox.draw();
        var wheelOptions = this.map.fractionalZoom ? {} : {
            cumulative: false,
            interval: 50,
            maxDelta: 6
        };
        this.handlers.wheel = new OpenLayers.Handler.MouseWheel(
            this, {up : this.wheelUp, down: this.wheelDown},
            OpenLayers.Util.extend(wheelOptions, this.mouseWheelOptions)
        );
        if (OpenLayers.Control.PinchZoom) {
            this.pinchZoom = new OpenLayers.Control.PinchZoom(
                OpenLayers.Util.extend(
                    {map: this.map}, this.pinchZoomOptions));
        }
    },

        defaultClick: function (evt) {
        if (evt.lastTouches && evt.lastTouches.length == 2) {
            this.map.zoomOut();
        }
    },

        defaultDblClick: function (evt) {
        this.map.zoomTo(this.map.zoom + 1, evt.xy);
    },

        defaultDblRightClick: function (evt) {
        this.map.zoomTo(this.map.zoom - 1, evt.xy);
    },
    
        wheelChange: function(evt, deltaZ) {
        if (!this.map.fractionalZoom) {
            deltaZ =  Math.round(deltaZ);
        }
        var currentZoom = this.map.getZoom(),
            newZoom = currentZoom + deltaZ;
        newZoom = Math.max(newZoom, 0);
        newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
        if (newZoom === currentZoom) {
            return;
        }
        this.map.zoomTo(newZoom, evt.xy);
    },

        wheelUp: function(evt, delta) {
        this.wheelChange(evt, delta || 1);
    },

        wheelDown: function(evt, delta) {
        this.wheelChange(evt, delta || -1);
    },
    
        disableZoomBox : function() {
        this.zoomBoxEnabled = false;
        this.zoomBox.deactivate();       
    },
    
        enableZoomBox : function() {
        this.zoomBoxEnabled = true;
        if (this.active) {
            this.zoomBox.activate();
        }    
    },
    
        
    disableZoomWheel : function() {
        this.zoomWheelEnabled = false;
        this.handlers.wheel.deactivate();       
    },
    
        
    enableZoomWheel : function() {
        this.zoomWheelEnabled = true;
        if (this.active) {
            this.handlers.wheel.activate();
        }    
    },

    CLASS_NAME: "OpenLayers.Control.Navigation"
});
