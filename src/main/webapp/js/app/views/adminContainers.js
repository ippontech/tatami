(function(Backbone, _, Tatami){
    var AdminSide = Backbone.Marionette.Layout.extend({
        template: "#AdminSide",
        regions: {
            ActionAdmin: {
                selector: ".actions"
            },
            ActionMenu: {
                selector: ".menu"
            }
        },

        selectMenu: function(menu) {
            $('.adminbody-nav a').parent().removeClass('active');
            $('.adminbody-nav a[href="/tatami/new/admin/' + menu + '"]').parent().addClass('active');
        }
    });

    var AdminBody = Backbone.Marionette.Layout.extend({
        template: "#AdminBody",
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        }
    });



    Tatami.Views.AdminSide = AdminSide;
    Tatami.Views.AdminBody = AdminBody;

})(Backbone, _, Tatami);