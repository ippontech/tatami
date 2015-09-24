/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.Box = OpenLayers.Class(OpenLayers.Handler, {

        dragHandler: null,

        boxDivClassName: 'olHandlerBoxZoomBox',
    
        boxOffsets: null,

        initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.dragHandler = new OpenLayers.Handler.Drag(
            this, 
            {
                down: this.startBox, 
                move: this.moveBox, 
                out: this.removeBox,
                up: this.endBox
            }, 
            {keyMask: this.keyMask}
        );
    },

        destroy: function() {
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }            
    },

        setMap: function (map) {
        OpenLayers.Handler.prototype.setMap.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.setMap(map);
        }
    },

        startBox: function (xy) {
        this.callback("start", []);
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox', {
            x: -9999, y: -9999
        });
        this.zoomBox.className = this.boxDivClassName;                                         
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        
        this.map.viewPortDiv.appendChild(this.zoomBox);
        
        OpenLayers.Element.addClass(
            this.map.viewPortDiv, "olDrawBox"
        );
    },

        moveBox: function (xy) {
        var startX = this.dragHandler.start.x;
        var startY = this.dragHandler.start.y;
        var deltaX = Math.abs(startX - xy.x);
        var deltaY = Math.abs(startY - xy.y);

        var offset = this.getBoxOffsets();
        this.zoomBox.style.width = (deltaX + offset.width + 1) + "px";
        this.zoomBox.style.height = (deltaY + offset.height + 1) + "px";
        this.zoomBox.style.left = (xy.x < startX ?
            startX - deltaX - offset.left : startX - offset.left) + "px";
        this.zoomBox.style.top = (xy.y < startY ?
            startY - deltaY - offset.top : startY - offset.top) + "px";
    },

        endBox: function(end) {
        var result;
        if (Math.abs(this.dragHandler.start.x - end.x) > 5 ||    
            Math.abs(this.dragHandler.start.y - end.y) > 5) {   
            var start = this.dragHandler.start;
            var top = Math.min(start.y, end.y);
            var bottom = Math.max(start.y, end.y);
            var left = Math.min(start.x, end.x);
            var right = Math.max(start.x, end.x);
            result = new OpenLayers.Bounds(left, bottom, right, top);
        } else {
            result = this.dragHandler.start.clone(); // i.e. OL.Pixel
        } 
        this.removeBox();

        this.callback("done", [result]);
    },

        removeBox: function() {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
        this.boxOffsets = null;
        OpenLayers.Element.removeClass(
            this.map.viewPortDiv, "olDrawBox"
        );

    },

        activate: function () {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragHandler.activate();
            return true;
        } else {
            return false;
        }
    },

        deactivate: function () {
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            if (this.dragHandler.deactivate()) {
                if (this.zoomBox) {
                    this.removeBox();
                }
            }
            return true;
        } else {
            return false;
        }
    },
    
        getBoxOffsets: function() {
        if (!this.boxOffsets) {
            var testDiv = document.createElement("div");
            testDiv.style.position = "absolute";
            testDiv.style.border = "1px solid black";
            testDiv.style.width = "3px";
            document.body.appendChild(testDiv);
            var w3cBoxModel = testDiv.clientWidth == 3;
            document.body.removeChild(testDiv);
            
            var left = parseInt(OpenLayers.Element.getStyle(this.zoomBox,
                "border-left-width"));
            var right = parseInt(OpenLayers.Element.getStyle(
                this.zoomBox, "border-right-width"));
            var top = parseInt(OpenLayers.Element.getStyle(this.zoomBox,
                "border-top-width"));
            var bottom = parseInt(OpenLayers.Element.getStyle(
                this.zoomBox, "border-bottom-width"));
            this.boxOffsets = {
                left: left,
                right: right,
                top: top,
                bottom: bottom,
                width: w3cBoxModel === false ? left + right : 0,
                height: w3cBoxModel === false ? top + bottom : 0
            };
        }
        return this.boxOffsets;
    },
  
    CLASS_NAME: "OpenLayers.Handler.Box"
});
