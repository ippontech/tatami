
var CUserSearch = Backbone.Collection.extend({
    url : '/tatami/rest/users/search',

    model : MUserSearch,

    search : function(q, callback) {
        var self = this;
        this.fetch({
            data : {
                q : q
            },
            success : function(collection){
                var result = self.removeAlreadyMember();
                callback(result);
            }
        });
    },

    removeAlreadyMember : function(){
        var collectionFilter = this.options.filter;
        if(typeof collectionFilter != 'undefined'){
            return this.filter(function(result){
                var isAlreadyMember = collectionFilter.find(function(user){
                    var isEqual = user.get('username') === result.get('username');
                    return isEqual;
                });
                return !isAlreadyMember;
            });
        } else {
            return this.toArray();
        }
    }
});