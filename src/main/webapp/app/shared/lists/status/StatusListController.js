HomeModule.controller('StatusListController', ['$scope', 'StatusService', 'profile', 'statuses',
    function($scope, StatusService, profile, statuses) {
        $scope.profile = profile;
        $scope.statuses = statuses;

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        },

        $scope.favoriteStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    $scope.statuses[index].favorite = response.favorite;
            });
        },

        $scope.shareStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    $scope.statuses[index].shareByMe = response.shareByMe;
            });
        },

        $scope.deleteStatus = function(status, index, confirmMessage) {
            // Need a confirmation modal here
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    $scope.statuses.splice(index, 1);
            });
        }
    }
]);