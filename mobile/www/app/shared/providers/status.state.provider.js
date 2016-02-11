(function() {
    'use strict';

    // This will dynamically create any tab substates inside the current tab. If in the timeline tab, we will
    // create a timeline.status state
    angular.module('tatami.providers')
        .provider('StatusState', statusState);

    statusState.$inject = ['$stateProvider'];
    function statusState($stateProvider) {
        this.$get = StatusStateHelper;

        function StatusStateHelper() {

            var viewConfig = {
                templateUrl: 'app/shared/state/status/status.html',
                controller: 'StatusCtrl',
                controllerAs: 'vm'
            };

            var views = [];
            views['timeline@home'] = { 'timeline@home': viewConfig };
            views['mentions@home'] = { 'mentions@home': viewConfig };
            views['favorites@home'] = { 'favorites@home': viewConfig };

            var service = {
                addStatusState: addStatusState
            };

            return service;

            function addStatusState(prefixName, parentName) {
                console.log(views['timeline@home']);
                var viewName = prefixName + '@' + parentName;
                $stateProvider.state(prefixName + '.status', {
                    url: '/status/:statusId',
                    views: views[prefixName + '@' + parentName],
                    resolve: {
                        status: getStatus
                    }
                });

                getStatus.$inject = ['$stateParams', 'StatusService'];
                function getStatus($stateParams, StatusService) {
                    return StatusService.get({ statusId : $stateParams.statusId }).$promise;
                }
            }


        }
    }

})();
