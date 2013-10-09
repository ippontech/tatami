(function(Backbone, Tatami){

    var groups = new (Backbone.Collection.extend({
        model : Tatami.Models.Group
    }))();

    Tatami.Factories.Groups = {
        groupsHeader: function(groupId){
            var group = groups.get(groupId);
            if(!group){
                group = new Tatami.Models.Group({
                    groupId: groupId
                });
                groups.add(group);
                group.fetch({
                    error: function(){
                        Tatami.app.router.defaults();
                    }
                });
            }

            return new Tatami.Views.GroupsHeader({
              model: group
            });
        },
        groupsBody: function(groupId){
            return new Tatami.Views.GroupsBody({
                group: groupId
            });
        }, 
        groupsUser: function(groupId){
            var c = new Tatami.Collections.UsersInGroup();
            c.group = groupId;
            return new Tatami.Views.UserList({
                collection: c
            });
        }  ,

        groupUsers: function(groupId){
            var c = new Tatami.Collections.UsersInGroup();
            c.group = groupId;
            c.fetch();
            return new Tatami.Views.UserGroupList({
                collection: c
            });
        },

        groupsSubscribe: function(){
            var c = new Tatami.Collections.GroupsList();
            c.fetch();
            return new Tatami.Views.GroupsList({
                collection: c
            });
        },

        groupsRecommended: function(){
            var c = new Tatami.Collections.GroupsRecommended();
            c.fetch();
            return new Tatami.Views.GroupsList({
                collection: c
            });
        },

        newGroup: function(){
            var mGroup = new MGroup();
            var vNewGroup = new VAddGroup({model : mGroup});

            return vNewGroup
        }


    };

})(Backbone, Tatami);