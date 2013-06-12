(function(Backbone, Tatami){

    var Group = Backbone.Model.extend({
        urlRoot: '/tatami/rest/groups',
        idAttribute: 'groupId',
        defaults: {
            publicGroup: true,
            archivedGroup: false,
            name: '',
            description: '',
            counter: 0,
            member: false, 
            administrator: false
        },
        toggleMember: function(name){            
            this.url = this.urlRoot+'/'+this.id+'/members/'+name;
            if(this.get('member')){
                this.destroy();
            } else {
                this.save();                
            }
        }
    });

    Tatami.Models.Group = Group;

})(Backbone, Tatami);