'use strict';

tatamiJHipsterApp
    .controller('NavbarController', function ($scope, $location, $state, Auth, Principal, ENV) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';

        $scope.logout = function () {
            Auth.logout();
            $state.go('home');
        };

        $scope.openPostModal = function () {
            $scope.$state.go($scope.$state.current.name + '.post');
        }

        $scope.changeLanguage = function () {
        }

        $scope.goToBlog = function () {
        }

        $scope.restart = function () {
        }
    });

