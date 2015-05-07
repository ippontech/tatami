describe("UserListController spec", function() {
    var ctrl, userService,
        //three user objects
        users = [{}, {},{}];

    beforeEach(module('ui.router'));
    beforeEach(module('HomeModule'));
    //Mocked Services:
    beforeEach(module({
        UserService: {
            save: function(){}
        }
    }));
//function($scope, UserService, users)
    beforeEach(inject(function($rootScope, _$controller_, _UserService_) {
        $scope = $rootScope.$new();
        userService= _UserService_;

        spyOn(userService, 'save');
        ctrl = _$controller_('UserListController', {
            $scope : $scope,
            'UserService': userService,
            'users': users
        });
    }));

    it('sanity', function() {
      expect(true).toBeTruthy();
    });

});
