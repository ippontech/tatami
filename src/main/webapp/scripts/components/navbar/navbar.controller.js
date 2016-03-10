'use strict';

tatamiJHipsterApp
    .controller('NavbarController', function ($scope, $location, $state, Auth, Principal, ENV, PostModalService) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.inProduction = ENV === 'prod';
        $scope.$state = $state;
        console.log($state.$current);
        $scope.logout = function () {
            Auth.logout();
            $state.go('home');
        };

        $scope.changeLanguage = function () {
        }

        $scope.goToBlog = function () {
        }

        $scope.restart = function () {
        }

        $scope.openPostModal = function () {
            PostModalService.openPostModal();
        }

    });

