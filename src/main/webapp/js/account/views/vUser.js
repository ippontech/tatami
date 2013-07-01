/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 28/06/13
 * Time: 14:50
 * To change this template use File | Settings | File Templates.
 */


var VUser = Marionette.ItemView.extend({
    initialize: function(){
        app.views = {};
    },

    template:_.template($('#users-item').html()),
    tagName: 'tr',

    events:{
    },

    renderFollow: function(){
        var user = this.model.get('username');
        var self = this;

        function onFinish(follow) {
            app.views.followButton = new VFollowButton({
                username: user,
                followed: follow,
                owner: (user === username)
            });
            self.$el.find('.follow').html(app.views.followButton.render());
        }

        var followed = this.model.get('followed');
        if(typeof followed === 'undefined')
            $.get('/tatami/rest/friendships', {screen_name:user}, onFinish, 'json');
        else onFinish(followed);
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.renderFollow();
        this.delegateEvents();
        return this.$el;
    }
});

var VFollowButton = Marionette.ItemView.extend({
    templateFollow: _.template($('#follow-button').html()),
    templateFollowed: _.template($('#followed-button').html()),
    templateUserEdit:_.template($('#edit-profile').html()),

    initialize: function() {
        this.set(this.options.owner, this.options.followed);
    },

    set: function(owner, followed) {
        if(owner){
            this.events = {
                "click .btn": "editMyProfile"
            };
            this.editMyProfileRender();
        }
        else if(!owner && followed) {
            this.events = {
                "click .btn": "unfollow"
            };
            this.followedRender();
        }
        else if(!owner && !followed) {
            this.events = {
                "click .btn": "follow"
            };
            this.followRender();
        }
    },

    editMyProfile: function() {
        window.location = '/tatami/account/#/profile';
    },

    follow: function() {
        var self = this;
        this.undelegateEvents();
        $(this.el).empty();

        var m = new MFollowUser();
        m.set('username', this.options.username);

        m.save(null, {
            success: function(){
                self.set(self.options.owner, true);
                self.delegateEvents();
            },
            error: function(){
                self.set(self.options.owner, false);
                self.delegateEvents();
            }
        });
    },

    unfollow: function() {
        var self = this;
        this.undelegateEvents();
        $(this.el).empty();

        var m = new MUnFollowUser();
        m.set('username', this.options.username);

        m.save(null, {
            success: function(){
                self.set(self.options.owner, false);
                self.delegateEvents();
            },
            error: function(){
                self.set(self.options.owner, true);
                self.delegateEvents();
            }
        });
    },

    followRender: function() {
        $(this.el).html(this.templateFollow());
    },

    followedRender: function() {
        $(this.el).html(this.templateFollowed());
    },

    editMyProfileRender: function() {
        $(this.el).html(this.templateUserEdit());
    },

    render: function() {
        return $(this.el);
    }

});