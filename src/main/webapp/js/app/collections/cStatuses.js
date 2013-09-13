(function(Backbone, Tatami){

    var Statuses = Backbone.Collection.extend({
        initialize: function(){
            this.initStorage();
            this.initNext();
            this.initRefresh();
        },
        model: Tatami.Models.Status,
        initStorage: function(){

        },
        initNext: function(){
            var self = this;
            this.next = _.once(function(cb){
                var options = {
                    remove:false,
                    merge:true,
                    success: function(collection, response){
                        if(response.length > 1) self.initNext();
                        if (cb) cb();
                    }
                };
                if(self.last())
                    options = _.extend(options, {
                        data: {
                            finish:  self.last().get('timelineId')
                        }
                    });
                return self.fetch(options);
            });
        },
        initRefresh: function(){
            var self = this;
            this.refresh = _.once(function(cb){
                var options = {
                    remove:false,
                    merge:true,
                    at:0,
                    success: function(){
                        Tatami.app.trigger('statusPending', self.filter(function(model){
                            return model.hidden;
                        }));
                        self.initRefresh();
                        if (cb) cb();
                    }
                };
                if(self.first())
                    options = _.extend(options, {
                        data: {
                            start: self.first().get('timelineId')
                        }
                    });
                return self.fetch(options);
            });
        }
    });

    var StatusesTimeline = Statuses.extend({
        url: '/tatami/rest/statuses/home_timeline'
    });

    var StatusesFavorites = Statuses.extend({
        url: '/tatami/rest/favorites'
    });

    var StatusesMentions = Statuses.extend({
        model: Tatami.Models.Status,
        url: '/tatami/rest/mentions'
    });

    var StatusesCompany = Statuses.extend({
        model: Tatami.Models.Status,
        url: '/tatami/rest/company'
    });

    var StatusesTags = Statuses.extend({
        model: Tatami.Models.Status,
        url: function(){
            return '/tatami/rest/tags/' + this.tag + '/tag_timeline';
        }
    });

    var StatusesUsers = Statuses.extend({
        model: Tatami.Models.Status,
        url: function(){
            return '/tatami/rest/statuses/' + this.user + '/timeline';
        }
    });

    var StatusesGroups = Statuses.extend({
        model: Tatami.Models.Status,
        url: function(){
            return '/tatami/rest/groups/' + this.group + '/timeline';
        }
    });

    var StatusesSearch = Statuses.extend({
        model: Tatami.Models.Status,
        url: function(){
            return '/tatami/rest/search/status?q='+this.input;
        }
    });

    Tatami.Collections.Statuses = Statuses;
    Tatami.Collections.StatusesTimeline = StatusesTimeline;
    Tatami.Collections.StatusesFavorites = StatusesFavorites;
    Tatami.Collections.StatusesMentions = StatusesMentions;
    Tatami.Collections.StatusesCompany = StatusesCompany;
    Tatami.Collections.StatusesTags = StatusesTags;
    Tatami.Collections.StatusesUsers = StatusesUsers;
    Tatami.Collections.StatusesGroups = StatusesGroups;
    Tatami.Collections.StatusesSearch = StatusesSearch;

})(Backbone, Tatami);