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
        //$scope.validatePrefs();
        PreferencesService.save($scope.prefs, function() {
            ngToast.create($translate.instant('tatami.form.success'));
        }, function() {
            ngToast.create({
                content: $translate.instant('tatami.form.fail'),
                class: 'danger'
            })
        });
    };

    $scope.validatePrefs = function() {
        for(var pref in $scope.prefs) {
            if($scope.prefs.hasOwnProperty(pref) && $scope.prefs[pref] === null) {
                if('rssUid' === $scope.prefs[pref]) {
                    continue;
                }
                console.log($scope.prefs[pref]);
                $scope.prefs[pref] = false;
                console.log(pref + " " + $scope.prefs[pref]);
            }
        }
    }
}]);