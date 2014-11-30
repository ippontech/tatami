PreferenceModule.factory('PreferenceService', function($resource) {
    return $resource('/tatami/rest/account/preferences/');
})