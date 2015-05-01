TopMenuModule.controller('TopMenuController', [
    '$scope',
    '$window',
    '$http',
    '$translate',
    'amMoment',
    'UserSession',
    'SearchService',
    function($scope, $window, $http, $translate, amMoment, UserSession, SearchService) {
        $scope.current = {};
        $scope.current.searchString = '';

        $scope.$on('start-tour', function() {
            $scope.tour.restart(true);
        });

        $scope.changeLanguage = function(key) {
            $translate.use(key);
            amMoment.changeLocale(key);
        };

        $scope.openPostModal = function() {
            $scope.$state.go($scope.$state.current.name + '.post');
        };

        $scope.logout = function() {
            $http.get('/tatami/logout')
                .success(function() {
                    UserSession.clearSession();
                    $scope.$state.go('tatami.login.main');
                    $scope.searchString = '';
                });
        };

        // Method to redirect to blog based on language. 
        $scope.goToBlog = function() {
            var lang = $translate.use();
            // If it fails to detect the one being used, it will look for the proposed one.
            // Useful in asynchronous scenarios.
            if(lang != 'fr' && lang != 'en')
                lang = $translate.proposedLanguage();
           switch(lang) {
               case 'fr':
                   window.open("http://blog.ippon.fr/");
                   break;
               default:
                   window.open('http://www.ipponusa.com/blog/');
                   break;
           }
        };

        $scope.getResults = function(searchString) {
            return SearchService.get({ term: 'all', q: searchString }).$promise.then(function(result) {
                if(angular.isDefined(result.groups[0])) {
                    result.groups[0].firstGroup = true;
                }
                if(angular.isDefined(result.tags[0])) {
                    result.tags[0].firstTag = true;
                }
                if(angular.isDefined(result.users[0])) {
                    result.users[0].firstUser = true;
                }
                //$scope.results = result.groups.concat(result.users.concat(result.tags));
                return result.groups.concat(result.users.concat(result.tags));
            })
        };

        $scope.changeInput = function(param) {
            $scope.searchString = param;
        };

        $scope.searchStatuses = function(e) {
            // If the enter key is pressed
            if(e.keyCode === 13) {
                $scope.$state.go('tatami.home.search', { searchTerm: $scope.searchString });
            }
        };

        $scope.goToPage = function($item, $model, $label) {
            if($item.groupId) {
                $scope.$state.go('tatami.home.home.group.statuses', { groupId: $item.groupId });
            }
            else if($item.login) {
                $scope.$state.go('tatami.home.profile.statuses', { username: $item.username });
            }
            else if(!$item.groupId) {
                $scope.$state.go('tatami.home.home.tag', { tag: $item.name })
            }
        };
}]);