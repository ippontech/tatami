tatamiJHipsterApp
.service('PostModalService', ['$state', '$stateParams', '$uibModal', function($state, $stateParams, $uibModal) {
    this.openPostModal = function(statusId) {
       $stateParams.statusId = angular.isDefined(statusId) ? statusId : null;
       $uibModal.open({
           templateUrl: '/scripts/components/navbar/post/PostView.html',
           controller: 'PostController',
           backdrop: 'static',
           animation: true,
           keyboard: true,
           resolve: {
               curStatus: ['StatusService', function(StatusService) {
                   if($stateParams.statusId !== null) {
                       return StatusService.get({ statusId: $stateParams.statusId }).$promise;
                   }
               }],
               translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                   $translatePartialLoader.addPart('post');
                   $translatePartialLoader.addPart('form');
                   $translatePartialLoader.addPart('status');
                   return $translate.refresh();
               }]
           }
       });
   }
}]);
