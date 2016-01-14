(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiUserDetail', tatamiUserDetail);

    function tatamiUserDetail() {
        var directive = {
            restrict: 'E',
            scope: {
                user: '='
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/user/user-detail.html'
        }
    };

    controller.$inject = ['$scope'];
    function con
})
