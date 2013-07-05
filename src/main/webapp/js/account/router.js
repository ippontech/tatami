/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, _, Tatami){

_.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
};

    var AdminRouter = Backbone.Marionette.AppRouter.extend({
    initialize: function(){

    },

    selectMenu: function(menu) {
        $('.adminMenu a').parent().removeClass('active');
        $('.adminMenu a[href="/tatami/account/#/' + menu + '"]').parent().addClass('active');
    },

    resetView : function(){
        //Harsh way but the regionx.close() was buggy

        contentLayout.close();
        contentLayout = new ContentLayout();
        ContentContainer.show(contentLayout);
    },

    routes: {
            'profile': 'profile',
            'preferences': 'preferences',
            'password': 'password',
            'groups': 'groups',
            'groups/recommended': 'recommendedGroups',
            'groups/search':'searchGroup',
            'groups/:id': 'editGroup',
            'tags':'tags',
            'tags/recommended':'recommendedTags',
            'tags/search':'searchTags',
            'users':'users',
            'users/recommended':'recommendedUsers',
            'users/search':'searchUsers',
            'status_of_the_day' : 'status_of_the_day',
            'files' : 'files',
            '*action': 'profile'
        },
        profile: function() {

            this.selectMenu('profile');

            var mAccountProfile = new MAccountProfile();
            var vAccountProfile = new VAccountProfile({model: mAccountProfile});
            var vAccountProfileDestroy = new VAccountProfileDestroy({model: mAccountProfile});
            this.resetView();
            contentLayout.region1.show(vAccountProfile);
            contentLayout.region2.show(vAccountProfileDestroy) ;
        },

        preferences: function(){
            this.selectMenu('preferences');

            var mPreferences = new MPreferences();
            var vPreferences = new VPreferences({model : mPreferences});
            this.resetView();
            contentLayout.region1.show(vPreferences);
        },

        password: function(){
            this.selectMenu('password');

            var mPassword = new MPassword();
            var vPassword = new VPassword({model : mPassword});
            this.resetView();
            contentLayout.region1.show(vPassword);
        },

        initGroups: function(){

            if(!app.views.groups)
                app.views.groups = new VTabContainer({
                    collection: new CTabGroup(),
                    ViewModel: VGroup,
                    MenuTemplate: _.template($('#groups-menu').html()),
                    TabHeaderTemplate : _.template($('#groups-header').html())
                });
            if(!app.collections.adminGroups) app.collections.adminGroups = new CAdminGroup();
            app.collections.adminGroups.fetch({
                success: function() {
                    app.views.groups.render();
                }
            });
            return app.views.groups;
        },

        initAddGroup: function(listView){

            if(!app.views.addgroup){
                app.views.addgroup = new VAddGroup();
                app.views.addgroup.bind('success', listView.collection.fetch, listView.collection);
                app.views.addgroup.bind('success', app.collections.adminGroups.fetch, app.collections.adminGroups);
            }
            return app.views.addgroup;
        },

        groups: function(){
            var view = this.initGroups();
            this.selectMenu('groups');

            view.collection.owned();

            var addview = this.initAddGroup(view);

            addview.collection = view.collection;
            this.resetView();

            contentLayout.region1.show(addview);
            contentLayout.region2.show(view);
            view.selectMenu('groups');
        },

        recommendedGroups: function(){
            var view = this.initGroups();
            this.selectMenu('groups');

            view.collection.recommended();

            var addview = this.initAddGroup(view);

            addview.collection = view.collection;

            this.resetView();
            contentLayout.region1.show(addview);
            contentLayout.region2.show(view);

            view.selectMenu('groups/recommended');
        },

        initSearchGroups: function(){

            if(!app.views.SearchGroups)
                app.views.SearchGroups = new VTabSearch({
                    collection: new CTabGroup(),
                    ViewModel: VGroup,
                    MenuTemplate: _.template($('#groups-menu').html()),
                    TabHeaderTemplate : _.template($('#groups-header').html())
                });
            return app.views.SearchGroups;
        },

        searchGroup: function(){
            var view = this.initSearchGroups();
            this.selectMenu('groups');
            view.selectMenu('groups/search');

            this.resetView();
            contentLayout.region1.show(view);
        },

        editGroup: function(id){
            this.selectMenu('');


            var vEditGroup = new VEditGroup({
                groupId : id
            });

            var collection = new CListUserGroup();
            collection.options = {
                groupId : id
            };
            var vAddUserGroup = new VAddUserGroup({
                collection : collection
            });

            var vListUserGroup = new VListUserGroup({
                collection : collection,
                groupId : id
            });
            this.resetView();
            contentLayout.region1.show(vEditGroup);
            contentLayout.region2.show(vAddUserGroup);
            contentLayout.region3.show(vListUserGroup);
        },

        initTags: function(){
            if(!app.views.tags)
                app.views.tags = new VTabContainer({
                    collection: new CTabTag(),
                    ViewModel: VTag,
                    MenuTemplate: _.template($('#tags-menu').html()),
                    TabHeaderTemplate : _.template($('#tags-header').html())
                });
            return app.views.tags;
        },

        tags: function(){
            var view = this.initTags();
            this.selectMenu('tags');

            view.collection.owned();
            this.resetView();
            contentLayout.region1.show(view);

            view.selectMenu('tags');
        },

        recommendedTags: function(){
            var view = this.initTags();
            this.selectMenu('tags');

            view.collection.recommended();

            this.resetView();
            contentLayout.region1.show(view);

            view.selectMenu('tags/recommended');
        },

        initSearchTags: function(){
            if(!app.views.SearchTags)
                app.views.SearchTags = new VTabSearch({
                    collection: new CTabTag(),
                    ViewModel: VTag,
                    MenuTemplate: _.template($('#tags-menu').html()),
                    TabHeaderTemplate : _.template($('#tags-header').html())
                });
            return app.views.SearchTags;
        },

        searchTags: function(){
            var view = this.initSearchTags();
            this.selectMenu('tags');

            this.resetView();
            contentLayout.region1.show(view);

            view.selectMenu('tags/search');
        },

        initUsers: function(){
            if(!app.views.users)
                app.views.users = new VTabContainer({
                    collection: new CTabUser(),
                    ViewModel: VUser,
                    MenuTemplate: _.template($('#users-menu').html()),
                    TabHeaderTemplate :_.template($('#users-header').html())
                });
            return app.views.users;
        },

        users: function(){
            var view = this.initUsers();
            this.selectMenu('users');

            view.collection.owned();

            this.resetView();
            contentLayout.region1.show(view);

            view.selectMenu('users');
        },

        recommendedUsers: function(){
            var view = this.initUsers();
            this.selectMenu('users');

            view.collection.recommended();

            this.resetView();
            contentLayout.region1.show(view);

            view.selectMenu('users/recommended');
        },

        initSearchUser: function(){
            if(!app.views.SearchUsers)
                app.views.SearchUsers = new VTabSearch({
                    collection: new CTabUser(),
                    ViewModel: VUser,
                    MenuTemplate: _.template($('#users-menu').html()),
                    TabHeaderTemplate :_.template($('#users-header').html())
                });
            return app.views.SearchUsers;
        },

        searchUsers: function(){
            var view = this.initSearchUser();
            this.selectMenu('users');
            this.resetView();
            contentLayout.region1.show(view);

            view.selectMenu('users/search');
        },

        status_of_the_day: function(){
            this.selectMenu('status_of_the_day');
            if(!app.views.daily)
                app.views.daily = new VDailyStats();
            var view = app.views.daily;

            this.resetView();
            contentLayout.region1.show(view);
        },

        initFiles: function(){
            if(!app.views.files)
                app.views.files = new VFiles({
                    collection: new CFiles()
                });

            return app.views.files;
        },

        files: function(){
            this.selectMenu('files');
            var view = this.initFiles();

            view.collection.fetch();

            this.resetView();
            contentLayout.region1.show(new VFilesMenu());
            contentLayout.region2.show(new VQuotaFiles());
            contentLayout.region3.show(new VFilesHeader);
            contentLayout.region4.show(view);
            this.selectMenu('files');
        }
    });


