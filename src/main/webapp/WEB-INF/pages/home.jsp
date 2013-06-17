<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="row">
    <div id="tatamiHeader" class="col-span-12">
    </div>
</div>

<div class="row">
    <aside id="tatamiSide" class="col-span-3">
    </aside>
    <section id="tatamiBody" class="col-span-9">
    </section>
</div>

<c:if test="${!ios}">
    <form id="tatamiEdit" class="modal fade">
    </form>
</c:if>

</body>

<jsp:include page="includes/footer.jsp"/>

<c:if test="${wro4jEnabled eq false}">
    <script src="/js/app/app.js"></script>
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
    <script src="/js/app/router.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static-wro4j/${version}/tatami-app.js"></script>
</c:if>

<jsp:include page="includes/templates.jsp"/>

<jsp:include page="includes/help-home.jsp"/>

</html>