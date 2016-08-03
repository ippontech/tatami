(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('AccountService', accountService);

    accountService.$inject = ['$resource', 'PathService'];
    function accountService($resource, PathService) {

        return $resource('/tatami/rest/account/admin', null, null);
    }

})();
