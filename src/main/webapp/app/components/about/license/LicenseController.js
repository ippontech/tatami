AboutModule.controller('LicenseController', ['$scope',
    function($scope) {
        $scope.time=" 2012-"+new Date().getFullYear()+" ";
        $("#endYear").html($scope.time);
    }
]);