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
        $('.adminMenu a[href="#' + menu + '"]').parent().addClass('active');
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
            'test' : 'test',
            '*action': 'profile'
        },

        test: function(){

            var listFriends = Tatami.Factories.Profile.friends(username);
            this.resetView();
            contentLayout.region1.show(listFriends);
            listFriends.collection.fetch();

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
                    //MenuTemplate: _.template($('#groups-menu').html()),
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
            this.selectMenu('groups');

            var view = this.initGroups();
            var vTabMenu = new VTabMenu({template :'#groups-menu'});

            view.collection.owned();

            var addview = this.initAddGroup(view);

            addview.collection = view.collection;
            var listGroups = Tatami.Factories.Home.groupsSubscribe();
            this.resetView();
            contentLayout.region1.show(addview);
            contentLayout.region2.show(vTabMenu);
            vTabMenu.selectMenu("groups");
            contentLayout.region3.show(listGroups);

        },

        recommendedGroups: function(){

            this.selectMenu('groups');
            var vTabMenu = new VTabMenu({template :'#groups-menu'});
            var view = this.initGroups();

            view.collection.recommended();

            var addview = this.initAddGroup(view);

            addview.collection = view.collection;
            var listGroupsRecommended = Tatami.Factories.Home.groupsRecommended();

            this.resetView();
            contentLayout.region1.show(addview);
            contentLayout.region2.show(vTabMenu);
            vTabMenu.selectMenu("groups/recommended");
            //contentLayout.region3.show(view);
            contentLayout.region3.show(listGroupsRecommended);
            listGroupsRecommended.collection.fetch();

        },

        initSearchGroups: function(){

            if(!app.views.SearchGroups)
                app.views.SearchGroups = new VTabSearch({
                    collection: new CTabGroup(),
                    ViewModel: VGroup,
                    //MenuTemplate: _.template($('#groups-menu').html()),
                    TabHeaderTemplate : _.template($('#groups-header').html())
                });
            return app.views.SearchGroups;
        },

        searchGroup: function(){
            var view = this.initSearchGroups();
            this.selectMenu('groups');
            var vTabMenu = new VTabMenu({template :'#groups-menu'});

            this.resetView();
            contentLayout.region1.show(vTabMenu);
            vTabMenu.selectMenu("groups/search");
            contentLayout.region2.show(view);
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


            this.selectMenu('tags');
            var vTabMenu = new VTabMenu({template :'#tags-menu'});

            var listTags = Tatami.Factories.Home.tagsFollow();

            this.resetView();

            contentLayout.region1.show(vTabMenu);
            vTabMenu.selectMenu("tags");
            contentLayout.region2.show(listTags);
            listTags.collection.fetch();
        },

        recommendedTags: function(){

            this.selectMenu('tags');
            var vTabMenu = new VTabMenu({template :'#tags-menu'});

            var listTags = Tatami.Factories.Home.tagsRecommended() ;

            this.resetView();

            contentLayout.region1.show(vTabMenu);
            vTabMenu.selectMenu("tags/recommended");
            contentLayout.region2.show(listTags);
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
            var vTabMenu = new VTabMenu({template :'#tags-menu'});
            this.resetView();
            contentLayout.region1.show(vTabMenu);
            vTabMenu.selectMenu("tags/search");
            contentLayout.region2.show(view);

        },

        initUsers: function(){
            if(!app.views.users)
                app.views.users = new VTabContainer({
                    collection: new CUsers(),
                    ViewModel: VUser,
                    MenuTemplate: _.template($('#users-menu').html()),
                    TabHeaderTemplate :_.template($('#users-header').html())
                });
            return app.views.users;
        },

        users: function(){

            this.selectMenu('users');
            var vTabMenu = new VTabMenu({template : '#users-menu'});

            var listFriends = Tatami.Factories.Profile.friends(Tatami.app.user.get('username'));

            this.resetView();

            contentLayout.region1.show(vTabMenu);
                            vTabMenu.selectMenu("users");
            contentLayout.region2.show(listFriends);
            listFriends.collection.fetch();
        },

        recommendedUsers: function(){
            this.selectMenu('users');
            var vTabMenu = new VTabMenu({template : '#users-menu'});

            //var listFollowers = Tatami.Factories.Profile.followers(username);
            var listFollowers = Tatami.Factories.Home.usersRecommended();

            this.resetView();

            contentLayout.region1.show(vTabMenu);
            vTabMenu.selectMenu("users/recommended");
            contentLayout.region2.show(listFollowers);
            listFollowers.collection.fetch();
        },

        initSearchUser: function(){
            if(!app.views.SearchUsers)
                app.views.SearchUsers = new VTabSearch({
                    collection: new CUsers(),
                    ViewModel: VUser,
                    //MenuTemplate: _.template($('#users-menu').html()),
                    TabHeaderTemplate :_.template($('#users-header').html())
                });
            return app.views.SearchUsers;
        },

        searchUsers: function(){

            var vTabMenu = new VTabMenu({template : '#users-menu'});
            var view = this.initSearchUser();
            this.selectMenu('users');
            this.resetView();

            contentLayout.region1.show(vTabMenu);
            vTabMenu.selectMenu("users/search");
            contentLayout.region2.show(view);

            //view.selectMenu('users/search');
        },

        status_of_the_day: function(){
            this.selectMenu('status_of_the_day');
            var cDailyStats = new CDailyStat();
           // if(!app.views.daily)
            app.views.daily = new VDailyStats({ collection : cDailyStats});
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
            contentLayout.region2.show(new VQuotaFiles({model : new MQuota()}));
            contentLayout.region3.show(new VFilesHeader());
            contentLayout.region4.show(view);
            this.selectMenu('files');
        }
    });


