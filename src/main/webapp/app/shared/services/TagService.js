TatamiApp.factory('TagService', ['$resource', function($resource) {
    return $resource('/tatami/rest/tags:isPop');
    // How to have parameters in the url like :popular (t/f)?
}]);