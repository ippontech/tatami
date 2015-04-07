TopMenuModule.controller('TopMenuController', [
    '$scope',
    '$window',
    '$http',
    '$translate',
    'UserSession',
    'SearchService',
    function($scope, $window, $http, $translate, UserSession, SearchService) {
        $scope.current = {};
        $scope.current.searchString = '';

        $scope.logout = function() {
            $http.get('/tatami/logout')
                .success(function() {
                    UserSession.clearSession();
                    $scope.$state.go('tatami.login.main');
                });
        };
        //Method to redirect to blog based on language. 
        $scope.goToBlog = function() {
            var lang = $translate.use();
            // if it fails to detect the one being used, it will look for the proposed one.
            // Useful in asynchronous scenarios. Check StackOverflow for examples
            if (lang!='fr' && lang!='en')
                lang=$translate.proposedLanguage();
           switch (lang) {
               case 'fr':
                   window.open("http://blog.ippon.fr/");
                   break;
               default:
                   window.open('http://www.ipponusa.com/blog/');
                   break;
           }
        };

        $scope.changeLanguage = function(key) {
            $translate.use(key);
        };

        $scope.getResults = function(searchString) {
            return SearchService.get({ term: 'all', q: searchString }).$promise.then(function(result) {
                console.log(result);
                if(angular.isDefined(result.groups[0])) {
                    result.groups[0].firstGroup = true;
                }
                if(angular.isDefined(result.tags[0])) {
                    result.tags[0].firstTag = true;
                }
                if(angular.isDefined(result.users[0])) {
                    result.users[0].firstUser = true;
                }
                return result.groups.concat(result.users.concat(result.tags));
            })
        };

        $scope.search = function() {
            console.log($scope.current.searchString);
            if($scope.current.searchString.length > 0) {
                SearchService.get({ term: 'all', q: $scope.current.searchString }, function(result) {
                    console.log(result);
                    // Now render the result in a dropdown box
                })
            }
        };

        $scope.goToPage = function($item, $model, $label) {
            console.log($item);
            if($item.groupId) {
                $scope.$state.go('tatami.home.home.group.statuses', { groupId: $item.groupId });
            }
            else if($item.login) {
                $scope.$state.go('tatami.home.profile.statuses', { username: $item.username });
            }
            else if(!$item.groupId) {
                $scope.$state.go('tatami.home.home.tag', { tag: $item.name })
            }
        }
}]);