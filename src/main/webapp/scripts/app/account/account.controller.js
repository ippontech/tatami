'use strict';

angular.module('tatamiJHipsterApp')
    .controller('AccountController', ['$scope', '$location', 'profileInfo', function ($scope, $location, profileInfo) {
        $scope.profile = profileInfo;
    }]);
