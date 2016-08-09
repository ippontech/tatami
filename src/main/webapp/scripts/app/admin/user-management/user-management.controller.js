'use strict';

tatamiJHipsterApp
    .controller('UserManagementController', function ($scope, UserService, ParseLinks, Language) {
        $scope.users = [];
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];
        $scope.busy = false;
        $scope.pagination = 0;

        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });

        $scope.page = 1;
        $scope.loadAll = function () {
            UserService.query({}, function (result) {
                $scope.users = result;
                $scope.pagination = $scope.users.length;
            });
        };

        $scope.loadPage = function (page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.setActive = function (user, isActivated) {
            user.activated = isActivated;
            UserService.update(user, function () {
                $scope.loadAll();
                $scope.clear();
            });
        };

        $scope.getMoreUsers = function (){
            if($scope.busy || $scope.end) {
                return;
            }

            $scope.busy = true;

            UserService.query({ finish: $scope.finish, pagination: $scope.pagination }, $scope.loadMoreUsers);
        }

        $scope.loadMoreUsers = function (results){

            if(results.length === 0){
                $scope.end = true; // reached end of list
                return;
            }

            $scope.pagination += results.length;

            for(var i = 0; i < results.length; i++) {
                //This is a super hacky fix, but not sure of a better way to fix it.
                if($scope.users[$scope.users.length-1].id != results[i].id){
                    $scope.users.push(results[i]);
                }
            }

            $scope.finish = results[results.length - 1].id;
            $scope.busy = false;
        };


        $scope.clear = function () {
            $scope.user = {
                id: null, login: null, firstName: null, lastName: null, email: null,
                activated: null, langKey: null, createdBy: null, createdDate: null,
                lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                resetKey: null, authorities: null
            };
            //$scope.editForm.$setPristine();
            //$scope.editForm.$setUntouched();
        };
    });
