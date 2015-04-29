/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Tile.Image.IFrame = {

        blankImageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7",

        draw: function() {
        var draw = OpenLayers.Tile.Image.prototype.shouldDraw.call(this);
        if(draw) {
            var url = this.layer.getURL(this.bounds);

            var usedIFrame = this.useIFrame;
            this.useIFrame = this.maxGetUrlLength !== null &&
                             !this.layer.async &&
                             url.length > this.maxGetUrlLength;

            var fromIFrame = usedIFrame && !this.useIFrame;
            var toIFrame = !usedIFrame && this.useIFrame;

            if(fromIFrame || toIFrame) {

                if(this.imgDiv && this.imgDiv.parentNode === this.frame) {
                    this.frame.removeChild(this.imgDiv);
                }
                this.imgDiv = null;

                if(fromIFrame) {
                    this.frame.removeChild(this.frame.firstChild);
                }
            }
        }
        return OpenLayers.Tile.Image.prototype.draw.apply(this, arguments);
    },

        getImage: function() {
        if (this.useIFrame === true) {
            if (!this.frame.childNodes.length) {
                var eventPane = document.createElement("div"),
                    style = eventPane.style;
                style.position = "absolute";
                style.width = "100%";
                style.height = "100%";
                style.zIndex = 1;
                style.backgroundImage = "url(" + this.blankImageUrl + ")";
                this.frame.appendChild(eventPane);
            }

            var id = this.id + '_iFrame', iframe;
            if (parseFloat(navigator.appVersion.split("MSIE")[1]) < 9) {
                iframe = document.createElement('<iframe name="'+id+'">');
                iframe.style.backgroundColor = '#FFFFFF';
                iframe.style.filter          = 'chroma(color=#FFFFFF)';
            }
            else {
                iframe = document.createElement('iframe');
                iframe.style.backgroundColor = 'transparent';
                iframe.name = id;
            }
            iframe.scrolling      = 'no';
            iframe.marginWidth    = '0px';
            iframe.marginHeight   = '0px';
            iframe.frameBorder    = '0';

            iframe.style.position = "absolute";
            iframe.style.width    = "100%";
            iframe.style.height   = "100%";

            if (this.layer.opacity < 1) {
                OpenLayers.Util.modifyDOMElement(iframe, null, null, null,
                    null, null, null, this.layer.opacity);
            }
            this.frame.appendChild(iframe);
            this.imgDiv = iframe;
            return iframe;
        } else {
            return OpenLayers.Tile.Image.prototype.getImage.apply(this, arguments);
        }
    },
    
        createRequestForm: function() {
        var form = document.createElement('form');
        form.method = 'POST';
        var cacheId = this.layer.params["_OLSALT"];
        cacheId = (cacheId ? cacheId + "_" : "") + this.bounds.toBBOX();
        form.action = OpenLayers.Util.urlAppend(this.layer.url, cacheId);
        form.target = this.id + '_iFrame';
        var imageSize = this.layer.getImageSize(),
            params = OpenLayers.Util.getParameters(this.url),
            field;
            
        for(var par in params) {
            field = document.createElement('input');
            field.type  = 'hidden';
            field.name  = par;
            field.value = params[par];
            form.appendChild(field);
        }   

        return form;
    },

        setImgSrc: function(url) {
        if (this.useIFrame === true) {
            if (url) {
                var form = this.createRequestForm();
                this.frame.appendChild(form);
                form.submit();
                this.frame.removeChild(form);
            } else if (this.imgDiv.parentNode === this.frame) {
                this.frame.removeChild(this.imgDiv);
                this.imgDiv = null;
            }
        } else {
            OpenLayers.Tile.Image.prototype.setImgSrc.apply(this, arguments);
        }
    },
    
        onImageLoad: function() {
        OpenLayers.Tile.Image.prototype.onImageLoad.apply(this, arguments);
        if (this.useIFrame === true) {
            this.imgDiv.style.opacity = 1;
            this.frame.style.opacity = this.layer.opacity;
        }
    },

        createBackBuffer: function() {
        var backBuffer;
        if(this.useIFrame === false) {
            backBuffer = OpenLayers.Tile.Image.prototype.createBackBuffer.call(this);
        }
        return backBuffer;
    }
};
