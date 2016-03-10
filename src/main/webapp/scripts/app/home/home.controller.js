'use strict';

angular.module('tatamiJHipsterApp')
.controller('HomeController', ['$scope', '$state', '$location', 'profileInfo',
    function($scope, $state, $location, profileInfo) {
        $scope.profile = profileInfo;
        $scope.currentState = $state.$current.name;
    }]);
