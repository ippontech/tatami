module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var jsFiles = [
        "/assets/bower_components/angular/angular.min.js",
        "/assets/bower_components/angular-touch/angular-touch.min.js",
        "/assets/bower_components/angular-resource/angular-resource.min.js",
        "/assets/bower_components/angular-sanitize/angular-sanitize.min.js",
        "/assets/bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "/assets/bower_components/angular-translate/angular-translate.min.js",
        "/assets/bower_components/angular-cookies/angular-cookies.min.js",
        "/assets/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
        "/assets/vendor/js/marked/marked.min.js",
        "/assets/bower_components/moment/min/moment.min.js",
        "/assets/bower_components/moment/locale/fr.js",
        "/assets/bower_components/angular-moment/angular-moment.min.js",
        "/assets/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js",
        "/assets/bower_components/angular-bootstrap/ui-bootstrap.min.js",
        "/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "/assets/bower_components/ment.io/dist/mentio.js",
        "/assets/bower_components/angular-animate/angular-animate.min.js",
        "/assets/bower_components/ngtoast/dist/ngToast.min.js",
        "/assets/bower_components/ng-file-upload/angular-file-upload-shim.min.js",
        "/assets/bower_components/ng-file-upload/angular-file-upload.min.js",
        "/assets/bower_components/openlayers/OpenLayers.min.js",
        "/assets/bower_components/angular-local-storage/dist/angular-local-storage.min.js",
        "/assets/bower_components/jquery/dist/jquery.min.js",
        "/assets/vendor/css/bootstrap/js/bootstrap.min.js",
        "/assets/bower_components/bootstrap-tour/build/js/bootstrap-tour.min.js",
        "/assets/bower_components/angular-bootstrap-tour/dist/angular-bootstrap-tour.js",
        "/app/TatamiApp.js",
        "/app/shared/topMenu/TopMenuModule.js",
        "/app/components/login/LoginModule.js",
        "/app/components/about/AboutModule.js",
        "/app/components/home/HomeModule.js",
        "/app/components/account/AccountModule.js",
        "/app/components/admin/AdminModule.js",
        "/app/components/about/license/LicenseController.js",
        "/app/shared/sidebars/home/HomeSidebarModule.js",
        "/app/shared/sidebars/home/HomeSidebarController.js",
        "/app/shared/sidebars/profile/ProfileSidebarModule.js",
        "/app/shared/sidebars/profile/ProfileSidebarController.js",
        "/app/components/home/tag/TagHeaderController.js",
        "/app/components/home/search/SearchHeaderController.js",
        "/app/components/home/group/GroupHeaderController.js",
        "/app/components/home/profile/ProfileHeaderController.js",
        "/app/components/home/status/StatusController.js",
        "/app/shared/lists/status/withoutContext/StatusListController.js",
        "/app/shared/lists/user/UserListController.js",
        "/app/shared/topMenu/post/PostModule.js",
        "/app/shared/topMenu/post/PostController.js",
        "/app/shared/footer/FooterModule.js",
        "/app/shared/footer/FooterController.js",
        "/app/components/home/welcome/WelcomeController.js",
        "/app/components/admin/AdminController.js",
        "/app/components/admin/AdminService.js",
        "/app/components/account/AccountController.js",
        "/app/components/account/FormController.js",
        "/app/components/account/profile/ProfileModule.js",
        "/app/components/account/profile/ProfileController.js",
        "/app/components/account/preferences/PreferencesModule.js",
        "/app/components/account/preferences/PreferencesController.js",
        "/app/components/account/preferences/PreferencesService.js",
        "/app/components/account/password/PasswordModule.js",
        "/app/components/account/password/PasswordController.js",
        "/app/components/account/password/PasswordService.js",
        "/app/components/account/files/FilesModule.js",
        "/app/components/account/files/FilesController.js",
        "/app/components/account/files/FilesService.js",
        "/app/components/account/users/UsersModule.js",
        "/app/components/account/users/UsersController.js",
        "/app/components/account/groups/GroupsModule.js",
        "/app/components/account/groups/GroupsController.js",
        "/app/components/account/groups/manage/GroupsManageController.js",
        "/app/components/account/groups/creation/GroupsCreateController.js",
        "/app/components/account/groups/list/GroupListController.js",
        "/app/components/account/tags/TagsModule.js",
        "/app/components/account/tags/TagsController.js",
        "/app/components/account/topPosters/TopPostersModule.js",
        "/app/components/account/topPosters/TopPostersController.js",
        "/app/components/login/LoginModule.js",
        "/app/components/login/manual/ManualLoginController.js",
        "/app/components/login/recoverPassword/RecoverPasswordController.js",
        "/app/components/login/register/RegisterController.js",
        "/app/components/login/google/GoogleLoginController.js",
        "/app/components/login/email/EmailRegistrationController.js",
        "/app/components/login/RegistrationService.js",
        "/app/shared/configs/MarkedConfig.js",
        "/app/shared/configs/MomentConfig.js",
        "/app/shared/configs/TranslateConfig.js",
        "/app/shared/filters/MarkdownFilter.js",
        "/app/shared/filters/EmoticonFilter.js",
        "/app/shared/filters/PlaceholderFilter.js",
        "/app/shared/services/HomeService.js",
        "/app/shared/services/StatusService.js",
        "/app/shared/services/ProfileService.js",
        "/app/shared/services/UserService.js",
        "/app/shared/services/GroupService.js",
        "/app/shared/services/TagService.js",
        "/app/shared/services/GeolocService.js",
        "/app/shared/services/SearchService.js",
        "/app/shared/services/TopPostersService.js",
        "/app/shared/services/UserSession.js",
        "/app/shared/services/AuthenticationService.js",
        "/app/shared/topMenu/TopMenuController.js"
    ]

    var cssFiles = [
        "assets/bower_components/ment.io/ment.io/styles.css",
        "assets/bower_components/ngtoast/dist/ngToast.min.css",
        "assets/vendor/css/bootstrap/css/bootstrap.css",
        "assets/bower_components/bootstrap-tour/build/css/bootstrap-tour.css"
    ]



    var prepareMinification = function(prepFiles, prefixPath) {
        var result = [];
        for(var file = 0; file < prepFiles.length; ++file) {
            result.push(prefixPath + prepFiles[file]);
        }
        return result;
    }

    var prepareTags = function(prepFiles, open, close) {
        var result = '';
        var end = '\n\t';
        for(var file = 0; file < prepFiles.length; ++file) {
            if(file == prepFiles.length-1) { end = ''; }
            result += open + prepFiles[file] + close + end;
        }
        return result;
    }

    var filePrefix = 'src/main/webapp/';

    grunt.initConfig({
        template: {
            prepareMinIndex: {
                options: {
                    data: {
                        jsTags: '<script src="TATAMI.CONCAT.js"></script>',
                        cssTags: '<link href="/css/CSSMIN.css" rel="stylesheet" type="text/css">'
                    }
                },
                files: {
                    'src/main/webapp/index.html': ['src/main/webapp/index.html.tpl']
                }
            },
            prepareDevIndex: {
                options: {
                    data: {
                        jsTags: prepareTags(jsFiles, '<script src="', '"></script>'),
                        cssTags: prepareTags(cssFiles, '<link href="', '" rel="stylesheet" type="text/css">')
                    }
                },
                files: {
                    'src/main/webapp/index.html': ['src/main/webapp/index.html.tpl']
                }
            }
        },
        clean: [
            'src/main/webapp/TATAMI.CONCAT.js',
            'src/main/webapp/css/CSSMIN.css',
            '**/*.min.html',
            'src/main/webapp/index.html'],
        uglify: {
            options: {
                mangle: false
            },
            BuildingTatamiConcat: {
                files: {
                    'src/main/webapp/TATAMI.CONCAT.js': prepareMinification(jsFiles, filePrefix)
                }
            }
        },
        cssmin: {
            target: {
                files: { //tatami.css should not be minified-- it breaks.
                    'src/main/webapp/css/CSSMIN.css': prepareMinification(cssFiles, filePrefix)
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
                    'src/main/webapp/app/components/home/tag/TagHeaderView.min.html':'src/main/webapp/app/components/home/tag/TagHeaderView.html',
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
                    'src/main/webapp/app/shared/footer/FooterView.min.html':'src/main/webapp/app/shared/footer/FooterView.html',
                    'src/main/webapp/app/shared/error/404View.min.html':'src/main/webapp/app/shared/error/404View.html',
                    'src/main/webapp/app/shared/error/500View.min.html':'src/main/webapp/app/shared/error/500View.html'

                }
            }
        },
        concurrent: {
            minifyTarget: ['template:prepareMinIndex', 'cssmin', 'htmlmin', 'uglify'],
            devTarget: ['template:prepareDevIndex', 'htmlmin']
        }

   } );
    grunt.loadNpmTasks('grunt-');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.registerTask('minify', ['clean','concurrent:minifyTarget']);
    grunt.registerTask('dev', ['clean', 'concurrent:devTarget']);
};