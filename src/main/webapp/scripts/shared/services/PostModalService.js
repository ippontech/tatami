tatamiJHipsterApp
.service('PostModalService', ['$uibModal', function($uibModal) {
    this.openPostModal = function(id) {
       var statusId = angular.isDefined(id) ? id : null;
       $uibModal.open({
           templateUrl: '/scripts/components/navbar/post/PostView.html',
           controller: 'PostController',
           backdrop: 'static',
           animation: true,
           keyboard: true,
           resolve: {
               curStatus: ['StatusService', function(StatusService) {
                   if(statusId !== null) {
                       return StatusService.get({ statusId: statusId }).$promise;
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
