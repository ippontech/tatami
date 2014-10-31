var tatamiApp = angular.module('tatamiApp', ['ngResource', 'ui.bootstrap', 'angularFileUpload']);

// Testing a new commit
tatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);