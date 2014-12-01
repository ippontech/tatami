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

    <script src="/js/vendor/raphael-min.js"></script>
    <script src="/js/vendor/jquery.jgrowl.js"></script>
    <script src="/js/app/plugins/jquery-raphael-tatami-pie.js"></script>
    <script src="/js/app/plugins/bootstrap-filestyle.min.js"></script>

    <script src="/js/account/models/mAccountProfile.js"></script>
    <script src="/js/account/models/mPreferences.js"></script>
    <script src="/js/account/models/mPassword.js"></script>
    <script src="/js/account/models/mGroup.js"></script>
    <script src="/js/account/models/mUserSearch.js"></script>
    <script src="/js/account/models/mUserGroup.js"></script>

    <script src="/js/account/collections/cDailyStat.js"></script>
    <script src="/js/account/collections/cUserSearch.js"></script>
    <script src="/js/account/collections/cAdminGroup.js"></script>

    <script src="/js/account/views/vHeader.js"></script>
    <script src="/js/account/views/vAccountProfile.js"></script>
    <script src="/js/account/views/vPreferences.js"></script>
    <script src="/js/account/views/vPassword.js"></script>
    <script src="/js/account/views/vGroup.js"></script>
    <script src="/js/account/views/vDailyStat.js"></script>
    <script src="/js/account/views/vTab.js"></script>

    <script src="/js/account/layout/lAccount.js"></script>
    <script src="/js/account/layout/lContent.js"></script>
    <script src="/js/account/router.js"></script>
    <script src="/js/account/app.js"></script>


    <!--APP-->
    <script src="/js/app/plugins/tatami.search.js"></script>
    <script src="/js/app/plugins/suggester.js"></script>
    <script src="/js/app/models/mUser.js"></script>
    <script src="/js/app/collections/cUsers.js"></script>
    <script src="/js/app/models/mFile.js"></script>
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

</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/vendor/raphael-min.js"></script>
    <script src="/tatami/static/${version}/app/plugins/jquery-raphael-tatami-pie.js"></script>
    <script src="/tatami/static/${version}/app/plugins/bootstrap-filestyle.min.js"></script>
    <script src="/tatami/static-wro4j/${version}/tatami-account.js"></script>
    <script src="/tatami/static-wro4j/${version}/tatami-app-account.js"></script>
</c:if>

</body>
</html>