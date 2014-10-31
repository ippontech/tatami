tatamiApp.factory('GroupService', ['$resource', function($resource){
    return $resource('/tatami/rest/groups/:groupId');
}]);