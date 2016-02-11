(function() {
    'use strict';

    // This will dynamically create any tab substates inside the current tab. If in the timeline tab, we will
    // create a timeline.status state
    angular.module('tatami.providers')
        .provider('StatusState', statusState);

    statusState.$inject = ['$stateProvider'];
    function statusState($stateProvider) {
        this.$get = StatusStateHelper;

        StatusStateHelper.$inject = ['ViewService'];
        function StatusStateHelper(ViewService) {

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
                addProfileState: addProfileState
            };

            return service;

            function addProfileState(prefixName, parentName) {
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
                    console.log(ViewService);
                    return StatusService.get({ statusId : $stateParams.statusId }).$promise;
                }
            }


        }
    }

})();
