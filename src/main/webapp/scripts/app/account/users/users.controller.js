'use strict';

tatamiJHipsterApp
    .controller('UsersController', ['$scope','$state', 'domain', function($scope, $state, domain) {
        $scope.domain = domain;

        //console.log($scope.$state.current);
        //$scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;
        /**
         * Information about the current state of the view
         * @type {{searchString: string}}
         */


    }]);
