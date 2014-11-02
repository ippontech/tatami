var TatamiApp = angular.module('TatamiApp', ['TimelineModule', 'SidebarModule', 'StatusModule']);

TatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);