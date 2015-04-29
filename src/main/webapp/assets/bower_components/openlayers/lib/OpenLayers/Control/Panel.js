/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Panel = OpenLayers.Class(OpenLayers.Control, {
        controls: null,    
    
        autoActivate: true,

        defaultControl: null,
    
        saveState: false,
      
        allowDepress: false,
    
        activeState: null,

        initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.controls = [];
        this.activeState = {};
    },

        destroy: function() {
        if (this.map) {
            this.map.events.unregister("buttonclick", this, this.onButtonClick);
        }
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        for (var ctl, i = this.controls.length - 1; i >= 0; i--) {
            ctl = this.controls[i];
            if (ctl.events) {
                ctl.events.un({
                    activate: this.iconOn,
                    deactivate: this.iconOff
                });
            }
            ctl.panel_div = null;
        }
        this.activeState = null;
    },

        activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            var control;
            for (var i=0, len=this.controls.length; i<len; i++) {
                control = this.controls[i];
                if (control === this.defaultControl ||
                            (this.saveState && this.activeState[control.id])) {
                    control.activate();
                }
            }    
            if (this.saveState === true) {
                this.defaultControl = null;
            }
            this.redraw();
            return true;
        } else {
            return false;
        }
    },
    
        deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            var control;
            for (var i=0, len=this.controls.length; i<len; i++) {
                control = this.controls[i];
                this.activeState[control.id] = control.deactivate();
            }    
            this.redraw();
            return true;
        } else {
            return false;
        }
    },
    
        redraw: function() {
        for (var l=this.div.childNodes.length, i=l-1; i>=0; i--) {
            this.div.removeChild(this.div.childNodes[i]);
        }
        this.div.innerHTML = "";
        if (this.active) {
            for (var i=0, len=this.controls.length; i<len; i++) {
                this.div.appendChild(this.controls[i].panel_div);
            }
        }
    },
    
        activateControl: function (control) {
        if (!this.active) { return false; }
        if (control.type == OpenLayers.Control.TYPE_BUTTON) {
            control.trigger();
            return;
        }
        if (control.type == OpenLayers.Control.TYPE_TOGGLE) {
            if (control.active) {
                control.deactivate();
            } else {
                control.activate();
            }
            return;
        }
        if (this.allowDepress && control.active) {
            control.deactivate();
        } else {
            var c;
            for (var i=0, len=this.controls.length; i<len; i++) {
                c = this.controls[i];
                if (c != control &&
                   (c.type === OpenLayers.Control.TYPE_TOOL || c.type == null)) {
                    c.deactivate();
                }
            }
            control.activate();
        }
    },

        createControlMarkup: function(control) {
        return document.createElement("div");
    },
   
         iconOn: function() {
        var d = this.panel_div; // "this" refers to a control on panel!
        var re = new RegExp("\\b(" + this.displayClass + "Item)Inactive\\b");
        d.className = d.className.replace(re, "$1Active");
    },

         iconOff: function() {
        var d = this.panel_div; // "this" refers to a control on panel!
        var re = new RegExp("\\b(" + this.displayClass + "Item)Active\\b");
        d.className = d.className.replace(re, "$1Inactive");
    },
    
        onButtonClick: function (evt) {
        var controls = this.controls,
            button = evt.buttonElement;
        for (var i=controls.length-1; i>=0; --i) {
            if (controls[i].panel_div === button) {
                this.activateControl(controls[i]);
                break;
            }
        }
    },

        getControlsBy: function(property, match) {
        var test = (typeof match.test == "function");
        var found = OpenLayers.Array.filter(this.controls, function(item) {
            return item[property] == match || (test && match.test(item[property]));
        });
        return found;
    },

        getControlsByName: function(match) {
        return this.getControlsBy("name", match);
    },

        getControlsByClass: function(match) {
        return this.getControlsBy("CLASS_NAME", match);
    },

    CLASS_NAME: "OpenLayers.Control.Panel"
});

