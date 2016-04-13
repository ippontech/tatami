'use strict';

tatamiJHipsterApp
    .controller('NavbarController', function ($scope, $location, $state, Auth, Principal, ENV, PostModalService, SearchService) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.inProduction = ENV === 'prod';
        $state.isAdmin = Principal.hasAnyAuthority(["ROLE_ADMIN"]); //added to preserve admin post page refresh
        $scope.$state = $state;
        $scope.logout = function () {
            Auth.logout();
            $state.isAdmin = false;
            $state.go('home');

        };
        $scope.search = {};

        $scope.search = function() {
            if($scope.search.term.length > 0) {
                return SearchService.get({ term: 'all', q: $scope.search.term });
            }
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

