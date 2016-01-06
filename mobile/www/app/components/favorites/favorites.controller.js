angular.module('tatami')
    .controller('FavoritesCtrl', function ($scope, Favorites) {
        $scope.favorites = Favorites.all();
        $scope.remove = function (favorite) {
            Favorites.remove(favorite);
        };
    });
