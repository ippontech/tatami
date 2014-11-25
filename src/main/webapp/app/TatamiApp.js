var TatamiApp = angular.module('TatamiApp', ['TimelineModule', 'SidebarModule', 'StatusModule', 'PreferenceModule', 'pascalprecht.translate', 'AccountModule', 'PasswordModule', 'GroupModule',
                                             'ProfileModule', 'TagModule', 'UsersModule']);

TatamiApp.config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from REST URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);