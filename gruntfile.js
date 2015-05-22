module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        clean: [
            'src/main/webapp/TATAMI.CONCAT.js',
            'src/main/webapp/css/CSSMIN.css',
            '**/*.min.html'],
        uglify: {
            options: {
                mangle: false
            },
            BuildingTatamiConcat: {
                files: {
                    'src/main/webapp/TATAMI.CONCAT.js': [
                        "src/main/webapp/assets/bower_components/angular/angular.min.js",
                        "src/main/webapp/assets/bower_components/angular-touch/angular-touch.min.js",
                        "src/main/webapp/assets/bower_components/angular-resource/angular-resource.min.js",
                        "src/main/webapp/assets/bower_components/angular-sanitize/angular-sanitize.min.js",
                        "src/main/webapp/assets/bower_components/angular-ui-router/release/angular-ui-router.min.js",
                        "src/main/webapp/assets/bower_components/angular-translate/angular-translate.min.js",
                        "src/main/webapp/assets/bower_components/angular-cookies/angular-cookies.min.js",
                        "src/main/webapp/assets/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
                        "src/main/webapp/assets/vendor/js/marked/marked.min.js",
                        "src/main/webapp/assets/bower_components/moment/min/moment.min.js",
                        "src/main/webapp/assets/bower_components/moment/locale/fr.js",
                        "src/main/webapp/assets/bower_components/angular-moment/angular-moment.min.js",
                        "src/main/webapp/assets/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js",
                        "src/main/webapp/assets/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                        "src/main/webapp/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                        "src/main/webapp/assets/bower_components/ment.io/dist/mentio.js",
                        "src/main/webapp/assets/bower_components/angular-animate/angular-animate.min.js",
                        "src/main/webapp/assets/bower_components/ngtoast/dist/ngToast.min.js",
                        "src/main/webapp/assets/bower_components/ng-file-upload/angular-file-upload-shim.min.js",
                        "src/main/webapp/assets/bower_components/ng-file-upload/angular-file-upload.min.js",
                        "src/main/webapp/assets/bower_components/openlayers/OpenLayers.min.js",
                        "src/main/webapp/assets/bower_components/angular-local-storage/dist/angular-local-storage.min.js",
                        "src/main/webapp/assets/bower_components/jquery/dist/jquery.min.js",
                        "src/main/webapp/assets/vendor/css/bootstrap/js/bootstrap.min.js",
                        "src/main/webapp/assets/bower_components/bootstrap-tour/build/js/bootstrap-tour.min.js",
                        "src/main/webapp/assets/bower_components/angular-bootstrap-tour/dist/angular-bootstrap-tour.js",
                        "src/main/webapp/app/TatamiApp.js",
                        "src/main/webapp/app/shared/topMenu/TopMenuModule.js",
                        "src/main/webapp/app/components/login/LoginModule.js",
                        "src/main/webapp/app/components/about/AboutModule.js",
                        "src/main/webapp/app/components/home/HomeModule.js",
                        "src/main/webapp/app/components/account/AccountModule.js",
                        "src/main/webapp/app/components/admin/AdminModule.js",
                        "src/main/webapp/app/components/about/license/LicenseController.js",
                        "src/main/webapp/app/shared/sidebars/home/HomeSidebarModule.js",
                        "src/main/webapp/app/shared/sidebars/home/HomeSidebarController.js",
                        "src/main/webapp/app/shared/sidebars/profile/ProfileSidebarModule.js",
                        "src/main/webapp/app/shared/sidebars/profile/ProfileSidebarController.js",
                        "src/main/webapp/app/components/home/tag/TagHeaderController.js",
                        "src/main/webapp/app/components/home/search/SearchHeaderController.js",
                        "src/main/webapp/app/components/home/group/GroupHeaderController.js",
                        "src/main/webapp/app/components/home/profile/ProfileHeaderController.js",
                        "src/main/webapp/app/components/home/status/StatusController.js",
                        "src/main/webapp/app/shared/lists/status/withoutContext/StatusListController.js",
                        "src/main/webapp/app/shared/lists/user/UserListController.js",
                        "src/main/webapp/app/shared/topMenu/post/PostModule.js",
                        "src/main/webapp/app/shared/topMenu/post/PostController.js",
                        "src/main/webapp/app/components/home/welcome/WelcomeController.js",
                        "src/main/webapp/app/components/admin/AdminController.js",
                        "src/main/webapp/app/components/admin/AdminService.js",
                        "src/main/webapp/app/components/account/AccountController.js",
                        "src/main/webapp/app/components/account/FormController.js",
                        "src/main/webapp/app/components/account/profile/ProfileModule.js",
                        "src/main/webapp/app/components/account/profile/ProfileController.js",
                        "src/main/webapp/app/components/account/preferences/PreferencesModule.js",
                        "src/main/webapp/app/components/account/preferences/PreferencesController.js",
                        "src/main/webapp/app/components/account/preferences/PreferencesService.js",
                        "src/main/webapp/app/components/account/password/PasswordModule.js",
                        "src/main/webapp/app/components/account/password/PasswordController.js",
                        "src/main/webapp/app/components/account/password/PasswordService.js",
                        "src/main/webapp/app/components/account/files/FilesModule.js",
                        "src/main/webapp/app/components/account/files/FilesController.js",
                        "src/main/webapp/app/components/account/files/FilesService.js",
                        "src/main/webapp/app/components/account/users/UsersModule.js",
                        "src/main/webapp/app/components/account/users/UsersController.js",
                        "src/main/webapp/app/components/account/groups/GroupsModule.js",
                        "src/main/webapp/app/components/account/groups/GroupsController.js",
                        "src/main/webapp/app/components/account/groups/manage/GroupsManageController.js",
                        "src/main/webapp/app/components/account/groups/creation/GroupsCreateController.js",
                        "src/main/webapp/app/components/account/groups/list/GroupListController.js",
                        "src/main/webapp/app/components/account/tags/TagsModule.js",
                        "src/main/webapp/app/components/account/tags/TagsController.js",
                        "src/main/webapp/app/components/account/topPosters/TopPostersModule.js",
                        "src/main/webapp/app/components/account/topPosters/TopPostersController.js",
                        "src/main/webapp/app/components/login/LoginModule.js",
                        "src/main/webapp/app/components/login/manual/ManualLoginController.js",
                        "src/main/webapp/app/components/login/recoverPassword/RecoverPasswordController.js",
                        "src/main/webapp/app/components/login/register/RegisterController.js",
                        "src/main/webapp/app/components/login/google/GoogleLoginController.js",
                        "src/main/webapp/app/components/login/email/EmailRegistrationController.js",
                        "src/main/webapp/app/components/login/RegistrationService.js",
                        "src/main/webapp/app/shared/configs/MarkedConfig.js",
                        "src/main/webapp/app/shared/configs/MomentConfig.js",
                        "src/main/webapp/app/shared/configs/TranslateConfig.js",
                        "src/main/webapp/app/shared/filters/MarkdownFilter.js",
                        "src/main/webapp/app/shared/filters/EmoticonFilter.js",
                        "src/main/webapp/app/shared/filters/PlaceholderFilter.js",
                        "src/main/webapp/app/shared/services/HomeService.js",
                        "src/main/webapp/app/shared/services/StatusService.js",
                        "src/main/webapp/app/shared/services/ProfileService.js",
                        "src/main/webapp/app/shared/services/UserService.js",
                        "src/main/webapp/app/shared/services/GroupService.js",
                        "src/main/webapp/app/shared/services/TagService.js",
                        "src/main/webapp/app/shared/services/GeolocService.js",
                        "src/main/webapp/app/shared/services/SearchService.js",
                        "src/main/webapp/app/shared/services/TopPostersService.js",
                        "src/main/webapp/app/shared/services/UserSession.js",
                        "src/main/webapp/app/shared/services/AuthenticationService.js",
                        "src/main/webapp/app/shared/topMenu/TopMenuController.js"
                    ]
                }
            }
        },
        cssmin: {
            target: {
                files: { //tatami.css should not be minified-- it breaks.
                    'src/main/webapp/css/CSSMIN.css': [
                        "src/main/webapp/assets/bower_components/ngtoast/dist/ngToast.min.css",
                        "src/main/webapp/assets/vendor/css/bootstrap/css/bootstrap.css",
                        "src/main/webapp/assets/bower_components/ment.io/ment.io/styles.css",
                        "src/main/webapp/assets/bower_components/bootstrap-tour/build/css/bootstrap-tour.css"
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {// 'destination': 'source'
                    'src/main/webapp/app/components/about/tos/ToSView.min.html': 'src/main/webapp/app/components/about/tos/ToSView.html',
                    'src/main/webapp/app/components/about/license/LicenseView.min.html': 'src/main/webapp/app/components/about/license/LicenseView.html',
                    'src/main/webapp/app/components/about/presentation/PresentationView.min.html': 'src/main/webapp/app/components/about/presentation/PresentationView.html',
                    'src/main/webapp/app/components/account/AccountView.min.html': 'src/main/webapp/app/components/account/AccountView.html',
                    'src/main/webapp/app/components/account/profile/ProfileView.min.html': 'src/main/webapp/app/components/account/profile/ProfileView.html',
                    'src/main/webapp/app/components/account/preferences/PreferencesView.min.html':'src/main/webapp/app/components/account/preferences/PreferencesView.html',
                    'src/main/webapp/app/components/account/password/PasswordView.min.html': 'src/main/webapp/app/components/account/password/PasswordView.html',
                    'src/main/webapp/app/components/account/files/FilesView.min.html':'src/main/webapp/app/components/account/files/FilesView.html',
                    'src/main/webapp/app/components/account/FormView.min.html':'src/main/webapp/app/components/account/FormView.html',
                    'src/main/webapp/app/components/account/users/UsersView.min.html':'src/main/webapp/app/components/account/users/UsersView.html',
                    'src/main/webapp/app/components/account/groups/GroupsView.min.html':'src/main/webapp/app/components/account/groups/GroupsView.html',
                    'src/main/webapp/app/components/account/groups/creation/GroupsCreateView.min.html':'src/main/webapp/app/components/account/groups/creation/GroupsCreateView.html',
                    'src/main/webapp/app/components/account/groups/list/GroupsListView.min.html':'src/main/webapp/app/components/account/groups/list/GroupsListView.html',
                    'src/main/webapp/app/components/account/groups/manage/GroupsManageView.min.html':'src/main/webapp/app/components/account/groups/manage/GroupsManageView.html',
                    'src/main/webapp/app/components/account/tags/TagsView.min.html':'src/main/webapp/app/components/account/tags/TagsView.html',
                    'src/main/webapp/app/components/account/topPosters/TopPostersView.min.html':'src/main/webapp/app/components/account/topPosters/TopPostersView.html',
                    'src/main/webapp/app/components/admin/AdminView.min.html':'src/main/webapp/app/components/admin/AdminView.html',
                    'src/main/webapp/app/components/home/HomeView.min.html':'src/main/webapp/app/components/home/HomeView.html',
                    'src/main/webapp/app/components/home/status/StatusView.min.html':'src/main/webapp/app/components/home/status/StatusView.html',
                    'src/main/webapp/app/components/home/search/SearchHeaderView.min.html':'src/main/webapp/app/components/home/search/SearchHeaderView.html',
                    'src/main/webapp/app/shared/lists/status/withoutContext/StatusListView.min.html':'src/main/webapp/app/shared/lists/status/withoutContext/StatusListView.html',
                    'src/main/webapp/app/shared/sidebars/home/HomeSidebarView.min.html':'src/main/webapp/app/shared/sidebars/home/HomeSidebarView.html',
                    'src/main/webapp/app/components/home/timeline/TimelineHeaderView.min.html':'src/main/webapp/app/components/home/timeline/TimelineHeaderView.html',
                    'src/main/webapp/app/components/home/welcome/WelcomeView.min.html':'src/main/webapp/app/components/home/welcome/WelcomeView.html',
                    'src/main/webapp/app/shared/lists/user/UserListView.min.html':'src/main/webapp/app/shared/lists/user/UserListView.html',
                    'src/main/webapp/app/components/home/group/GroupHeaderView.min.html':'src/main/webapp/app/components/home/group/GroupHeaderView.html',
                    'src/main/webapp/app/shared/topMenu/post/PostView.min.html':'src/main/webapp/app/shared/topMenu/post/PostView.html',
                    'src/main/webapp/app/shared/sidebars/profile/ProfileSidebarView.min.html':'src/main/webapp/app/shared/sidebars/profile/ProfileSidebarView.html',
                    'src/main/webapp/app/components/home/profile/ProfileHeaderView.min.html':'src/main/webapp/app/components/home/profile/ProfileHeaderView.html',
                    //Login Module
                    'src/main/webapp/app/components/login/LoginView.min.html':'src/main/webapp/app/components/login/LoginView.html',
                    'src/main/webapp/app/components/login/manual/ManualLoginView.min.html':'src/main/webapp/app/components/login/manual/ManualLoginView.html',
                    'src/main/webapp/app/components/login/recoverPassword/RecoverPasswordView.min.html':'src/main/webapp/app/components/login/recoverPassword/RecoverPasswordView.html',
                    'src/main/webapp/app/components/login/google/GoogleLoginView.min.html':'src/main/webapp/app/components/login/google/GoogleLoginView.html',
                    'src/main/webapp/app/components/login/register/RegisterView.min.html':'src/main/webapp/app/components/login/register/RegisterView.html',
                    'src/main/webapp/app/components/login/email/EmailRegistration.min.html':'src/main/webapp/app/components/login/email/EmailRegistration.html',
                    //TatamiApp module
                    'src/main/webapp/app/shared/topMenu/TopMenuView.min.html':'src/main/webapp/app/shared/topMenu/TopMenuView.html',
                    'src/main/webapp/app/shared/error/404View.min.html':'src/main/webapp/app/shared/error/404View.html',
                    'src/main/webapp/app/shared/error/500View.min.html':'src/main/webapp/app/shared/error/500View.html'

                }
            }
        },
        concurrent: {
            target1: ['cssmin', 'htmlmin', 'uglify']
        }

   } );
    grunt.loadNpmTasks('grunt-');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.registerTask('default', ['clean','concurrent:target1']);
};