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
            <div class="nomargin well row">
                <div class="span4 text-center">
                    <a href="/tatami/profile/${user.username}/">
                        <img class="pull-left nomargin avatar" src="https://www.gravatar.com/avatar/${user.gravatar}?s=64&d=mm" alt="">
                        <h3 class="user-profile">${user.firstName} ${user.lastName}</h3>
                        <p>@${user.username}</p>
                    </a>
                </div>
            </div>
            <br/>
            <div class="row">
                <div class="span4">
                    <div class="tabbable alert alert-status">
                        <ul class="nav nav-pills nav-stacked nomargin">
                            <li>
                                <a href="/tatami/account/">
                                    <i class="icon-user"></i> <fmt:message key="tatami.menu.profile"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/preferences">
                                    <i class="icon-picture"></i> <fmt:message key="tatami.menu.preferences"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/password">
                                    <i class="icon-lock"></i> <fmt:message key="tatami.menu.password"/>
                                </a>
                            </li>
                            <li class="active">
                                <a href="/tatami/account/directory/#/account-users">
                                    <i class="icon-globe"></i> <fmt:message key="tatami.menu.directory"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/groups/#/account-groups">
                                    <i class="icon-th-large"></i> <fmt:message key="tatami.menu.groups"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/tags/#/account-tags">
                                    <i class="icon-tags"></i> <fmt:message key="tatami.menu.tags"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/status_of_the_day">
                                    <i class="icon-signal"></i> <fmt:message key="tatami.menu.status.of.the.day"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="span8">
                    <div class="row-fluid">
                        <div class="tab-content span12 alert alert-status adminMenu">
								<ul class="nav nav-pills">
									<li class="active"><a href="#/account-users"><fmt:message
												key="tatami.user" /></a></li>
									<li><a href="#/popular-users"><fmt:message
												key="tatami.user.popular" /></a></li>
								</ul>
								
								<div id="admin-content"></div>


                            </div>
                        </div>
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


<jsp:include page="includes/footer.jsp"/>
<jsp:include page="includes/templates-admin.jsp"/>

<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var username = "${user.username}";
    var page = "directory";
</script>
<script src="/js/tatami-admin.js"></script>
</body>
</html>