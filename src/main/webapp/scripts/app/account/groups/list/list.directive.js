'use strict';

tatamiJHipsterApp
    .directive('tatamiGroupList', function () {
        return {

            restrict : 'E',
            templateUrl : 'scripts/app/account/groups/list/list.html',
            scope: {
                userGroups : '='
            },
            controller : 'GroupsListController'
        };
    });
