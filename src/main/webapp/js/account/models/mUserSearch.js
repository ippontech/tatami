/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 16:17
 * To change this template use File | Settings | File Templates.
 */


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