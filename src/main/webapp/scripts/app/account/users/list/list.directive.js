'use strict';

tatamiJHipsterApp
    .directive('tatamiUsersList', function () {
        return {

            restrict : 'E',
            templateUrl : 'scripts/app/account/users/list/list.html',
            scope: {
                usersList : '='
            },
        };
    });
