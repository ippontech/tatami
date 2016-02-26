'use strict';

angular.module('tatamiJHipsterApp')
.controller('HomeController', ['$scope', '$state', '$location', 'profileInfo',
    function($scope, $state, $location, profileInfo) {
        console.log("in HomeController");
        $scope.profile = profileInfo;
        console.log(profileInfo);
        console.log($state);
        console.log($state.includes('timeline'));

        // Dictates what is displayed on the header of the timelineHeader.html page:
        $scope.state = "unassigned";
        if ($state.includes('timeline')) {
            $scope.state = "timeline";
        } else if ($state.includes('mentions')) {
            $scope.state = "mentions";
        } else if ($state.includes('favorites')) {
            $scope.state = "favorites";
        } else if ($state.includes('company')) {
            $scope.state = "company";
        }

        console.log($scope.state);
    }]);
