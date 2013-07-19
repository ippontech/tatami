/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */
_.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
};

/*var Account = {
    views: {},
    collections: {},
    View: {},
    Collection: {},
    Model: {},
    Router: {}
};

Account.app = new Backbone.Marionette.Application();

if(!window.app){
       window.app = Account.app;
}       */

var Tatami = {
    views: {},
    collections: {},
    View: {},
    Views: {},
    Collection: {},
    Collections: {},
    Model: {},
    Models: {},
    Router: {}   ,
    Factories: {}
};

Tatami.app = new Backbone.Marionette.Application();

if(!window.app){
    app = window.app = _.extend({
        views: {},
        collections: {},
        View: {},
        Collection: {},
        Model: {},
        Router: {}
    }, Backbone.Events);
}
else {
    app = window.app;
}

//app.formSuccess = "Form Save";
app.formSuccess = $('#form-success-label').text().trim();
app.formError =   $('#form-error-label').text().trim();
app.deleteFileSuccess = $('#delete-file-success-label').text().trim();
app.deleteFileError = $('#delete-file-error-label').text().trim();
app.memberAddSuccess = $('#groups-form-adduser-success-label').text().trim();
app.memberAddError = $('#groups-form-adduser-error-label').text().trim();
app.formErrorLDAP = $('#form-ldap').text().trim();

app.on('even-alert-success', function(msg){

    $.jGrowl(msg, {
        theme: 'alert-success',
        //speed: 'slow',
        life: 2500 ,
         animateOpen: {
         height: "show"
         }//,
         /*animateClose: {
         height: "hide"
         }  */
    });
});

app.on('even-alert-error', function(msg){

    $.jGrowl(msg, {
        theme: 'alert-danger',
        //speed: 'slow',
        life: 5000
        /* animateOpen: {
         height: "show"
         },
         animateClose: {
         height: "hide"
         } */
    });
});

app.on('even-alert-warning', function(msg){

    $.jGrowl(msg, {
        theme: 'alertColor',
        //speed: 'slow',
        life: 3000,
         animateOpen: {
         height: "show"
         },
         animateClose: {
         height: "hide"
         }
    });
});

accountLayout = new AccountLayout();
AccountContainer.show(accountLayout);

accountLayout.avatar.show(new VAvatar());
accountLayout.navigation.show(new VNavigation());
//accountLayout.content.show(new VContent());

contentLayout = new ContentLayout();
ContentContainer.show(contentLayout);

Tatami.app.addInitializer(function(){
    var autoRefresh = function(){
        Tatami.app.trigger('refresh');
        _.delay(autoRefresh, 20000);
    };
    autoRefresh();
});

Tatami.app.addInitializer(function(){
    var $w = $(window);
    var $d = $(document);

    var autoNext = _.debounce(function(){
        if($w.height() + $d.scrollTop() > $d.height() - 200)
            Tatami.app.trigger('next');
    }, jQuery.fx.speeds._default);

    $(window).scroll(autoNext);
});

Tatami.app.addInitializer(function(){
    Tatami.app.addRegions({
        header: '#tatamiHeader',
        side: '#tatamiSide',
        body: '#tatamiBody',
        slider: '#slider'
    });
});

Tatami.app.on("initialize:after", function(options){
    //if (Backbone.History.started){
    if (Backbone.history){
            app.router = new AdminRouter();
        Backbone.history.start({
            pushState: true,
                root: "/tatami/account/"
        });
        if (Backbone.history._hasPushState) {
            $(document).delegate("a", "click", function(evt) {
                var href = $(this).attr("href");
                var protocol = this.protocol + "//";
                if (typeof href !== 'undefined' && href.slice(protocol.length) !== protocol && /^#.+$/.test(href)) {
                    evt.preventDefault();
                    Backbone.history.navigate(href, true);
                }
            });
        }
    }
});



$(function(){
    var onStart = _.after(2, function(){
        Tatami.app.start();
    });

    Tatami.app.user = new Tatami.Models.User({
        username: username
    });
    Tatami.app.groups = new Tatami.Collections.Groups();

    Tatami.app.user.fetch({
        success: onStart
    });
    Tatami.app.groups.fetch({
        success: onStart
    });
});


