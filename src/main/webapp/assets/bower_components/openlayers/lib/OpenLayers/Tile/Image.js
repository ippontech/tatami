/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Tile.Image = OpenLayers.Class(OpenLayers.Tile, {

    
        url: null,
    
        imgDiv: null,
    
        imageReloadAttempts: null,
    
        layerAlphaHack: null,
    
        asyncRequestId: null,
    
        maxGetUrlLength: null,

        canvasContext: null,
    
        crossOriginKeyword: null,

    
        destroy: function() {
        if (this.imgDiv)  {
            this.clear();
            this.imgDiv = null;
            this.frame = null;
        }
        this.asyncRequestId = null;
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
    },
    
        draw: function() {
        var shouldDraw = OpenLayers.Tile.prototype.draw.apply(this, arguments);
        if (shouldDraw) {
            if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
                this.bounds = this.getBoundsFromBaseLayer(this.position);
            }
            if (this.isLoading) {
                this._loadEvent = "reload";
            } else {
                this.isLoading = true;
                this._loadEvent = "loadstart";
            }
            this.renderTile();
            this.positionTile();
        } else if (shouldDraw === false) {
            this.unload();
        }
        return shouldDraw;
    },
    
        renderTile: function() {
        if (this.layer.async) {
            var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
            this.layer.getURLasync(this.bounds, function(url) {
                if (id == this.asyncRequestId) {
                    this.url = url;
                    this.initImage();
                }
            }, this);
        } else {
            this.url = this.layer.getURL(this.bounds);
            this.initImage();
        }
    },

        positionTile: function() {
        var style = this.getTile().style,
            size = this.frame ? this.size :
                this.layer.getImageSize(this.bounds),
            ratio = 1;
        if (this.layer instanceof OpenLayers.Layer.Grid) {
            ratio = this.layer.getServerResolution() / this.layer.map.getResolution();
        }
        style.left = this.position.x + "px";
        style.top = this.position.y + "px";
        style.width = Math.round(ratio * size.w) + "px";
        style.height = Math.round(ratio * size.h) + "px";
    },

        clear: function() {
        OpenLayers.Tile.prototype.clear.apply(this, arguments);
        var img = this.imgDiv;
        if (img) {
            var tile = this.getTile();
            if (tile.parentNode === this.layer.div) {
                this.layer.div.removeChild(tile);
            }
            this.setImgSrc();
            if (this.layerAlphaHack === true) {
                img.style.filter = "";
            }
            OpenLayers.Element.removeClass(img, "olImageLoadError");
        }
        this.canvasContext = null;
    },
    
        getImage: function() {
        if (!this.imgDiv) {
            this.imgDiv = OpenLayers.Tile.Image.IMAGE.cloneNode(false);

            var style = this.imgDiv.style;
            if (this.frame) {
                var left = 0, top = 0;
                if (this.layer.gutter) {
                    left = this.layer.gutter / this.layer.tileSize.w * 100;
                    top = this.layer.gutter / this.layer.tileSize.h * 100;
                }
                style.left = -left + "%";
                style.top = -top + "%";
                style.width = (2 * left + 100) + "%";
                style.height = (2 * top + 100) + "%";
            }
            style.visibility = "hidden";
            style.opacity = 0;
            if (this.layer.opacity < 1) {
                style.filter = 'alpha(opacity=' +
                               (this.layer.opacity * 100) +
                               ')';
            }
            style.position = "absolute";
            if (this.layerAlphaHack) {
                style.paddingTop = style.height;
                style.height = "0";
                style.width = "100%";
            }
            if (this.frame) {
                this.frame.appendChild(this.imgDiv);
            }
        }

        return this.imgDiv;
    },
    
        setImage: function(img) {
        this.imgDiv = img;
    },

        initImage: function() {
        if (!this.url && !this.imgDiv) {
            this.isLoading = false;
            return;
        }
        this.events.triggerEvent('beforeload');
        this.layer.div.appendChild(this.getTile());
        this.events.triggerEvent(this._loadEvent);
        var img = this.getImage();
        var src = img.getAttribute('src') || '';
        if (this.url && OpenLayers.Util.isEquivalentUrl(src, this.url)) {
            this._loadTimeout = window.setTimeout(
                OpenLayers.Function.bind(this.onImageLoad, this), 0
            );
        } else {
            this.stopLoading();
            if (this.crossOriginKeyword) {
                img.removeAttribute("crossorigin");
            }
            OpenLayers.Event.observe(img, "load",
                OpenLayers.Function.bind(this.onImageLoad, this)
            );
            OpenLayers.Event.observe(img, "error",
                OpenLayers.Function.bind(this.onImageError, this)
            );
            this.imageReloadAttempts = 0;
            this.setImgSrc(this.url);
        }
    },
    
        setImgSrc: function(url) {
        var img = this.imgDiv;
        if (url) {
            img.style.visibility = 'hidden';
            img.style.opacity = 0;
            if (this.crossOriginKeyword) {
                if (url.substr(0, 5) !== 'data:') {
                    img.setAttribute("crossorigin", this.crossOriginKeyword);
                } else {
                    img.removeAttribute("crossorigin");
                }
            }
            img.src = url;
        } else {
            this.stopLoading();
            this.imgDiv = null;
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        }
    },
    
        getTile: function() {
        return this.frame ? this.frame : this.getImage();
    },

        createBackBuffer: function() {
        if (!this.imgDiv || this.isLoading) {
            return;
        }
        var backBuffer;
        if (this.frame) {
            backBuffer = this.frame.cloneNode(false);
            backBuffer.appendChild(this.imgDiv);
        } else {
            backBuffer = this.imgDiv;
        }
        this.imgDiv = null;
        return backBuffer;
    },

        onImageLoad: function() {
        var img = this.imgDiv;
        this.stopLoading();
        img.style.visibility = 'inherit';
        img.style.opacity = this.layer.opacity;
        this.isLoading = false;
        this.canvasContext = null;
        this.events.triggerEvent("loadend");

        if (this.layerAlphaHack === true) {
            img.style.filter =
                "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                img.src + "', sizingMethod='scale')";
        }
    },
    
        onImageError: function() {
        var img = this.imgDiv;
        if (img.src != null) {
            this.imageReloadAttempts++;
            if (this.imageReloadAttempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
                this.setImgSrc(this.layer.getURL(this.bounds));
            } else {
                OpenLayers.Element.addClass(img, "olImageLoadError");
                this.events.triggerEvent("loaderror");
                this.onImageLoad();
            }
        }
    },
    
        stopLoading: function() {
        OpenLayers.Event.stopObservingElement(this.imgDiv);
        window.clearTimeout(this._loadTimeout);
        delete this._loadTimeout;
    },

        getCanvasContext: function() {
        if (OpenLayers.CANVAS_SUPPORTED && this.imgDiv && !this.isLoading) {
            if (!this.canvasContext) {
                var canvas = document.createElement("canvas");
                canvas.width = this.size.w;
                canvas.height = this.size.h;
                this.canvasContext = canvas.getContext("2d");
                this.canvasContext.drawImage(this.imgDiv, 0, 0);
            }
            return this.canvasContext;
        }
    },

    CLASS_NAME: "OpenLayers.Tile.Image"

});

OpenLayers.Tile.Image.IMAGE = (function() {
    var img = new Image();
    img.className = "olTileImage";
    img.galleryImg = "no";
    return img;
}());

