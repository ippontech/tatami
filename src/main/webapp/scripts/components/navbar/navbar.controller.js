'use strict';

tatamiJHipsterApp
    .controller('NavbarController', function ($scope, $location, $state, Auth, Principal, ENV, PostModalService, SearchService) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.inProduction = ENV === 'prod';
        $scope.$state = $state;
        $scope.logout = function () {
            Auth.logout();
            $state.go('home');
        };
        $scope.search = {};

        $scope.search = function() {
            console.log($scope.search.term);
            return SearchService.searchUsers({ query: $scope.search.term });
        };


        $scope.changeLanguage = function () {
        };

        $scope.goToBlog = function () {
        };

        $scope.restart = function () {
        };

        $scope.openPostModal = function () {
            PostModalService.openPostModal();
        }

    });

