tatamiApp.factory('GroupService', ['$resource', function($resource){
    return{
        getGroups: function () {
            var groups = $resource('/tatami/rest/groups/');
            return groups.query();
        }
    }
}]);