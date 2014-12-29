PreferencesModule.controller('PreferencesController', ['$scope', 'PreferencesService', 'prefs', function($scope, PreferencesService, prefs) {

    $scope.prefs = prefs;

    // Update user preferences
    $scope.savePrefs = function() {
        PreferencesService.save($scope.prefs);
    };
}]);