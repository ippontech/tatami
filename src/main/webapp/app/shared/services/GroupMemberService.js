TatamiApp.factory('GroupMemberService', ['$resource', function($resource){
    return $resource('/tatami/rest/groups/:groupId/members/');
}]);