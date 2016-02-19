'use strict';

angular.module('tatamiJHipsterApp')
    .controller('FormController', function ($scope, $state) {
        // Forwards from the parent state to the default child state.
        $scope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name === 'account.groups') {
                $state.go('account.groups.main.top.list');
            }
            else if (toState.name === 'account.tags') {
                $state.go('account.tags.following');
            }
            else if (toState.name === 'account.users') {
                $state.go('account.users.following');
            }
        });
    });
