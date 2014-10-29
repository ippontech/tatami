var tatamiApp = angular.module('tatamiApp', ['ngResource', 'ui.bootstrap', 'angularFileUpload']);


tatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);