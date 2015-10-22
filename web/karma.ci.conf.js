// Karma configuration
// Generated on Wed May 06 2015 15:23:11 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
        "src/main/webapp/assets/bower_components/angular/angular.min.js",
        "src/main/webapp/assets/bower_components/angular-mocks/angular-mocks.js",
        "src/main/webapp/assets/bower_components/angular-route/angular-route.min.js",
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
        "src/main/webapp/app/shared/topMenu/TopMenuController.js",

        "src/test/javascript/**/*.js"
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'jenkins','coverage', 'progress'],

    jenkinsReporter: {
        outputFile: 'target/test-results/karma/TESTS-resuts.xml'
    },

    coverageReporter: {
        dir: 'target/test-results/coverage',

        reporters: [
            { type: 'lcov', subdir: 'report-lcov'}
        ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
