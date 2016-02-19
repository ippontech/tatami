'use strict';

angular.module('tatamiJHipsterApp')
    .controller('GroupController', function ($state) {
        if ($state.name === 'groups.main') {
            $state.go('groups.main.top.list');
        }
    });
