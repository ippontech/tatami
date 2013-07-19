(function(Backbone, Tatami){

    var Tag = Backbone.Model.extend({
        initialize: function(){
            var self = this;

            this.listenTo(Tatami.app, 'model:tag:' + this.id, function(model){
                model.keys().forEach(function(key){
                    var value = model.get(key);
                    if (self.get(key) !== value) self.set(key, value);
                });
            });
            this.listenTo(this, 'change', function(){
                Tatami.app.trigger('model:tag:' + self.id, self);
            });
        },
        urlRoot: '/tatami/rest/tags',
        idAttribute: 'name',
        defaults: {
            name : '',
            followed: false,
            trendingUp: false
        }
    });

    Tatami.Models.Tag = Tag;

})(Backbone, Tatami);