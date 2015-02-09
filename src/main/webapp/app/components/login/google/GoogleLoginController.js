LoginModule.controller('GoogleLoginController', ['$scope', '$http', function($scope, $http) {
    $scope.login = function() {
        $http({
            method: 'POST',
            url: '/tatami/j_spring_openid_security_check',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Access': '*'
            },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { openid_identifier: 'https://www.google.com/accounts/o8/id' }
        })
            .success(function(data) {
                console.log('success');
                console.log(data);
            })
            .error(function(data) {
                console.log('error');
                console.log(data);
            })
    }
}]);