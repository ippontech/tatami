'use strict';

tatamiJHipsterApp
    .directive('tatamiGroupCreate',function () {
        return {
            restrict : 'E',
            templateUrl : 'scripts/app/account/groups/create/create.html',
            controller : 'GroupsCreateController'
        };
    });
