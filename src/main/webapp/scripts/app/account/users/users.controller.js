'use strict';

tatamiJHipsterApp
    .controller('UsersController', ['$scope','$state', function($scope, $state) {
        $scope.$state = $state;
        console.log($scope.$state.current);
        //$scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;
        /**
         * Information about the current state of the view
         * @type {{searchString: string}}
         */

    }]);
