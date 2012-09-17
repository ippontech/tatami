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
                        <img class="pull-left nomargin avatar"
                             src="http://www.gravatar.com/avatar/${user.gravatar}?s=64" alt="">

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
                            <li class="active">
                                <a href="#">
                                    <i class="icon-picture"></i> <fmt:message key="tatami.menu.theme"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/password">
                                    <i class="icon-lock"></i> <fmt:message key="tatami.menu.password"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/enterprise">
                                    <i class="icon-globe"></i> <fmt:message key="tatami.menu.enterprise"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="span8">
                    <div class="row-fluid">
                        <div class="tab-content span12">
                            <c:if test="${success == 'true'}">
                                <div class="alert alert-success">
                                    <fmt:message
                                            key="tatami.user.password.success"/>
                                </div>
                            </c:if>

                            <h2>
                                <fmt:message key="tatami.menu.theme"/>
                            </h2>

                            <div class="btn-group">
                                <button class="btn btn-large dropdown-toggle" data-toggle="dropdown">
                                    <fmt:message key="tatami.user.theme.current"/> ${theme} <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a href="theme/update?theme=bootstrap">bootstrap</a></li>
                                    <li><a href="theme/update?theme=amelia">amelia</a></li>
                                    <li><a href="theme/update?theme=cerulean">cerulean</a></li>
                                    <li><a href="theme/update?theme=cyborg">cyborg</a></li>
                                    <li><a href="theme/update?theme=journal">journal</a></li>
                                    <li><a href="theme/update?theme=readable">readable</a></li>
                                    <li><a href="theme/update?theme=simplex">simplex</a></li>
                                    <li><a href="theme/update?theme=slate">slate</a></li>
                                    <li><a href="theme/update?theme=spacelab">spacelab</a></li>
                                    <li><a href="theme/update?theme=spruce">spruce</a></li>
                                    <li><a href="theme/update?theme=superhero">superhero</a></li>
                                    <li><a href="theme/update?theme=united">united</a></li>
                                </ul>
                            </div>

                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
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