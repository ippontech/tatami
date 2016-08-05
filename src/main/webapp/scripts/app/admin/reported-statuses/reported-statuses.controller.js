'use strict';


tatamiJHipsterApp
    .controller('ReportedStatusesController', ['$scope', 'ReportService',
        function($scope, ReportService) {
            $scope.statuses = [];

            $scope.getStatuses = function () {
                ReportService.getReportedStatuses({}, function (response) {
                    $scope.statuses = response;
                });
            };
        }
]);
