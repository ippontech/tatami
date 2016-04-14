'use strict';



angular.module('tatamiJHipsterApp')
    .controller('LoginController', function ($rootScope, $window, $scope, $state, $http, $timeout, $location, Auth, localStorageService, usSpinnerService) {
        $scope.user = {};
        $scope.errors = {};

        /*Spinner stuff
        $scope.startSpin = function() {
            usSpinnerService.spin('spinner-1');
        };*/

        var googleToken = $location.absUrl();
        console.log(googleToken);
        if(googleToken.contains('Token'))
        {
            googleToken = googleToken.split('=')[1];
            console.log(googleToken);
            var gAuthToken ={
                token: googleToken,
                expires: googleToken.split(':')[1]
            };
            localStorageService.set('token',gAuthToken);
            $state.go('timeline');
        }
        //$scope.loading = false;
        $scope.rememberMe = false;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    $state.go('home');
                } else {
                    $state.isAdmin = Principal.hasAnyAuthority(["ROLE_ADMIN"]);
                    $state.go('timeline');
                }
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };
        $scope.registerUser = function(){
            $state.go('register');
        };
        $scope.resetPassword = function() {
            Auth.resetPasswordInit($scope.user.email)
        };
        $scope.googleLogin = function() {
            $window.location.href = "http://localhost:8080/tatami/rest/builder";
        };
            if (typeof String.prototype.startsWith != 'function') {
                String.prototype.startsWith = function (str) {
                    return this.indexOf(str) == 0;
                };
            }

    });
    /*.directive('myLoadingSpinner', function() {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            scope: {
                loading: '=myLoadingSpinner'
            },
            //templateUrl: 'spinjs.html',
            link: function(scope, element, attrs) {
                var opts = {
                    lines: 13 // The number of lines to draw
                    , length: 28 // The length of each line
                    , width: 14 // The line thickness
                    , radius: 42 // The radius of the inner circle
                    , scale: 1 // Scales overall size of the spinner
                    , corners: 1 // Corner roundness (0..1)
                    , color: '#000' // #rgb or #rrggbb or array of colors
                    , opacity: 0.25 // Opacity of the lines
                    , rotate: 0 // The rotation offset
                    , direction: 1 // 1: clockwise, -1: counterclockwise
                    , speed: 1 // Rounds per second
                    , trail: 60 // Afterglow percentage
                    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                    , zIndex: 2e9 // The z-index (defaults to 2000000000)
                    , className: 'spinner' // The CSS class to assign to the spinner
                    , top: '50%' // Top position relative to parent
                    , left: '50%' // Left position relative to parent
                    , shadow: false // Whether to render a shadow
                    , hwaccel: false // Whether to use hardware acceleration
                    , position: 'absolute' // Element positioning
                };
                var loadingContainer = element.find('.my-loading-spinner-container')[0];
                var spinner = new Spinner(opts).spin();
                target.appendChild(spinner.el);
            }
        };
    });*/
