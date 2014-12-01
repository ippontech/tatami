PreferencesModule.factory('PreferencesService', function($resource) {
    return $resource('/tatami/rest/account/preferences');
});