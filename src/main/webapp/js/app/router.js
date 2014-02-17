(function(Backbone, _, Tatami){
    var Router = Backbone.Marionette.AppRouter.extend({
        routes: {
            'timeline' : 'homeTimeline',
            'mentions' : 'homeMentions',
            'favorites' : 'homeFavorites',
            'tags/:tag' : 'tags',
            'status/:id' : 'status',
            'users/:username' : 'profile',
            'users/:username/friends' : 'profileFriends',
            'users/:username/followers' : 'profileFollowers',
            'groups/:group' : 'groups',
            'groups/:group/members' : 'groupsMembers',
            'search/:input' : 'search',
            'company' : 'company',
            '*actions' : 'defaults'
        },

        // Home

        defaults: function() {
            Backbone.history.navigate('timeline', true);
        },

        homeTimeline: function(){
            if (!ios) {
                Tatami.app.navbar.displaySearch();
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
                homeSide.groups.show(Tatami.Factories.Home.groups());
                homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());
            }
            Tatami.app.header.close();

            var homeBody = Tatami.Factories.Home.homeBody('timeline');

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesTimeline();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch({
                success: function () {
                    if (timeline.collection.length == 0 && showWelcome == true) {
                        homeBody.welcome.show(Tatami.Factories.Status.getWelcomeRegion());
                        $('#WelcomeModal').modal('show');
                    }
                }
            });

            homeBody.show('timeline');
        },

        homeMentions: function(){
            Tatami.app.header.close();

            if (!ios) { 
                Tatami.app.navbar.displaySearch();
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
            }

            var homeBody = Tatami.Factories.Home.homeBody('mentions');

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesMentions();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();

            homeBody.show('mentions');

        },

        homeFavorites: function(){
            Tatami.app.header.close();

            if (!ios) {
                Tatami.app.navbar.displaySearch();
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
            }
            var homeBody = Tatami.Factories.Home.homeBody('favorites');

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesFavorites();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();

            homeBody.show('favorites');

        },

        tags: function(tag) {

            if (!ios) {
                Tatami.app.navbar.displaySearch("#"+tag);
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.groups.show(Tatami.Factories.Home.groups());
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
            }
            var tagsBody = Tatami.Factories.Tags.tagsBody("#"+tag);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesTags(tag);
            Tatami.app.body.show(tagsBody);

            tagsBody.tatams.show(region);

            tagsBody.header.show(Tatami.Factories.Tags.tagsHeader(tag));

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();
        },

        search: function(input){
            Tatami.app.header.close();
            if (!ios) {
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.groups.show(Tatami.Factories.Home.groups());
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
                Tatami.app.navbar.displaySearch(input);
            }

            var searchBody = Tatami.Factories.Search.searchBody(input);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesSearch(input);
            Tatami.app.body.show(searchBody);
            searchBody.header.show(Tatami.Factories.Search.searchHeader(input));

            searchBody.tatams.show(region);            
            region.timeline.show(timeline);
            timeline.collection.fetch();

        },

        status: function(statusId) {
            if (!ios) {
                Tatami.app.navbar.displaySearch();
            }
            var status = new Tatami.Models.Status({
                statusId: statusId
            });
            status.fetch({
                error: function(){
                    Tatami.app.router.defaults();
                },
                success: function(model){
                    var username = model.get('username');

                    if (!ios) {
                        // Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));
                        Tatami.app.navbar.displaySearch("@"+username);
                        var profileSide = Tatami.Factories.Profile.profileSide();
                        Tatami.app.side.show(profileSide);

                        profileSide.informations.show(Tatami.Factories.Profile.informations(username));
                        profileSide.stats.show(Tatami.Factories.Profile.stats(username));
                        profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));
                    }
                    var profileBody = Tatami.Factories.Profile.profileBody(username);

                    Tatami.app.body.show(profileBody);

                    var statusView = new Tatami.Views.StatusItem({
                        model : model
                    });

                    profileBody.tatams.show(statusView);
                    profileBody.header.show(Tatami.Factories.Profile.profileHeader(username));

                    statusView.$el.slideDown();
                    profileBody.show('timeline');

                }
            });
        },

        profile: function(username) {
            // Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));

            if (!ios) {
                Tatami.app.navbar.displaySearch("@"+username);
                var profileSide = Tatami.Factories.Profile.profileSide();
                Tatami.app.side.show(profileSide);
                profileSide.informations.show(Tatami.Factories.Profile.informations(username));
                profileSide.stats.show(Tatami.Factories.Profile.stats(username));
                profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));
            }

            var profileBody = Tatami.Factories.Profile.profileBody(username);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Profile.statuses(username);
            Tatami.app.body.show(profileBody);

            profileBody.tatams.show(region);
            profileBody.header.show(Tatami.Factories.Profile.profileHeader(username));

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();

            profileBody.show('timeline');
        },

        profileFriends: function(username) {
            // Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));

            if (!ios) {
                Tatami.app.navbar.displaySearch("@"+username);
                var profileSide = Tatami.Factories.Profile.profileSide();
                Tatami.app.side.show(profileSide);
                profileSide.stats.show(Tatami.Factories.Profile.stats(username));
                profileSide.informations.show(Tatami.Factories.Profile.informations(username));
                profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));
            }
            var profileBody = Tatami.Factories.Profile.profileBody(username);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Profile.friends(username);
            Tatami.app.body.show(profileBody);

            profileBody.tatams.show(region);
            profileBody.header.show(Tatami.Factories.Profile.profileHeader(username));

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            window.c = timeline.collection;
            timeline.collection.fetch();

            profileBody.show('friends');
        },

        profileFollowers: function(username) {
            // Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));

            if (!ios) {
                Tatami.app.navbar.displaySearch("@"+username);
                var profileSide = Tatami.Factories.Profile.profileSide();
                Tatami.app.side.show(profileSide);
                profileSide.stats.show(Tatami.Factories.Profile.stats(username));
                profileSide.informations.show(Tatami.Factories.Profile.informations(username));
                profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));
            }
            var profileBody = Tatami.Factories.Profile.profileBody(username);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Profile.followers(username);
            Tatami.app.body.show(profileBody);

            profileBody.tatams.show(region);
            profileBody.header.show(Tatami.Factories.Profile.profileHeader(username));

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();

            profileBody.show('followers');
        },

        groups: function(group){
            // Tatami.app.header.show(Tatami.Factories.Groups.groupsHeader(group));

            if (!ios) {
                Tatami.app.navbar.displaySearch();
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.groups.show(Tatami.Factories.Home.groups());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
            }
            var groupsBody = Tatami.Factories.Groups.groupsBody(group);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesGroups(group);
            Tatami.app.body.show(groupsBody);

            groupsBody.tatams.show(region);
            groupsBody.header.show(Tatami.Factories.Groups.groupsHeader(group));

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();

            groupsBody.show('timeline');
        },

        groupsMembers: function(group){
            if (!ios) {
                Tatami.app.navbar.displaySearch();
                var homeSide = Tatami.Factories.Home.homeSide();
                Tatami.app.side.show(homeSide);
                homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
                homeSide.groups.show(Tatami.Factories.Home.groups());
                homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
            }
            // Tatami.app.header.show(Tatami.Factories.Groups.groupsHeader(group));

            var groupsBody = Tatami.Factories.Groups.groupsBody(group);
            var region = Tatami.Factories.Status.getTimelineRegion();
            var usersInGroup = Tatami.Factories.Groups.groupsUser(group);

            Tatami.app.body.show(groupsBody);

            groupsBody.tatams.show(region);
            groupsBody.header.show(Tatami.Factories.Groups.groupsHeader(group));

            region.timeline.show(usersInGroup);

            usersInGroup.collection.fetch();
            
            groupsBody.show('members');
        },

        company: function(){

            Tatami.app.navbar.displaySearch();
            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);
            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());

            Tatami.app.header.close();

            var homeBody = Tatami.Factories.Home.homeBody('company');

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesCompany();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());

            region.timeline.show(timeline);

            timeline.collection.fetch();
        }
    });

    Tatami.Router = Router;
})(Backbone, _, Tatami);