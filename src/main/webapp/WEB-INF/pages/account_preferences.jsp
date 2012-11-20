<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

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
                             src="https://www.gravatar.com/avatar/${user.gravatar}?s=64&d=mm" alt="">

                        <h3>${user.firstName} ${user.lastName}</h3>

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
                                <a href="/tatami/account">
                                    <i class="icon-user"></i> <fmt:message key="tatami.menu.profile"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/groups">
                                    <i class="icon-th"></i> <fmt:message key="tatami.menu.groups"/>
                                </a>
                            </li>
                            <li class="active">
                                <a href="#">
                                    <i class="icon-picture"></i> <fmt:message key="tatami.menu.preferences"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/password">
                                    <i class="icon-lock"></i> <fmt:message key="tatami.menu.password"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/directory">
                                    <i class="icon-globe"></i> <fmt:message key="tatami.menu.directory"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/status_of_the_day">
                                    <i class="icon-signal"></i> <fmt:message key="tatami.menu.status.of.the.day"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/account/tags_directory">
                                    <i class="icon-globe"></i> <fmt:message key="tatami.menu.tags.directory"/>
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
                                            key="tatami.preferences.success"/>
                                </div>
                            </c:if>

                            <h2>
                                <fmt:message key="tatami.menu.preferences"/>
                            </h2>

                            <h3>
                                <fmt:message key="tatami.preferences.theme"/>
                            </h3>

                            <div class="btn-group">
                                <button class="btn btn-large dropdown-toggle" data-toggle="dropdown">
                                    <fmt:message key="tatami.preferences.theme.current"/> ${user.theme} <span
                                        class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a href="preferences/theme/update?theme=bootstrap">bootstrap</a></li>
                                    <li><a href="preferences/theme/update?theme=amelia">amelia</a></li>
                                    <li><a href="preferences/theme/update?theme=cerulean">cerulean</a></li>
                                    <li><a href="preferences/theme/update?theme=cyborg">cyborg</a></li>
                                    <li><a href="preferences/theme/update?theme=journal">journal</a></li>
                                    <li><a href="preferences/theme/update?theme=readable">readable</a></li>
                                    <li><a href="preferences/theme/update?theme=simplex">simplex</a></li>
                                    <li><a href="preferences/theme/update?theme=slate">slate</a></li>
                                    <li><a href="preferences/theme/update?theme=spacelab">spacelab</a></li>
                                    <li><a href="preferences/theme/update?theme=spruce">spruce</a></li>
                                    <li><a href="preferences/theme/update?theme=superhero">superhero</a></li>
                                    <li><a href="preferences/theme/update?theme=united">united</a></li>
                                </ul>
                            </div>
                            <p>&nbsp;</p>

                            <h3>
                                <fmt:message key="tatami.preferences.email"/>
                            </h3>

                            <form class="form-horizontal" action="preferences/email/update" method="post" accept-charset="utf-8">

                                <fieldset>

                                    <div class="control-group">
                                        <div class="controls">
                                            <label class="checkbox">
                                                <input name="preferencesMentionEmail" type="checkbox" <c:if test="${user.preferencesMentionEmail}">checked="true"</c:if>/> <fmt:message key="tatami.preferences.email.mention"/>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="form-actions">
                                        <button type="submit" class="input-xlarge btn btn-primary">
                                            <fmt:message key="tatami.form.save"/>
                                        </button>
                                    </div>
                                </fieldset>

                            </form>

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