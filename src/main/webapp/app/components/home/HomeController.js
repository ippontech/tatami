HomeModule.controller('HomeController', ['$scope', 'StatusService', 'ProfileService', 
    function($scope, StatusService, ProfileService) {
        $scope.statuses = StatusService.getTimeline();
        $scope.profile = ProfileService.get();

        $scope.favoriteStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses[index].favorite = response.favorite;
            });
        },

        $scope.shareStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses[index].shareByMe = response.shareByMe;
            });
        },

        $scope.deleteStatus = function(status, confirmMessage) {
            // Put a confirmation modal here
            StatusService.delete({ statusId: status.statusId }, { },
                function() {
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses.splice(index, 1);
            });
        }
    }
]);