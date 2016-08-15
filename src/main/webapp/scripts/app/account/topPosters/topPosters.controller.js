(function () {
    'use strict';

    angular.module('tatamiJHipsterApp')
        .controller('TopPostersController', TopPostersController);
//combining in userdata module because this is the only place it's used

    TopPostersController.$inject = [
        'UserService',
        'StatsService'
    ];

    function TopPostersController(UserService, StatsService) {
        var vm = this;
        vm.topPosters = [];
        StatsService.get({}, function (result) {
            var rawStats = [];
            rawStats = result;
            for (var i = 0; i < rawStats.length; i++) {
                //get rest of user info
                var user = {};
                // we're using username now for UserService.get(), but result only gives us the email
                // and i don't really have time to fix that, so instead, we'll trim the email to everything before the @
                user.email = rawStats[i].email.split('@')[0];
                user.statusCount = rawStats[i].statusCount;
                UserService.get({username: user.email}, function (userResult) {
                    for (var j = 0; j < rawStats.length; j++) {
                        if (rawStats[j].email == userResult.email) {
                            rawStats[j].info = userResult;
                            vm.topPosters.push(rawStats[j]);
                            vm.topPosters.sort(function (a, b) {
                                return a.statusCount < b.statusCount ? 1 : -1;
                            });
                            break;
                        }
                    }


                });
            }
        });


    }


})();
