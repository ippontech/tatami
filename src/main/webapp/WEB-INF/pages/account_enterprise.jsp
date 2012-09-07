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
                        <img class="pull-left nomargin avatar" src="http://www.gravatar.com/avatar/${user.gravatar}?s=64" alt="Arthur Weber">
                        <h3>${user.firstName} ${user.lastName}</h3>
                        <p>@${user.username}</p>
                    </a>
                </div>
            </div>
            <br/>
            <div class="row">
                <div class="span4">
                    <div class="tabbable alert alert-info">
                        <ul class="nav nav-pills nav-stacked nomargin">
                            <li>
                                <a href="/tatami/account">
                                    <i class="icon-user"></i> <fmt:message key="tatami.menu.profile"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/theme">
                                    <i class="icon-picture"></i> <fmt:message key="tatami.menu.theme"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/password">
                                    <i class="icon-lock"></i> <fmt:message key="tatami.menu.password"/>
                                </a>
                            </li>
                            <li class="active">
                                <a href="#">
                                    <i class="icon-globe"></i> <fmt:message key="tatami.menu.enterprise"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="span8">
                    <div class="row-fluid">
                        <div class="tab-content span12">
                                <h2>
                                    <fmt:message key="tatami.menu.enterprise"/>
                                </h2>
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th><fmt:message
                                                key="tatami.username"/></th>
                                        <th class="hidden-phone"><fmt:message
                                                key="tatami.user.firstName"/></th>
                                        <th class="hidden-phone"><fmt:message
                                                key="tatami.user.lastName"/></th>
                                        <th><fmt:message
                                                key="tatami.badge.status"/></th>
                                        <th class="hidden-phone"><fmt:message
                                                key="tatami.badge.followed"/></th>
                                        <th><fmt:message
                                                key="tatami.badge.followers"/></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <c:forEach items="${users}" var="u">
                                        <tr>
                                            <td>
                                                <a href="/tatami/profile/${u.username}/" title="<fmt:message key="tatami.user.profile.show"/> @${u.username} ${u.firstName} ${u.lastName}">
                                                    <img class="pull-left nomargin avatar avatar-small" src="http://www.gravatar.com/avatar/${u.gravatar}?s=64" alt="${u.firstName} ${u.lastName}"/>
                                                    @${u.username}
                                                </a>
                                            </td>
                                            <td class="hidden-phone">
                                                ${u.firstName}
                                            </td>
                                            <td class="hidden-phone">
                                                ${u.lastName}
                                            </td>
                                            <td>
                                                ${u.statusCount}
                                            </td>
                                            <td class="hidden-phone">
                                                ${u.friendsCount}
                                            </td>
                                            <td>
                                                ${u.followersCount}
                                            </td>
                                        </tr>
                                    </c:forEach>
                                    </tbody>
                                </table>
                                <ul class="pager">
                                    <c:if test="${paginationPrevious != null}">
                                        <li>
                                            <a href="/tatami/account/enterprise?pagination=${paginationPrevious}"><fmt:message
                                                    key="tatami.form.previous"/></a>
                                        </li>
                                    </c:if>
                                    <c:if test="${paginationNext != null}">
                                        <li>
                                            <a href="/tatami/account/enterprise?pagination=${paginationNext}"><fmt:message
                                                    key="tatami.form.next"/></a>
                                        </li>
                                    </c:if>
                                </ul>
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

<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var username = "${user.username}";
    var page = "account";
</script>
</body>
</html>