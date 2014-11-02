var TatamiApp = angular.module('TatamiApp', ['TimelineModule', 'TatamModule']);

TatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);