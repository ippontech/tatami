/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 15:34
 * To change this template use File | Settings | File Templates.
 */


var CAdminGroup = Backbone.Collection.extend({
    model : MGroup,
    url: '/tatami/rest/admin/groups'
});

var CTabGroup = Backbone.Collection.extend({
    model : MGroup,
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/groups',
            recommended: '/tatami/rest/groupmemberships/suggestions',
            search: '/tatami/rest/search/groups'
        };
    },
    recommended: function(){
        this.url = this.options.url.recommended;
        this.parse = function(data, options){
            return data.filter(function(model){
                return model.publicGroup;
            });
        };
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.parse = function(data, options){
            return data;
        };
        this.fetch();
    },
    search: function(query){
        this.url = this.options.url.search;
        this.fetch({
            data:{
                q: query
            }
        })
    }
});

var CListUserGroup = Backbone.Collection.extend({
    model : MUserGroup,
    url : function() {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});