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
                                <li class="active">
                                    <a href="/tatami/account/preferences">
                                        <i class="icon-picture"></i> <fmt:message key="tatami.menu.preferences"/>
                                    </a>
                                </li>
                                <li>
                                    <a href="/tatami/account/password">
                                        <i class="icon-lock"></i> <fmt:message key="tatami.menu.password"/>
                                    </a>
                                </li>
                                <li>
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
                                    <a href="/tatami/account/tags/directory/#/account-tags">
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
                            <div class="tab-content span12 alert alert-status">
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

                                <form class="row-fluid form-horizontal" action="preferences/theme/update" method="get" accept-charset="utf-8">

                                    <fieldset class="span12">

                                        <div class="control-group">
                                            <label class="control-label" for="theme">
                                                <fmt:message
                                                key="tatami.preferences.theme.current"/>
                                            </label>
                                            <div class="controls">
                                                <select class="input-xlarge span12" name="theme" onchange="this.form.submit();">
                                                    <option value="bootstrap" <c:if test="${user.theme ==
                                                    'bootstrap'}">selected="true"</c:if>>Bootstrap</option>
                                                    <option value="amelia" <c:if test="${user.theme ==
                                                    'amelia'}">selected="true"</c:if>>Amelia</option>
                                                    <option value="cerulean" <c:if test="${user.theme ==
                                                    'cerulean'}">selected="true"</c:if>>Cerulean</option>
                                                    <option value="cyborg" <c:if test="${user.theme ==
                                                    'cyborg'}">selected="true"</c:if>>Cyborg</option>
                                                    <option value="journal" <c:if test="${user.theme ==
                                                    'journal'}">selected="true"</c:if>>Journal</option>
                                                    <option value="readable" <c:if test="${user.theme ==
                                                    'readable'}">selected="true"</c:if>>Readable</option>
                                                    <option value="simplex" <c:if test="${user.theme ==
                                                    'simplex'}">selected="true"</c:if>>Simplex</option>
                                                    <option value="slate" <c:if test="${user.theme ==
                                                    'slate'}">selected="true"</c:if>>Slate</option>
                                                    <option value="spacelab" <c:if test="${user.theme ==
                                                    'spacelab'}">selected="true"</c:if>>Spacelab</option>
                                                    <option value="spruce" <c:if test="${user.theme ==
                                                    'spruce'}">selected="true"</c:if>>Spruce</option>
                                                    <option value="superhero" <c:if test="${user.theme ==
                                                    'superhero'}">selected="true"</c:if>>Superhero</option>
                                                    <option value="united" <c:if test="${user.theme ==
                                                    'united'}">selected="true"</c:if>>United</option>
                                                </select>
                                            </div>
                                        </div>
                                    </fieldset>

                                </form>

                                <h3>
                                    <fmt:message key="tatami.preferences.email"/>
                                </h3>

                                <form class="row-fluid form-horizontal" action="preferences/notifications/update" method="post" accept-charset="utf-8">

                                    <fieldset class="span12">

										<div class="control-group">
											<div class="controls">
												<label class="checkbox">
													<input name="preferencesMentionEmail" type="checkbox" <c:if test="${user.preferencesMentionEmail}">checked="true"</c:if>/> <fmt:message key="tatami.preferences.notifications.email.mention"/>
												</label>
											</div>
											<div class="controls">
												<label class="checkbox">
													<input name="preferencesRssTimeline" type="checkbox" <c:if test="${not empty user.rssUid}">checked="true"</c:if>/> <fmt:message key="tatami.preferences.notifications.rss.timeline"/>
												</label>
											<c:if test="${not empty user.rssUid}"><a href="/tatami/syndic/${user.rssUid}" ><fmt:message key="tatami.preferences.notifications.rss.timeline.link"/> </a></c:if>
											</div>
										</div>

                                        <div class="form-actions">
                                            <button type="submit" class="input-xlarge btn btn-primary">
                                                <fmt:message key="tatami.form.save"/>
                                            </button>
                                        </div>
                                    </fieldset>

                                </form>
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
