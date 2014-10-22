/**
 * Created by kenny on 10/2/14.
 */
var tatamiApp = angular.module('tatamiApp', ['ngResource']);


tatamiApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

/*
 tatamiApp
 .config(function($routeProvider){
 $routeProvider
 .when('/createStatus', {

                templateUrl:
                controller:
            }
    })
*/