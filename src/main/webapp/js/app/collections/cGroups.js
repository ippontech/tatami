(function(Backbone, Tatami){

    var Groups = Backbone.Collection.extend({
        url: '/tatami/rest/groups',
        model: Tatami.Models.Group
    });

    var GroupsSuscribe = Groups.extend({
        url: function(){
            return '/tatami/rest/groups';
        }
    })

    var GroupsRecommended = Groups.extend({
        url: function(){
            return '/tatami/rest/groupmemberships/suggestions';
        }
    })

    var SearchGroups = Groups.extend({
        url: function(){
            return '/tatami/rest/search/groups';
        }
    });

    var SearchTags = Groups.extend({
        url: function(){
            return '/tatami/rest/search/tags';
        }
    });

    Tatami.Collections.Groups = Groups;
    Tatami.Collections.GroupsList = GroupsSuscribe;
    Tatami.Collections.GroupsRecommended = GroupsRecommended;
    Tatami.Collections.SearchGroups = SearchGroups;
    Tatami.Collections.SearchTags = SearchTags;
})(Backbone, Tatami);
