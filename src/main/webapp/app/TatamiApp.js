var TatamiApp = angular.module('tatamiApp', ['TatamModule']);

TatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);