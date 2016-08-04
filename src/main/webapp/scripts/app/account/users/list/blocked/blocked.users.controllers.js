'use strict';

tatamiJHipsterApp
    .controller('BlockedUsersController', blockedUsersController);

blockedUsersController.$inject = ['$scope', 'usersList'];
function blockedUsersController($scope, usersList) {

    $scope.usersList = usersList;
}
