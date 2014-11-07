var TatamiApp = angular.module('TatamiApp', ['TimelineModule', 'SidebarModule', 'StatusModule', 'pascalprecht.translate']);

TatamiApp.config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);