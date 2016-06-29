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
                user.username = rawStats[i].username;
                user.statusCount = rawStats[i].statusCount;

                UserService.get({email: user.username}, function (userResult) {
                    //console.log(userResult);
                    for (var j = 0; j < rawStats.length; j++) {
                        if (rawStats[j].username == userResult.email) {
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
