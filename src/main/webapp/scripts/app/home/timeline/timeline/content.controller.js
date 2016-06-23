'use strict';
angular.module('tatamiJHipsterApp')
    .controller('TimelineController', ['$scope', 'statuses',
        function($scope, statuses) {
            $scope.statuses = statuses;
        }
    ]);
