/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 31/07/13
 * Time: 16:27
 * To change this template use File | Settings | File Templates.
 */
(function(Backbone, Tatami){

    Tatami.Factories.Admin = {
        profile: function(){
            var mAccountProfile = new MAccountProfile();
            return new VAccountProfile({model: mAccountProfile});
        },

        destroyProfile: function(){
            var mAccountProfile = new MAccountProfile();
            return new VAccountProfileDestroy({model: mAccountProfile});
        },

        preferences: function(){
            var mPreferences = new MPreferences();
            return new VPreferences({model : mPreferences});
        },

        password: function(){
            var mPassword = new MPassword();
            return new VPassword({model : mPassword});
        },

        editGroup: function(id){
            return new VEditGroup({
                groupId : id
            });
        },

        addUserInGroup: function(id){
            var collection = new CListUserGroup();
            collection.options = {
                groupId : id
            };

            return new VAddUserGroup({
                collection : collection
            });
        },

        dailyStats: function(){
            var cDailyStats = new CDailyStat();
            return new VDailyStats({ collection : cDailyStats});

        },

        tabMenu: function(template){
            return new VTabMenu({template : template});
        },

        tabSearch: function(inputURL, url ){
             return new VTabSearch({inputURL : inputURL, urlHistory : url});
        },

        quotaFiles: function(){
            return new Tatami.Views.QuotaFiles({model : new Tatami.Models.Quota()});
        },

        listFiles: function(){
            var c = new Tatami.Collections.FilesPage();
            c.fetch();
            return new Tatami.Views.FilesList({
                collection: c
            });
        }
    };

})(Backbone, Tatami);