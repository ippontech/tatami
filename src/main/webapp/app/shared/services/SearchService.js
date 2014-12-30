TatamiApp.factory('SearchService', ['$resource', function($resource){
    return $resource('/tatami/rest/search/:term');
}]);