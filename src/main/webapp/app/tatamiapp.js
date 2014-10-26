var tatamiApp = angular.module('tatamiApp', ['ngResource']);


tatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);