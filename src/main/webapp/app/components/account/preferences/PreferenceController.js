PreferenceModule.controller('PreferenceController', ['$scope', 'PreferenceService', function($scope, PreferenceService){

    $scope.prefs = {                // Sets the users current preferences
        mentionEmail: false,         // Determine if the user wants to be notified of mentions via email
        dailyDigest: false,         // Determine if the user wants to receive an email with the daily digest
        weeklyDigest: false,         // Determine if the user wants to receive an email with the weekly digest
        rssUidActive: false,        // Determine if an RSS feed can be used for your time line
        rssUid: null                // The uid for the RSS feed
    };

    var prefs = PreferenceService.get(function (result){
        $scope.prefs = result;
    });

    /**
     * This method is used to allow the user to modify what information is received via email
     * and whether an RSS feed can be used
     */
    $scope.savePrefs = function(){
        PreferenceService.save($scope.prefs);
    };
}]);