(function() {
    'use strict';

    // This will dynamically create any tab substates inside the current tab. If in the timeline tab, we will
    // create a timeline.status state
    angular.module('tatami.providers')
        .provider('TatamiState', tatamiState);

    tatamiState.$inject = ['$stateProvider'];
    function tatamiState($stateProvider) {
        this.$get = tatamiStateHelper;

        function tatamiStateHelper() {

            var statusViewConfig = {
                templateUrl: 'app/shared/state/status/status.html',
                controller: 'StatusCtrl',
                controllerAs: 'vm'
            };

            var views = [];
            views['timeline@home'] = { 'timeline@home': statusViewConfig };
            views['mentions@home'] = { 'mentions@home': statusViewConfig };
            views['favorites@home'] = { 'favorites@home': statusViewConfig };

            var service = {
                addStatusState: addStatusState,
                addProfileState: addProfileState
            };

            return service;

            function addStatusState(prefixName, parentName) {
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

            function addProfileState(prefixName, parentName) {

            }


        }
    }

})();
