/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.DragPan = OpenLayers.Class(OpenLayers.Control, {

        type: OpenLayers.Control.TYPE_TOOL,
    
        panned: false,
    
        interval: 0,
    
        documentDrag: false,

        kinetic: null,

        enableKinetic: true,

        kineticInterval: 10,


        panMapStart: function() {
        if(this.kinetic) {
            this.kinetic.begin();
        }
    },

        panMap: function(xy) {
        if(this.kinetic) {
            this.kinetic.update(xy);
        }
        this.panned = true;
        this.map.pan(
            this.handler.last.x - xy.x,
            this.handler.last.y - xy.y,
            {dragging: true, animate: false}
        );
    },
    
        panMapDone: function(xy) {
        if(this.panned) {
            var res = null;
            if (this.kinetic) {
                res = this.kinetic.end(xy);
            }
            this.map.pan(
                this.handler.last.x - xy.x,
                this.handler.last.y - xy.y,
                {dragging: !!res, animate: false}
            );
            if (res) {
                var self = this;
                this.kinetic.move(res, function(x, y, end) {
                    self.map.pan(x, y, {dragging: !end, animate: false});
                });
            }
            this.panned = false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.DragPan"
});
