<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${wro4jEnabled eq false}">
    <!-- Angular libraries -->
    <script src="/assets/bower_components/ng-file-upload/angular-file-upload-shim.js"></script>
    <script src="/assets/bower_components/angular/angular.js"></script>
    <script src="/assets/bower_components/ng-file-upload/angular-file-upload.js"></script>

    <script src="/assets/bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="/assets/bower_components/angular-resource/angular-resource.js"></script>

    <script src="/assets/bower_components/moment/moment.js"></script>
    <script src="/assets/bower_components/moment/locale/fr.js"></script>
    <script src="/assets/bower_components/angular-moment/angular-moment.js"></script>
    <script src="/assets/bower_components/angular-translate/angular-translate.js"></script>

    <script src="/assets/bower_components/marked/lib/marked.js"></script>
    <script src="/assets/bower_components/angular-bootstrap/ui-bootstrap.js"></script>
    <script src="/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>

    <!-- Tatami Angular scripts -->
    <script src="/app/TatamiApp.js"></script>

    <!-- Module includes -->
    <script src="/app/components/account/preferences/PreferenceModule.js"></script>
    <script src="/app/components/account/password/PasswordModule.js"></script>
    <script src="/app/components/account/AccountModule.js"></script>
    <script src="/app/components/account/files/FileModule.js"></script>
    <script src="/app/components/account/groups/GroupModule.js"></script>
    <script src="/app/components/account/profile/ProfileModule.js"></script>
    <script src="/app/components/account/preferences/PreferenceModule.js"></script>

    <!-- Shared filter includes -->
    <script src="/app/shared/filters/MarkdownFilter.js"></script>

    <!-- Shared config includes -->
    <script src="/app/shared/configs/MarkedConfig.js"></script>
    <script src="/app/shared/configs/TranslateConfig.js"></script>

    <!-- Shared services includes -->
    <script src="/app/shared/services/ProfileService.js"></script>
    <script src="/app/shared/services/GroupService.js"></script>
    <script src="/app/shared/services/TagService.js"></script>
    <script src="/app/shared/services/StatusService.js"></script>
    <script src="/app/shared/services/GeolocService.js"></script>
    <script src="/app/shared/services/GroupMemberService.js"></script>

    <!-- Move these to another file? Perhaps into home.jsp, ultimately we will remove jsps though -->

    <!-- Status based includes -->
    <script src="/app/components/home/status/StatusModule.js"></script>
    <script src="/app/components/home/status/StatusCreateController.js"></script>
    <script src="/app/components/home/status/StatusManagerController.js"></script>

    <!-- Sidebar based includes -->
    <script src="/app/components/home/sidebar/SidebarModule.js"></script>
    <script src="/app/components/home/sidebar/UserController.js"></script>
    <script src="/app/components/home/sidebar/GroupsController.js"></script>
    <script src="/app/components/home/sidebar/TrendsController.js"></script>

    <!-- Timeline based includes -->
    <script src="/app/components/home/timeline/TimelineModule.js"></script>
    <script src="/app/components/home/timeline/TimelineController.js"></script>
    <script src="/app/components/home/timeline/TimelineService.js"></script>
    <script src="/app/components/home/timeline/MomentConfig.js"></script>

    <!-- Other libraries -->
    <script src="/js/vendor/jquery.js"></script>
    <script src="/js/vendor/bootstrap.js"></script>
    <script src="/js/vendor/bootstrap-tour.js"></script>
    <script src="/js/vendor/underscore.js"></script>
    <script src="/js/vendor/underscore-polyfill.js"></script>
    <script src="/js/vendor/backbone.js"></script>
    <!--<script src="/js/vendor/marked.js"></script>-->
    <script src="/js/vendor/backbone.marionette.js"></script>
    <script src="/js/vendor/modernizr.js"></script>
    <script src="/js/vendor/jquery.ui.widget.js"></script>
    <script src="/js/vendor/jquery.iframe-transport.js"></script>
    <script src="/js/vendor/jquery.fileupload.js"></script>
    <script src="/js/vendor/jquery.atmosphere.js"></script>
    <script src="/js/vendor/jquery-timeago.js"></script>
    <script src="/js/vendor/jquery.placeholder.js"></script>
    <script src="/js/app/plugins/tatami.atmosphere.js"></script>
    <script src="/js/app/plugins/bootstrap-filestyle.min.js"></script>
    <script src="/js/vendor/jquery.jgrowl.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static-wro4j/${version}/tatami-vendor.js"></script>
</c:if>