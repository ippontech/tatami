'use strict';

angular.module('tatamiJHipsterApp')
.controller('HomeController', ['$scope', '$state', '$location', 'profileInfo',
    function($scope, $state, $location, profileInfo) {
        $scope.profile = profileInfo;

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
    }]);
