/**
 * Created by kenny on 10/2/14.
 */
var tatamiApp = angular.module('tatamiApp', ['ngResource']);

tatamiApp.config(['$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript */*; q=0.01';
}])
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