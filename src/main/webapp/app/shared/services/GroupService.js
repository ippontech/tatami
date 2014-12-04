TatamiApp.factory('GroupService', ['$resource', function($resource) {
    return $resource('/tatami/rest/groups/:groupId', { },
        {
            'getRecommendations': { method: 'GET', isArray: true, url: '/tatami/rest/groupmemberships/suggestions' },
            'getMembers': { method: 'GET', isArray: true, params: { groupId: '@groupId' }, url: '/tatami/rest/groups/:groupId/members/' }
    });
}]);