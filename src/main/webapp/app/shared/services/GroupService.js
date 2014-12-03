TatamiApp.factory('GroupService', ['$resource', function($resource) {
    return $resource('/tatami/rest/groups/:groupId', { },
        {
            'getRecommendations': { method: 'GET', isArray: true, url: '/tatami/rest/groupmemberships/suggestions'}
        });
}]);