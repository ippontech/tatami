describe("Status Controller Test", function() {
    var ctrl, statusService;
    beforeEach(module('ui.router'));
    beforeEach(module('HomeModule'));
    beforeEach(module('pascalprecht.translate'));
    
    //Mocked password service:
    beforeEach(module({
        StatusService: {
            save: function () {
            }
        }
    }));

    /*'StatusController', [
     '$scope',
     '$translate',
     'StatusService',
     'profile',
     'status',
     'context',
     'userRoles',*/


    beforeEach(inject(function($rootScope, _$controller_, _$translate_, _StatusService_) {
        $scope = $rootScope.$new();
        $translate = _$translate_;

        statusService = _StatusService_;
        spyOn(statusService, 'save');
        ctrl = _$controller_('StatusController', {
            $scope : $scope,
            $translate : $translate,
            'StatusService' : statusService,
            'profile':{},
            'status':'teehee',
            'context':{discussionStatuses:{}},
            'userRoles':{roles:['ROLE_ADMIN']}
        });
    }));


    it('SANITY', function() {
       expect(true).toBeTruthy();
    });
    it('Is Admin check', function(){
        expect($scope.isAdmin).toBeTruthy();
    });
    it('Status accepted without discussion', function(){
        expect($scope.statuses[0]==$scope.status).toBeTruthy();
    });

});
