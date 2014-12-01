<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    request.setAttribute("currentPage", "home");
%>

<!DOCTYPE html>
<!--
-    If the app isn't here, the post modal does not work, this location can be changed once the modal view is
-    separated from the topmenu jsp
-->
<html lang="en" ng-app="TatamiApp">

<jsp:include page="includes/header.jsp"/>

<body>

<div class="row">
    <jsp:include page="/app/shared/topmenu/TopMenuView.html"/>
 
    <jsp:include page="/app/components/profile/sidebar/ProfileSidebarView.html"/>
    
   
</div>
<br>

<jsp:include page="includes/topmenu.jsp"/>

<div class="row">
    <div id="tatamiHeader" class="col-span-12">
    </div>
</div>

<div class="row">
    <aside id="tatamiSide" class="col-span-3">
    </aside>
    <section id="tatamiBody" class="col-span-7">
    </section>
</div>

<c:if test="${!ios}">
    <form id="tatamiEdit" class="modal fade">
    </form>
</c:if>
<div id="slider" class="modal fade"></div>

</body>

<jsp:include page="includes/footer.jsp"/>

<c:if test="${wro4jEnabled eq false}">
    <script src="/app/components/home/sidebar/SidebarModule.js"></script>
    <script src="/app/components/home/sidebar/UserController.js"></script>
    <script src="/app/components/home/sidebar/GroupsController.js"></script>
	<script src="/app/components/home/sidebar/SuggestionService.js"></script>
	<script src="/app/components/home/sidebar/SuggestionController.js"></script>
    <script src="/app/components/home/sidebar/TrendsController.js"></script>
    
	
    <script src="/app/components/home/timeline/TimelineModule.js"></script>
    <script src="/app/components/home/timeline/TimelineController.js"></script>
    <script src="/app/components/home/timeline/TimelineService.js"></script>
    <script src="/app/components/home/timeline/MomentConfig.js"></script>

    <script src="/js/vendor/favico-0.3.0.min.js"></script>
    <script src="/js/vendor/OpenLayers.js"></script>
    <script src="/js/app/app.js"></script>
    <script src="/js/app/plugins/tatami.search.js"></script>
    <script src="/js/app/plugins/suggester.js"></script>
    <script src="/js/app/models/mUser.js"></script>
    <script src="/js/app/models/mFile.js"></script>
    <script src="/js/app/collections/cUsers.js"></script>
    <script src="/js/app/models/mPostStatus.js"></script>
    <script src="/js/app/models/mStatus.js"></script>
    <script src="/js/app/models/mHomeBody.js"></script>
    <script src="/js/app/collections/cStatuses.js"></script>
    <script src="/js/app/models/mTag.js"></script>
    <script src="/js/app/collections/cTags.js"></script>
    <script src="/js/app/models/mGroup.js"></script>
    <script src="/js/app/collections/cGroups.js"></script>
    <script src="/js/app/models/mStatusDetails.js"></script>
    <script src="/js/app/models/mSearch.js"></script>

    <script src="/js/app/collections/cFiles.js"></script>
    <script src="/js/app/views/vCardProfile.js"></script>
    <script src="/js/app/views/vNavbar.js"></script>
    <script src="/js/app/views/vHomeContainers.js"></script>
    <script src="/js/app/views/vTagsContainers.js"></script>
    <script src="/js/app/views/vProfileContainers.js"></script>
    <script src="/js/app/views/vGroupsContainers.js"></script>
    <script src="/js/app/views/vStatuses.js"></script>
    <script src="/js/app/views/vStatusEdit.js"></script>
    <script src="/js/app/views/vStatusUpdateButton.js"></script>
    <script src="/js/app/views/vWelcome.js"></script>
    <script src="/js/app/views/vUserList.js"></script>
    <script src="/js/app/views/vStatusShares.js"></script>
    <script src="/js/app/views/vTagTrends.js"></script>
    <script src="/js/app/views/vGroups.js"></script>
    <script src="/js/app/views/vProfileSide.js"></script>
    <script src="/js/app/views/vSearch.js"></script>
    <script src="/js/app/views/vFiles.js"></script>
    <script src="/js/app/factories/fHome.js"></script>
    <script src="/js/app/factories/fProfile.js"></script>
    <script src="/js/app/factories/fStatus.js"></script>
    <script src="/js/app/factories/fTags.js"></script>
    <script src="/js/app/factories/fSearch.js"></script>
    <script src="/js/app/factories/fGroups.js"></script>
    <script src="/js/app/factories/fAdmin.js"></script>

    <script src="/js/app/router.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static-wro4j/${version}/tatami-app.js"></script>
    <script src="/tatami/static-wro4j/${version}/tatami-app-account.js"></script>
</c:if>

<jsp:include page="includes/templates.jsp"/>

<jsp:include page="includes/help-home.jsp"/>

</html>