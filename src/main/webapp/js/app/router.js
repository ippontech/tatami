(function(Backbone, _, Tatami){
    var Router = Backbone.Marionette.AppRouter.extend({
        routes: {
            'timeline' : 'homeTimeline',
            'mentions' : 'homeMentions',
            'favorites' : 'homeFavorites',
            'tags/:tag' : 'tags',
            'users/:username' : 'profile',
            'users/:username/friends' : 'profileFriends',
            'users/:username/followers' : 'profileFollowers',
            'groups/:group' : 'groups',
            'groups/:group/members' : 'groupsMembers',
            '*actions' : 'defaults'
        },

        // Home

        defaults: function() {
            Backbone.history.navigate('timeline', true);
        },

        homeTimeline: function(){
            Tatami.app.header.close();

            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());
            homeSide.groups.show(Tatami.Factories.Home.groups());
            homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());

            var homeBody = Tatami.Factories.Home.homeBody();

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesTimeline();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            homeBody.show('timeline');
        },

        homeMentions: function(){
            Tatami.app.header.close();

            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            var homeBody = Tatami.Factories.Home.homeBody();

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

            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            var homeBody = Tatami.Factories.Home.homeBody();

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
            Tatami.app.header.show(Tatami.Factories.Tags.tagsHeader(tag));

            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.whoToFollow.show(Tatami.Factories.Home.whoToFollow());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            var tagsBody = Tatami.Factories.Tags.tagsBody();

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesTags(tag);
            Tatami.app.body.show(tagsBody);

            tagsBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();
        },

        profile: function(username) {
            Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));

            var profileSide = Tatami.Factories.Profile.profileSide();
            Tatami.app.side.show(profileSide);

            profileSide.stats.show(Tatami.Factories.Profile.stats(username));
            profileSide.informations.show(Tatami.Factories.Profile.informations(username));
            profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));

            var profileBody = Tatami.Factories.Profile.profileBody(username);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Profile.statuses(username);
            Tatami.app.body.show(profileBody);

            profileBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            profileBody.show('timeline');
        },

        profileFriends: function(username) {
            Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));

            var profileSide = Tatami.Factories.Profile.profileSide();
            Tatami.app.side.show(profileSide);

            profileSide.stats.show(Tatami.Factories.Profile.stats(username));
            profileSide.informations.show(Tatami.Factories.Profile.informations(username));
            profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));

            var profileBody = Tatami.Factories.Profile.profileBody(username);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Profile.friends(username);
            Tatami.app.body.show(profileBody);

            profileBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            window.c = timeline.collection;
            timeline.collection.fetch();

            profileBody.show('friends');
        },

        profileFollowers: function(username) {
            Tatami.app.header.show(Tatami.Factories.Profile.profileHeader(username));

            var profileSide = Tatami.Factories.Profile.profileSide();
            Tatami.app.side.show(profileSide);

            profileSide.stats.show(Tatami.Factories.Profile.stats(username));
            profileSide.informations.show(Tatami.Factories.Profile.informations(username));
            profileSide.tagTrends.show(Tatami.Factories.Profile.tagTrends(username));

            var profileBody = Tatami.Factories.Profile.profileBody(username);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Profile.followers(username);
            Tatami.app.body.show(profileBody);

            profileBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            profileBody.show('followers');
        },

        groups: function(group){
            Tatami.app.header.show(Tatami.Factories.Groups.groupsHeader(group));
            Tatami.app.side.close();


            var groupsBody = Tatami.Factories.Groups.groupsBody(group);

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesGroups(group);
            Tatami.app.body.show(groupsBody);

            groupsBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            groupsBody.show('timeline');
        },

        groupsMembers: function(group){
            Tatami.app.header.show(Tatami.Factories.Groups.groupsHeader(group));
            Tatami.app.side.close();


            var groupsBody = Tatami.Factories.Groups.groupsBody(group);

            Tatami.app.body.show(groupsBody);

            groupsBody.show('members');
        }
    });

    Tatami.Router = Router;
})(Backbone, _, Tatami);