DailyStatusModule.factory('DailyStatusData', ['$q', 'UserService', function($q, UserService) {
    return function(userData) {
        var data = [];
        for(var i = 0; i < userData.length; ++i) {
            data.push(UserService.get({ username: userData[i].username }));
            data[i]['dailyCount'] = userData[i].statusCount;
        }
        return data;
    }
}]);