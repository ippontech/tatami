/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Popup.FramedCloud = 
  OpenLayers.Class(OpenLayers.Popup.Framed, {

        contentDisplayClass: "olFramedCloudPopupContent",

        autoSize: true,

        panMapIfOutOfView: true,

        imageSize: new OpenLayers.Size(1276, 736),

        isAlphaImage: false,

        fixedRelativePosition: false,

        positionBlocks: {
        "tl": {
            'offset': new OpenLayers.Pixel(44, 0),
            'padding': new OpenLayers.Bounds(8, 40, 8, 9),
            'blocks': [
                { // top-left
                    size: new OpenLayers.Size('auto', 'auto'),
                    anchor: new OpenLayers.Bounds(0, 51, 22, 0),
                    position: new OpenLayers.Pixel(0, 0)
                },
                { //top-right
                    size: new OpenLayers.Size(22, 'auto'),
                    anchor: new OpenLayers.Bounds(null, 50, 0, 0),
                    position: new OpenLayers.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new OpenLayers.Size('auto', 19),
                    anchor: new OpenLayers.Bounds(0, 32, 22, null),
                    position: new OpenLayers.Pixel(0, -631)
                },
                { //bottom-right
                    size: new OpenLayers.Size(22, 18),
                    anchor: new OpenLayers.Bounds(null, 32, 0, null),
                    position: new OpenLayers.Pixel(-1238, -632)
                },
                { // stem
                    size: new OpenLayers.Size(81, 35),
                    anchor: new OpenLayers.Bounds(null, 0, 0, null),
                    position: new OpenLayers.Pixel(0, -688)
                }
            ]
        },
        "tr": {
            'offset': new OpenLayers.Pixel(-45, 0),
            'padding': new OpenLayers.Bounds(8, 40, 8, 9),
            'blocks': [
                { // top-left
                    size: new OpenLayers.Size('auto', 'auto'),
                    anchor: new OpenLayers.Bounds(0, 51, 22, 0),
                    position: new OpenLayers.Pixel(0, 0)
                },
                { //top-right
                    size: new OpenLayers.Size(22, 'auto'),
                    anchor: new OpenLayers.Bounds(null, 50, 0, 0),
                    position: new OpenLayers.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new OpenLayers.Size('auto', 19),
                    anchor: new OpenLayers.Bounds(0, 32, 22, null),
                    position: new OpenLayers.Pixel(0, -631)
                },
                { //bottom-right
                    size: new OpenLayers.Size(22, 19),
                    anchor: new OpenLayers.Bounds(null, 32, 0, null),
                    position: new OpenLayers.Pixel(-1238, -631)
                },
                { // stem
                    size: new OpenLayers.Size(81, 35),
                    anchor: new OpenLayers.Bounds(0, 0, null, null),
                    position: new OpenLayers.Pixel(-215, -687)
                }
            ]
        },
        "bl": {
            'offset': new OpenLayers.Pixel(45, 0),
            'padding': new OpenLayers.Bounds(8, 9, 8, 40),
            'blocks': [
                { // top-left
                    size: new OpenLayers.Size('auto', 'auto'),
                    anchor: new OpenLayers.Bounds(0, 21, 22, 32),
                    position: new OpenLayers.Pixel(0, 0)
                },
                { //top-right
                    size: new OpenLayers.Size(22, 'auto'),
                    anchor: new OpenLayers.Bounds(null, 21, 0, 32),
                    position: new OpenLayers.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new OpenLayers.Size('auto', 21),
                    anchor: new OpenLayers.Bounds(0, 0, 22, null),
                    position: new OpenLayers.Pixel(0, -629)
                },
                { //bottom-right
                    size: new OpenLayers.Size(22, 21),
                    anchor: new OpenLayers.Bounds(null, 0, 0, null),
                    position: new OpenLayers.Pixel(-1238, -629)
                },
                { // stem
                    size: new OpenLayers.Size(81, 33),
                    anchor: new OpenLayers.Bounds(null, null, 0, 0),
                    position: new OpenLayers.Pixel(-101, -674)
                }
            ]
        },
        "br": {
            'offset': new OpenLayers.Pixel(-44, 0),
            'padding': new OpenLayers.Bounds(8, 9, 8, 40),
            'blocks': [
                { // top-left
                    size: new OpenLayers.Size('auto', 'auto'),
                    anchor: new OpenLayers.Bounds(0, 21, 22, 32),
                    position: new OpenLayers.Pixel(0, 0)
                },
                { //top-right
                    size: new OpenLayers.Size(22, 'auto'),
                    anchor: new OpenLayers.Bounds(null, 21, 0, 32),
                    position: new OpenLayers.Pixel(-1238, 0)
                },
                { //bottom-left
                    size: new OpenLayers.Size('auto', 21),
                    anchor: new OpenLayers.Bounds(0, 0, 22, null),
                    position: new OpenLayers.Pixel(0, -629)
                },
                { //bottom-right
                    size: new OpenLayers.Size(22, 21),
                    anchor: new OpenLayers.Bounds(null, 0, 0, null),
                    position: new OpenLayers.Pixel(-1238, -629)
                },
                { // stem
                    size: new OpenLayers.Size(81, 33),
                    anchor: new OpenLayers.Bounds(0, null, null, 0),
                    position: new OpenLayers.Pixel(-311, -674)
                }
            ]
        }
    },

        minSize: new OpenLayers.Size(105, 10),

        maxSize: new OpenLayers.Size(1200, 660),

        initialize:function(id, lonlat, contentSize, contentHTML, anchor, closeBox, 
                        closeBoxCallback) {

        this.imageSrc = OpenLayers.Util.getImageLocation('cloud-popup-relative.png');
        OpenLayers.Popup.Framed.prototype.initialize.apply(this, arguments);
        this.contentDiv.className = this.contentDisplayClass;
    },

    CLASS_NAME: "OpenLayers.Popup.FramedCloud"
});
