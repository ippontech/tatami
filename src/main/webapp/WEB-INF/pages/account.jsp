<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<jsp:include page="includes/navigation-admin.jsp"/>
<jsp:include page="includes/templates-admin.jsp"/>



<jsp:include page="includes/footer.jsp"/>

<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var username = "${user.username}";
    var page = "account";
</script>

<c:if test="${wro4jEnabled eq false}">
  <script src="/js/vendor/raphael-min.js"></script>
  <script src="/js/app/plugins/jquery-raphael-tatami-pie.js"></script>
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
    <script src="/js/account/models/mGroup.js"></script>
    <script src="/js/account/models/mUserSearch.js"></script>
    <script src="/js/account/collections/cUserSearch.js"></script>

    <script src="/js/account/models/mUserGroup.js"></script>
    <script src="/js/account/collections/cAdminGroup.js"></script>

    <script src="/js/account/models/mFollowUser.js"></script>
    <script src="/js/account/collections/cTabUser.js"></script>
    <script src="/js/account/views/vAccountProfile.js"></script>
    <script src="/js/account/models/mAccountProfile.js"></script>

    <script src="/js/account/router.js"></script>

  <script src="/js/account/app.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/vendor/raphael-min.js"></script>
    <script src="/tatami/static/${version}/app/plugins/jquery-raphael-tatami-pie.js"></script>
    <script src="/tatami/static/${version}/views.js"></script>
    <script src="/tatami/static/${version}/models.js"></script>
    <script src="/tatami/static/${version}/account/app.js"></script>
</c:if>

</body>
</html>