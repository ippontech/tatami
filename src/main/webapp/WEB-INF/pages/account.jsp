<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>




<!DOCTYPE html>

<html lang="en">

<jsp:include page="includes/header.jsp"/>

<script id="template-account" type="text/template">

    <div id="mainPanel" class="container">
        <c:choose>
            <c:when test="${not empty user}">
                <div id="avatar"></div>
                <br/>
                <div class="row">
                <div id="navigation"></div>
                    <div class="col-span-8">
                        <div id="accountContent" class="alert alert-status">
                            <div id="content-container"></div>
                        </div>
                    </div>
                </div>
            </c:when>
            <c:otherwise>
                <div class="row-fluid">
                    <fmt:message key="tatami.user.undefined"/>
                </div>
            </c:otherwise>
        </c:choose>
    </div>

</script>

<script id="template-avatar" type="text/html">
    <jsp:include page="includes/topavatar.jsp"/>
</script>

<script id="template-navigation" type="text/html">
    <jsp:include page="includes/navigation-admin.jsp"/>
</script>

<script id="template-content" type="text/template">
    <div id="region1"></div>
    <div id="region2"></div>
    <div id="region3"></div>
    <div id="region4"></div>
    <div id="region5"></div>
</script>

<script id="template-account-profile" type="text/template">
    <div id="profile-change"></div>
    <div id="profile-destroy"></div>
</script>

<script id="template-avatar" type="text/html">
    <jsp:include page="includes/topavatar.jsp"/>
</script>

<script id="template-navigation" type="text/html">
    <jsp:include page="includes/navigation-admin.jsp"/>

</script>

<body>

<jsp:include page="includes/templates-admin.jsp"/>
<jsp:include page="includes/templates.jsp"/>
<jsp:include page="includes/topmenu.jsp"/>


<div id="the-container"></div>

<jsp:include page="includes/footer.jsp"/>

<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var username = "${user.username}";
    var page = "account";
</script>

<c:if test="${wro4jEnabled eq false}">

   <!-- <script src="/js/app/collections/users.js"></script>
    <script src="/js/app/models/user.js"></script>
    <script src="/js/app/views/userList.js"></script>    -->
  <script src="/js/vendor/raphael-min.js"></script>
  <script src="/js/app/plugins/jquery-raphael-tatami-pie.js"></script>
    <script src="/js/vendor/jquery.jgrowl.js"></script>
    <script src="/js/account/views/vTest.js"></script>

    <script src="/js/account/views/vAccountProfile.js"></script>
    <script src="/js/account/layout/lAccount.js"></script>
    <script src="/js/account/layout/lContent.js"></script>
    <script src="/js/account/views/vPreferences.js"></script>
    <script src="/js/account/models/mPreferences.js"></script>
    <script src="/js/account/views/vPassword.js"></script>
    <script src="/js/account/models/mPassword.js"></script>
    <script src="/js/account/views/vFile.js"></script>
    <script src="/js/account/views/vGroup.js"></script>



    <script src="/js/account/models/mFile.js"></script>
    <script src="/js/account/collections/cTabTag.js"></script>
    <script src="/js/account/models/mFollowTag.js"></script>
    <script src="/js/account/collections/cDailyStat.js"></script>
    <script src="/js/account/views/vUser.js"></script>
    <script src="/js/account/views/vTag.js"></script>
    <script src="/js/account/views/vDailyStat.js"></script>
    <script src="/js/account/views/vTab.js"></script>
    <script src="/js/account/collections/cFiles.js"></script>
    <script src="/js/account/collections/cUsers.js"></script>
    <script src="/js/account/models/mGroup.js"></script>
    <script src="/js/account/models/mUserSearch.js"></script>
    <script src="/js/account/collections/cUserSearch.js"></script>
    <script src="/js/account/models/mUserGroup.js"></script>
    <script src="/js/account/collections/cAdminGroup.js"></script>
    <script src="/js/account/models/mFollowUser.js"></script>
    <script src="/js/account/collections/cUsers.js"></script>

    <script src="/js/account/models/mAccountProfile.js"></script>
    <script src="/js/account/router.js"></script>
    <!--script src="/js/app/router.js"></script-->
    <script src="/js/account/app.js"></script>


    <!--APP-->
    <script src="/js/app/plugins/tatami.search.js"></script>
    <script src="/js/app/plugins/suggester.js"></script>
    <script src="/js/app/models/user.js"></script>
    <script src="/js/app/collections/users.js"></script>
    <script src="/js/app/models/postStatus.js"></script>
    <script src="/js/app/models/status.js"></script>
    <script src="/js/app/models/homeBody.js"></script>
    <script src="/js/app/collections/statuses.js"></script>
    <script src="/js/app/models/tag.js"></script>
    <script src="/js/app/collections/tags.js"></script>
    <script src="/js/app/models/group.js"></script>
    <script src="/js/app/collections/groups.js"></script>
    <script src="/js/app/models/statusDetails.js"></script>
    <script src="/js/app/models/search.js"></script>
    <script src="/js/app/views/cardProfile.js"></script>
    <script src="/js/app/views/navbar.js"></script>
    <script src="/js/app/views/homeContainers.js"></script>
    <script src="/js/app/views/tagsContainers.js"></script>
    <script src="/js/app/views/profileContainers.js"></script>
    <script src="/js/app/views/groupsContainers.js"></script>
    <script src="/js/app/views/statuses.js"></script>
    <script src="/js/app/views/statusEdit.js"></script>
    <script src="/js/app/views/statusUpdateButton.js"></script>
    <script src="/js/app/views/welcome.js"></script>
    <script src="/js/app/views/userList.js"></script>
    <script src="/js/app/views/statusShares.js"></script>
    <script src="/js/app/views/tagTrends.js"></script>
    <script src="/js/app/views/groups.js"></script>
    <script src="/js/app/views/profileSide.js"></script>
    <script src="/js/app/views/search.js"></script>
    <script src="/js/app/factories/home.js"></script>
    <script src="/js/app/factories/profile.js"></script>
    <script src="/js/app/factories/status.js"></script>
    <script src="/js/app/factories/tags.js"></script>
    <script src="/js/app/factories/search.js"></script>
    <script src="/js/app/factories/groups.js"></script>



</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/vendor/raphael-min.js"></script>
    <script src="/tatami/static/${version}/app/plugins/jquery-raphael-tatami-pie.js"></script>
    <script src="/tatami/static/${version}/vendor/jquery.jgrowl.js"></script>
    <script src="/tatami/static/${version}/account/views/vTest.js"></script>

    <script src="/tatami/static/${version}/account/views/vAccountProfile.js"></script>
    <script src="/tatami/static/${version}/account/layout/lAccount.js"></script>
    <script src="/tatami/static/${version}/account/layout/lContent.js"></script>
    <script src="/tatami/static/${version}/account/views/vPreferences.js"></script>
    <script src="/tatami/static/${version}/account/models/mPreferences.js"></script>
    <script src="/tatami/static/${version}/account/views/vPassword.js"></script>
    <script src="/tatami/static/${version}/account/models/mPassword.js"></script>
    <script src="/tatami/static/${version}/account/views/vFile.js"></script>
    <script src="/tatami/static/${version}/account/views/vGroup.js"></script>



    <script src="/tatami/static/${version}/account/models/mFile.js"></script>
    <script src="/tatami/static/${version}/account/collections/cTabTag.js"></script>
    <script src="/tatami/static/${version}/account/models/mFollowTag.js"></script>
    <script src="/tatami/static/${version}/account/collections/cDailyStat.js"></script>
    <script src="/tatami/static/${version}/account/views/vUser.js"></script>
    <script src="/tatami/static/${version}/account/views/vTag.js"></script>
    <script src="/tatami/static/${version}/account/views/vDailyStat.js"></script>
    <script src="/tatami/static/${version}/account/views/vTab.js"></script>
    <script src="/tatami/static/${version}/account/collections/cFiles.js"></script>
    <script src="/tatami/static/${version}/account/collections/cUsers.js"></script>
    <script src="/tatami/static/${version}/account/models/mGroup.js"></script>
    <script src="/tatami/static/${version}/account/models/mUserSearch.js"></script>
    <script src="/tatami/static/${version}/account/collections/cUserSearch.js"></script>
    <script src="/tatami/static/${version}/account/models/mUserGroup.js"></script>
    <script src="/tatami/static/${version}/account/collections/cAdminGroup.js"></script>
    <script src="/tatami/static/${version}/account/models/mFollowUser.js"></script>
    <script src="/tatami/static/${version}/account/collections/cUsers.js"></script>

    <script src="/tatami/static/${version}/account/models/mAccountProfile.js"></script>
    <script src="/tatami/static/${version}/account/router.js"></script>
    <!--script src="/js/app/router.js"></script-->
    <script src="/tatami/static/${version}/account/app.js"></script>

    <script src="/tatami/static/${version}/app/plugins/tatami.search.js"></script>
    <script src="/tatami/static/${version}/app/plugins/suggester.js"></script>
    <script src="/tatami/static/${version}/app/models/user.js"></script>
    <script src="/tatami/static/${version}/app/collections/users.js"></script>
    <script src="/tatami/static/${version}/app/models/postStatus.js"></script>
    <script src="/tatami/static/${version}/app/models/status.js"></script>
    <script src="/tatami/static/${version}/app/models/homeBody.js"></script>
    <script src="/tatami/static/${version}/app/collections/statuses.js"></script>
    <script src="/tatami/static/${version}/app/models/tag.js"></script>
    <script src="/tatami/static/${version}/app/collections/tags.js"></script>
    <script src="/tatami/static/${version}/app/models/group.js"></script>
    <script src="/tatami/static/${version}/app/collections/groups.js"></script>
    <script src="/tatami/static/${version}/app/models/statusDetails.js"></script>
    <script src="/tatami/static/${version}/app/models/search.js"></script>
    <script src="/tatami/static/${version}/app/views/cardProfile.js"></script>
    <script src="/tatami/static/${version}/app/views/navbar.js"></script>
    <script src="/tatami/static/${version}/app/views/homeContainers.js"></script>
    <script src="/tatami/static/${version}/app/views/tagsContainers.js"></script>
    <script src="/tatami/static/${version}/app/views/profileContainers.js"></script>
    <script src="/tatami/static/${version}/app/views/groupsContainers.js"></script>
    <script src="/tatami/static/${version}/app/views/statuses.js"></script>
    <script src="/tatami/static/${version}/app/views/statusEdit.js"></script>
    <script src="/tatami/static/${version}/app/views/statusUpdateButton.js"></script>
    <script src="/tatami/static/${version}/app/views/welcome.js"></script>
    <script src="/tatami/static/${version}/app/views/userList.js"></script>
    <script src="/tatami/static/${version}/app/views/statusShares.js"></script>
    <script src="/tatami/static/${version}/app/views/tagTrends.js"></script>
    <script src="/tatami/static/${version}/app/views/groups.js"></script>
    <script src="/tatami/static/${version}/app/views/profileSide.js"></script>
    <script src="/tatami/static/${version}/app/views/search.js"></script>
    <script src="/tatami/static/${version}/app/factories/home.js"></script>
    <script src="/tatami/static/${version}/app/factories/profile.js"></script>
    <script src="/tatami/static/${version}/app/factories/status.js"></script>
    <script src="/tatami/static/${version}/app/factories/tags.js"></script>
    <script src="/tatami/static/${version}/app/factories/search.js"></script>
    <script src="/tatami/static/${version}/app/factories/groups.js"></script>
</c:if>

</body>
</html>