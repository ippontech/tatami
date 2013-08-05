


var CListUserGroup = Backbone.Collection.extend({
    model : MUserGroup,
    url : function() {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});