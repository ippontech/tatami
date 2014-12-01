SidebarModule.factory('SuggestionService', ['$resource', function($resource) {
    return $resource('/tatami/rest/users/suggestions');
}]);