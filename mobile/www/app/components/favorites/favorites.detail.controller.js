angular.module('tatami')
    .controller('FavoritesDetailCtrl', function ($scope, $stateParams, Favorites) {
        $scope.favorite = Favorites.get($stateParams.favoriteId);
    });
