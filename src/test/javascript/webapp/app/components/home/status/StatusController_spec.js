describe("Status Controller Test", function () {
    var ctrl, statusService;
    beforeEach(module('ui.router'));
    beforeEach(module('HomeModule'));

    beforeEach(module('pascalprecht.translate'));


    //Mocked password service:
    beforeEach(module({
            UserSession: {
                isAuthenticated: function () {
                    return "true";
                },

                isUserResolved: function () {
                    return true;
                },

                setLoginState: function (loggedIn) {
                },

                clearSession: function () {
                },

                getUser: function () {
                },

                authenticate: function (force) {
                }
            },
            StatusService: {
                save: function () {
                }
            }
            ,
            localStorageService: {
                clearAll: function () {

                }
                ,
                get: function (token) {
                    return true;
                }
            }
        })
    );


    beforeEach(inject(function ($rootScope, _$controller_, _$translate_, _StatusService_, _localStorageService_) {
        $scope = $rootScope.$new();
        $translate = _$translate_;
        statusService = _StatusService_;
        var storageService = _localStorageService_;
        spyOn(statusService, 'save');
        ctrl = _$controller_('StatusController', {
            $scope: $scope,
            $translate: $translate,
            'StatusService': statusService,
            'localStorageService': storageService,
            'profile': {},
            'status': 'teehee',
            'context': {discussionStatuses: []},
            'userRoles': {roles: ['', '', 'ROLE_ADMIN']}
        });
    }));


    it('SANITY', function () {
        expect(true).toBeTruthy();
    });
    it('Is Admin check', function () {
        expect($scope.isAdmin).toBeTruthy();
    });
    it('Status accepted without discussion', function () {
        expect($scope.statuses[0] == 'teehee').toBeTruthy();
    });
})
;
