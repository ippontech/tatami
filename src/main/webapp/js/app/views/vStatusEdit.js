(function (Backbone, _, Tatami) {
    var StatusEdit = Backbone.Marionette.Layout.extend({

        template: '#StatusEdit',
        regions: {
            tatamReply: ".tatam-reply",
            geoloc: ".geolocMap"
        },

        events: {
            'keydown .edit-tatam > textarea': 'updatecount',
            'click .edit-tatam-float-right': 'togglePreview',
            'submit': 'submit',
            'click #statusGeoLocalization': 'geolocBind'
        },

        options : {currentGeoLocalization : ''},

        initialize: function () {
            this.model = new Tatami.Models.PostStatus();
            this.initGeoLocalization();
        },

        onRender: function () {
            _.defaults(this.options, {
                maxLength: 750
            });
            var self = this;
            this.$editContent = this.$el.find('.edit-tatam');
            this.$edit = this.$editContent.find('textarea[name="content"]');
            this.$previewContent = this.$el.find('.preview-tatam');
            this.$preview = this.$previewContent.find('.well.markdown');

            this.$reply = this.$el.find('.reply');
            this.$reply.css('display', 'none');

            this.initFileUpload();
            this.initFileUploadBind();
            this.$el.find('.groups').toggleClass('hide', Tatami.app.groups.length === 0);

            this.$edit.typeahead(new Tatami.Suggester(this.$edit));

            this.$el.modal('show');


            this.initMap();   //Ca marche avec un init map

            this.geoloc.close();
            this.geoloc.show(new Tatami.Views.StatusGeolocPreview({
                currentGeoloc : self.options.currentGeoLocalization
            }));   //Je n'arrive pas à afficher une carte avec une nouvelle région
            this.geoloc.close();

            this.checkGeoloc();
        },

        initGeoLocalization: function () {
             var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geoLocalization = position.coords.latitude + ', ' + position.coords.longitude;
                    self.options.currentGeoLocalization = geoLocalization;
                });
            }
        },

        checkGeoloc: function () {
            if (this.options.currentGeoLocalization === '') {
                this.$el.find('#geolocCheckboxDiv').remove();
                this.$el.find('#GeolocImpossible').text("Geolocalisation impossible").css('color', 'red');
            }
        },

        geolocBind: function () {
            if ($('#statusGeoLocalization').is(':checked') && this.options.currentGeoLocalization !== '') {
                this.model.set('geoLocalization', this.options.currentGeoLocalization);
            }
            else {
                this.model.set('geoLocalization', '');
            }
        },

        initMap: function () {
            if (this.options.currentGeoLocalization !== '') {
                var geoLocalization = this.options.currentGeoLocalization;
                var latitude = geoLocalization.split(',')[0].trim();
                var longitude = geoLocalization.split(',')[1].trim();

                map = new OpenLayers.Map("basicMap");
                var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
                var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
                var lonLat = new OpenLayers.LonLat(parseFloat(longitude), parseFloat(latitude)).transform(fromProjection, toProjection);
                var mapnik = new OpenLayers.Layer.OSM();
                var position = lonLat;
                var zoom = 12;

                map.addLayer(mapnik);
                var markers = new OpenLayers.Layer.Markers("Markers");
                map.addLayer(markers);
                markers.addMarker(new OpenLayers.Marker(lonLat));
                map.setCenter(position, zoom);
            }
        },

        initFileUpload: function () {
            var self = this;
            self.model.resetAttachments();
            this.$dropzone = self.$el.find('.dropzone');
            this.$el.find('.updateStatusFileupload').fileupload({
                dataType: 'json',
                sequentialUploads: 'true',
                progressall: function (e, data) {
                    self.$el.find('.attachmentBar').show();
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    self.$el.find('.attachmentBar .bar').css(
                        'width',
                        progress + '%'
                    );
                },
                dropZone: this.$dropzone,
                done: function (e, data) {
                    self.$el.find('.attachmentBar').hide();
                    self.$el.find('.attachmentBar .bar').css(
                        'width', '0%'
                    );
                    $.each(data.result, function (index, attachment) {
                        var size = "";
                        if (attachment.size < 1000000) {
                            size = (attachment.size / 1000).toFixed(0) + "K";
                        } else {
                            size = (attachment.size / 1000000).toFixed(2) + "M";
                        }
                        self.model.addAttachment(attachment.attachmentId);
                        $("<p>" + attachment.name + " (" + size + ")" + "<input type='hidden' name='attachmentIds[]' value='" + attachment.attachmentId + "'/></p>").appendTo(self.$el.find(".fileUploadResults"));
                    });
                },
                fail: function (e, data) {
                    self.$el.find('.attachmentBar').hide();
                    self.$el.find('.attachmentBar .bar').css(
                        'width', '0%'
                    );
                    if (data.errorThrown == "Forbidden") {
                        self.$el.find("<p>Attachment failed! You do not have enough free disk space.</p>").appendTo($("#fileUploadResults"));
                    }
                }
            });
        },

        initFileUploadBind: _.once(function () {
            var self = this;

            $(document).bind('dragover', function (e) {
                var dropZone = self.$dropzone,
                    timeout = window.dropZoneTimeout;
                if (!timeout) {
                    dropZone.addClass('in');
                } else {
                    clearTimeout(timeout);
                }
                if (e.target === dropZone[0]) {
                    dropZone.addClass('hover');
                } else {
                    dropZone.removeClass('hover');
                }
                window.dropZoneTimeout = setTimeout(function () {
                    window.dropZoneTimeout = null;
                    dropZone.removeClass('in hover');
                }, jQuery.fx.speeds._default);
            });
            $(document).bind('drop dragover', function (e) {
                return false;
            });
            self.$el.find('.dropzone').bind('click', function () {
                self.$el.find('.updateStatusFileupload').click();
            });
        }),

        serializeData: function () {
            return _.extend(Backbone.Marionette.Layout.prototype.serializeData.apply(this, arguments), {
                groups: (new Tatami.Collections.Groups(Tatami.app.groups.where({archivedGroup: false}))).toJSON()
            });
        },

        updatecount: function (e) {
            var $textarea = $(e.currentTarget);
            var $label = this.$el.find('.countstatus');

            var value = this.options.maxLength - $textarea.val().length;
            $label.text(value);
        },

        togglePreview: function () {
            try {
                this.$preview.html(marked(this.$edit.val()));
            }
            catch (e) {
            }
            this.$el.find('.glyphicon-eye-open, .glyphicon-edit').add(this.$editContent).add(this.$previewContent).toggleClass('hide');
        },

        show: function (options) {
            options = (options) ? options : {};
            if (options.status) {
                var self = this;
                var statusReply = new Tatami.Models.Status({
                    statusId: options.status
                });
                statusReply.fetch({
                    success: function (model) {
                        self.$el.find('.edit-tatam > textarea').val("@" + model.get('username') + " ");
                        self.$el.find('.groups').hide();
                        self.$el.find('.status-private').hide();
                        self.$reply.slideDown();
                        var tatam = new Tatami.Views.StatusItem({
                            model: model
                        });
                        self.tatamReply.show(tatam);
                        tatam.$el.slideDown();
                        statusReply.set('root', true);
                    }
                });
            }

            if (options.status) this.model.set('replyTo', options.status);
            if (options.group) this.model.set('groupId', options.group);

            this.render();
        },

        hide: function () {
            this.$el.modal('hide');
            this.reset();
        },

        reset: function () {
            this.el.reset();

            this.model = new Tatami.Models.PostStatus();

            var $reply = this.$el.find('.reply');
            $reply.css('display', 'none');
        },

        submit: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var replyTo = self.model.get('replyTo');
            this.model.set('content', this.$edit.val());
            this.model.set('groupId', this.$el.find('[name="groupId"]').val());
            this.model.set('statusPrivate', this.$el.find('#statusPrivate').prop('checked'));
            this.model.save(null, {
                success: function (model, response) {
                    self.hide();
                    Tatami.app.trigger('refresh', {
                        display: true,
                        replyTo: replyTo
                    });
                    Tatami.app.user.set('statusCount', Tatami.app.user.get('statusCount') + 1);
                },
                error: function (model, response) {
                }
            });
        },

        cancel: function () {
            return false;
        }

    });

    var StatusGeolocPreview = Backbone.Marionette.Layout.extend({
        template: '#GeolocPreview',
        className: 'geolocPreviewTemplate',

        initialize : function(){

        },

        onRender: function() {
            this.initMap();
        },

        initMap: function () {

            //var self = this;
            var geoLocalization = this.options.currentGeoloc;

            if(geoLocalization !== undefined && geoLocalization !== '' ) {
                var latitude = geoLocalization.split(',')[0].trim();
                var longitude = geoLocalization.split(',')[1].trim();
                //this.$el.find("#geolocMapPreview").hide(); //Test pour voir si on accède bien au DOM
                map = new OpenLayers.Map("geolocMapPreview");
                var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
                var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
                var lonLat = new OpenLayers.LonLat(parseFloat(longitude), parseFloat(latitude)).transform(fromProjection, toProjection);
                var mapnik = new OpenLayers.Layer.OSM();
                var position = lonLat;
                var zoom = 12;

                map.addLayer(mapnik);
                var markers = new OpenLayers.Layer.Markers("Markers");
                map.addLayer(markers);
                markers.addMarker(new OpenLayers.Marker(lonLat));
                map.setCenter(position, zoom);
            }
        }

    });

    Tatami.Views.StatusEdit = StatusEdit;
    Tatami.Views.StatusGeolocPreview = StatusGeolocPreview;
})(Backbone, _, Tatami);