/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Zoom = OpenLayers.Class(OpenLayers.Control, {
    
        zoomInText: "+",

        zoomInId: "olZoomInLink",

        zoomOutText: "\u2212",

        zoomOutId: "olZoomOutLink",

        draw: function() {
        var div = OpenLayers.Control.prototype.draw.apply(this),
            links = this.getOrCreateLinks(div),
            zoomIn = links.zoomIn,
            zoomOut = links.zoomOut,
            eventsInstance = this.map.events;
        
        if (zoomOut.parentNode !== div) {
            eventsInstance = this.events;
            eventsInstance.attachToElement(zoomOut.parentNode);
        }
        eventsInstance.register("buttonclick", this, this.onZoomClick);
        
        this.zoomInLink = zoomIn;
        this.zoomOutLink = zoomOut;
        return div;
    },
    
        getOrCreateLinks: function(el) {
        var zoomIn = document.getElementById(this.zoomInId),
            zoomOut = document.getElementById(this.zoomOutId);
        if (!zoomIn) {
            zoomIn = document.createElement("a");
            zoomIn.href = "#zoomIn";
            zoomIn.appendChild(document.createTextNode(this.zoomInText));
            zoomIn.className = "olControlZoomIn";
            el.appendChild(zoomIn);
        }
        OpenLayers.Element.addClass(zoomIn, "olButton");
        if (!zoomOut) {
            zoomOut = document.createElement("a");
            zoomOut.href = "#zoomOut";
            zoomOut.appendChild(document.createTextNode(this.zoomOutText));
            zoomOut.className = "olControlZoomOut";
            el.appendChild(zoomOut);
        }
        OpenLayers.Element.addClass(zoomOut, "olButton");
        return {
            zoomIn: zoomIn, zoomOut: zoomOut
        };
    },
    
        onZoomClick: function(evt) {
        var button = evt.buttonElement;
        if (button === this.zoomInLink) {
            this.map.zoomIn();
        } else if (button === this.zoomOutLink) {
            this.map.zoomOut();
        }
    },

        destroy: function() {
        if (this.map) {
            this.map.events.unregister("buttonclick", this, this.onZoomClick);
        }
        delete this.zoomInLink;
        delete this.zoomOutLink;
        OpenLayers.Control.prototype.destroy.apply(this);
    },

    CLASS_NAME: "OpenLayers.Control.Zoom"
});
