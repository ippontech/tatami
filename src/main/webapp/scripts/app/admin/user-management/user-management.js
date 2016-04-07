'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('user-management', {
                parent: 'admin',
                url: '/user-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'user-management.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/user-management/user-management.html',
                        controller: 'UserManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user.management');
                        return $translate.refresh();
                    }]
                }
            })
            .state('user-management-detail', {
                parent: 'admin',
                url: '/user/:username',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'user-management.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/user-management/user-management-detail.html',
                        controller: 'UserManagementDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user.management');
                        return $translate.refresh();
                    }]
                }
            })
            .state('user-management.new', {
                parent: 'user-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/admin/user-management/user-management-dialog.html',
                        controller: 'UserManagementDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null, username: null, firstName: null, lastName: null, email: null,
                                    activated: true, langKey: null, createdBy: null, createdDate: null,
                                    lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                                    resetKey: null, authorities: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('user-management');
                    })
                }]
            })
            .state('user-management.edit', {
                parent: 'user-management',
                url: '/{username}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/admin/user-management/user-management-dialog.html',
                        controller: 'UserManagementDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['User', function(User) {
                                return User.get({email : $stateParams.email});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('user-management.delete', {
                parent: 'user-management',
                url: '/{username}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/admin/user-management/user-management-delete-dialog.html',
                        controller: 'user-managementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['User', function(User) {
                                return User.get({email : $stateParams.email});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
