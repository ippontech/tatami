PreferencesModule.controller('PreferencesController', [
    '$scope',
    '$translate',
    'PreferencesService',
    'prefs',
    'ngToast',
    function($scope, $translate, PreferencesService, prefs, ngToast) {

    $scope.prefs = prefs;

    // Update user preferences
    $scope.savePrefs = function() {
        PreferencesService.save($scope.prefs, function() {
            ngToast.create($translate.instant('tatami.form.success'));
        }, function() {
            ngToast.create({
                content: $translate.instant('tatami.form.fail'),
                class: 'danger'
            })
        });
    };
}]);