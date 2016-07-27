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
            $state.go('login');

        };
        $scope.search = {};

        $scope.search = function() {

            return SearchService.get({ term: 'all', q: $scope.search.term }).$promise.then(function(result) {
                if(angular.isDefined(result.groups[0])) {
                    console.log("groups is true");
                    result.groups[0].firstGroup = true;
                }
                if(angular.isDefined(result.tags[0])) {
                    console.log("tags is true");
                    result.tags[0].firstTag = true;
                }
                if(angular.isDefined(result.users[0])) {
                    console.log("users is true");
                    result.users[0].firstUser = true;
                }
                $scope.allSearch = result.groups.concat(result.users.concat(result.tags));
            })

        };

        $scope.goToPage = function($item) {
            console.log($item);
            $scope.search.term = '';
            if($item.groupId) {
                $scope.$state.go('groupStatus', { groupId: $item.groupId });
            }
            else if($item.username) {
                $scope.$state.go('profileStatuses', { email: $item.username });
            }
            else if(!$item.groupId) {
                $scope.$state.go('tag', { tag: $item.name })
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

