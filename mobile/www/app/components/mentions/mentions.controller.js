angular.module('tatami')
    .controller('MentionsCtrl', function ($scope, Mentions) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.mentions = Mentions.all();
        $scope.remove = function (mention) {
            Mentions.remove(mention);
        };
    }
);
