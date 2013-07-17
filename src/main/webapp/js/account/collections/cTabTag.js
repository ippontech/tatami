/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 14:32
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, Tatami){
var CTabTag = Backbone.Collection.extend({
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/tagmemberships/list',
            recommended: '/tatami/rest/tags/popular',
            search: '/tatami/rest/search/tags'
        };
    },
    recommended: function(){
        this.url = this.options.url.recommended;
        this.parse = function(tags){
            return tags.filter(function(tag){
                return !(tag.followed);
            });
        };
        this.reset();
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.parse = function(tags){
            return tags;
        };
        this.reset();
        this.fetch();
    },

    search: function(query){
        this.url = this.options.url.search;
        this.reset();
        this.fetch({
            data:{
                q:query
            }
        })
    }
});
//})(Backbone, Tatami);