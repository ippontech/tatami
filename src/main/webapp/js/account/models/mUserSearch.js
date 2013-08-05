
var MUserSearch = Backbone.Model.extend({
    toString : function(){
        return this.get('username');
    },
    toLowerCase : function(){
        return this.toString().toLowerCase();
    },
    replace : function(a, b, c){
        return this.toString().replace(a, b, c);
    }
});
