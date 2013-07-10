<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div id="mainPanel" class="container">
    <c:choose>
        <c:when test="${not empty user}">

            <div class="nomargin well row avatar-float-left-container">
                <div class="col-span-5 text-center">
                    <a href="/tatami/home/users/${user.username}/">
                        <c:if test="${empty user.avatar}">
                            <img class="pull-left nomargin avatar avatar-float-left" src="/img/default_image_profile.png" alt="">
                        </c:if>
                        <c:if test="${not empty user.avatar}">
                            <img class="pull-left nomargin avatar avatar-float-left" src="/tatami/avatar/${user.avatar}/photo.jpg" alt="">
                        </c:if>
                        <h3 class="user-profile">${user.firstName} ${user.lastName}</h3>
                        <p>@${user.username}</p>
                    </a>
                </div>
            </div>
            <br/>
            <div class="row">
                <div class="col-span-4">
                    <div class="tabbable alert alert-status">
                        <ul class="adminMenu nav nav-pills nav-stacked nomargin">
                            <li class="active">
                                <a href="/tatami/account/#/profile">
                                    <i class="glyphicon glyphicon-user"></i> <fmt:message key="tatami.menu.profile"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/preferences">
                                    <i class="glyphicon glyphicon-picture"></i> <fmt:message key="tatami.menu.preferences"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/password">
                                    <i class="glyphicon glyphicon-lock"></i> <fmt:message key="tatami.menu.password"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/files">
                                    <i class="glyphicon glyphicon-file"></i> <fmt:message key="tatami.menu.files"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/users">
                                    <i class="glyphicon glyphicon-globe"></i> <fmt:message key="tatami.menu.directory"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/groups">
                                    <i class="glyphicon glyphicon-th-large"></i> <fmt:message key="tatami.menu.groups"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/tags">
                                    <i class="glyphicon glyphicon-tags"></i> <fmt:message key="tatami.menu.tags"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/#/status_of_the_day">
                                    <i class="glyphicon glyphicon-signal"></i> <fmt:message key="tatami.menu.status.of.the.day"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-span-8">
                    <div id="accountContent" class="alert alert-status">


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
  <script src="/js/tatami-admin.js"></script>
</c:if>
<c:if test="${wro4jEnabled eq true}">
    <script src="/tatami/static/${version}/vendor/raphael-min.js"></script>
    <script src="/tatami/static/${version}/app/plugins/jquery-raphael-tatami-pie.js"></script>
    <script src="/tatami/static/${version}/tatami-admin.js"></script>
</c:if>

</body>
</html>