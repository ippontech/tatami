tatamiJHipsterApp
    .controller('TopPostersController', function ($scope, UserService, Language, StatsService) {
        //combining in userdata module because this is the only place it's used

        $scope.topPosters = [];
        var rawStats = [];
        StatsService.get({},function(result){
            rawStats = result;
            for (var i = 0; i<rawStats.length;i++){
                //get rest of user info
                var user = {};
                user.username = rawStats[i].username;
                user.statusCount = rawStats[i].statusCount;
                console.log(user);

                UserService.get({email: user.username}, function(userResult){
                    //console.log(userResult);
                    for(var j=0; j<rawStats.length;j++){
                        if( rawStats[j].username == userResult.email){
                            rawStats[j].info = userResult;
                            $scope.topPosters.push(rawStats[j]);
                            $scope.topPosters.sort(function(a, b) {
                                            return a.statusCount < b.statusCount ? 1 : -1;
                                        });
                            break;
                        }
                    }




                });
            }
        });


    });
