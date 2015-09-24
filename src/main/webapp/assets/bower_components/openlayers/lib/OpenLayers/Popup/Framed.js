/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Popup.Framed =
  OpenLayers.Class(OpenLayers.Popup.Anchored, {

        imageSrc: null,

        imageSize: null,

        isAlphaImage: false,

        positionBlocks: null,

        blocks: null,

        fixedRelativePosition: false,

        initialize:function(id, lonlat, contentSize, contentHTML, anchor, closeBox, 
                        closeBoxCallback) {

        OpenLayers.Popup.Anchored.prototype.initialize.apply(this, arguments);

        if (this.fixedRelativePosition) {
            this.updateRelativePosition();
            this.calculateRelativePosition = function(px) {
                return this.relativePosition;
            };
        }

        this.contentDiv.style.position = "absolute";
        this.contentDiv.style.zIndex = 1;

        if (closeBox) {
            this.closeDiv.style.zIndex = 1;
        }

        this.groupDiv.style.position = "absolute";
        this.groupDiv.style.top = "0px";
        this.groupDiv.style.left = "0px";
        this.groupDiv.style.height = "100%";
        this.groupDiv.style.width = "100%";
    },

        destroy: function() {
        this.imageSrc = null;
        this.imageSize = null;
        this.isAlphaImage = null;

        this.fixedRelativePosition = false;
        this.positionBlocks = null;
        for(var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];

            if (block.image) {
                block.div.removeChild(block.image);
            }
            block.image = null;

            if (block.div) {
                this.groupDiv.removeChild(block.div);
            }
            block.div = null;
        }
        this.blocks = null;

        OpenLayers.Popup.Anchored.prototype.destroy.apply(this, arguments);
    },

        setBackgroundColor:function(color) {
    },

        setBorder:function() {
    },

        setOpacity:function(opacity) {
    },

        setSize:function(contentSize) { 
        OpenLayers.Popup.Anchored.prototype.setSize.apply(this, arguments);

        this.updateBlocks();
    },

        updateRelativePosition: function() {
        this.padding = this.positionBlocks[this.relativePosition].padding;
        if (this.closeDiv) {
            var contentDivPadding = this.getContentDivPadding();

            this.closeDiv.style.right = contentDivPadding.right + 
                                        this.padding.right + "px";
            this.closeDiv.style.top = contentDivPadding.top + 
                                      this.padding.top + "px";
        }

        this.updateBlocks();
    },

        calculateNewPx:function(px) {
        var newPx = OpenLayers.Popup.Anchored.prototype.calculateNewPx.apply(
            this, arguments
        );

        newPx = newPx.offset(this.positionBlocks[this.relativePosition].offset);

        return newPx;
    },

        createBlocks: function() {
        this.blocks = [];
        var firstPosition = null;
        for(var key in this.positionBlocks) {
            firstPosition = key;
            break;
        }
        
        var position = this.positionBlocks[firstPosition];
        for (var i = 0; i < position.blocks.length; i++) {

            var block = {};
            this.blocks.push(block);

            var divId = this.id + '_FrameDecorationDiv_' + i;
            block.div = OpenLayers.Util.createDiv(divId, 
                null, null, null, "absolute", null, "hidden", null
            );

            var imgId = this.id + '_FrameDecorationImg_' + i;
            var imageCreator = 
                (this.isAlphaImage) ? OpenLayers.Util.createAlphaImageDiv
                                    : OpenLayers.Util.createImage;

            block.image = imageCreator(imgId, 
                null, this.imageSize, this.imageSrc, 
                "absolute", null, null, null
            );

            block.div.appendChild(block.image);
            this.groupDiv.appendChild(block.div);
        }
    },

        updateBlocks: function() {
        if (!this.blocks) {
            this.createBlocks();
        }
        
        if (this.size && this.relativePosition) {
            var position = this.positionBlocks[this.relativePosition];
            for (var i = 0; i < position.blocks.length; i++) {
    
                var positionBlock = position.blocks[i];
                var block = this.blocks[i];
                var l = positionBlock.anchor.left;
                var b = positionBlock.anchor.bottom;
                var r = positionBlock.anchor.right;
                var t = positionBlock.anchor.top;
                var w = (isNaN(positionBlock.size.w)) ? this.size.w - (r + l) 
                                                      : positionBlock.size.w;
    
                var h = (isNaN(positionBlock.size.h)) ? this.size.h - (b + t) 
                                                      : positionBlock.size.h;
    
                block.div.style.width = (w < 0 ? 0 : w) + 'px';
                block.div.style.height = (h < 0 ? 0 : h) + 'px';
    
                block.div.style.left = (l != null) ? l + 'px' : '';
                block.div.style.bottom = (b != null) ? b + 'px' : '';
                block.div.style.right = (r != null) ? r + 'px' : '';            
                block.div.style.top = (t != null) ? t + 'px' : '';
    
                block.image.style.left = positionBlock.position.x + 'px';
                block.image.style.top = positionBlock.position.y + 'px';
            }
    
            this.contentDiv.style.left = this.padding.left + "px";
            this.contentDiv.style.top = this.padding.top + "px";
        }
    },

    CLASS_NAME: "OpenLayers.Popup.Framed"
});
