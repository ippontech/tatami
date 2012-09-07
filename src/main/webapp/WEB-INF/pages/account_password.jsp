<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

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
                            <li class="active">
                                <a href="#">
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
                <div class="span8 container">
                    <div class="tab-content span12">

                            <c:if test="${success == 'true'}">
                                <div class="alert alert-success">
                                    <fmt:message
                                            key="tatami.user.password.success"/>
                                </div>
                            </c:if>

                            <h2><fmt:message
                                    key="tatami.menu.password"/></h2>

                            <form:form class="form-horizontal" commandName="userPassword" method="post" acceptCharset="utf-8">

                                <spring:bind path="*">
                                    <c:if test="${fn:length(status.errorMessages) > 0}">
                                        <div class="alert alert-error">
                                            <fmt:message
                                                    key="tatami.user.update.error"/>
                                            <ul>
                                                <c:forEach items="${status.errorMessages}" var="error">
                                                    <li>${error}</li>
                                                </c:forEach>
                                            </ul>
                                        </div>
                                    </c:if>
                                </spring:bind>

                                <fieldset>
                                    <legend><fmt:message key="tatami.user.password.legend"/></legend>
                                    <div class="control-group">
                                        <label class="control-label" for="oldPassword"><fmt:message
                                                key="tatami.user.old.password"/></label>

                                        <div class="controls">
                                            <form:input type="password"
                                                        id="oldPassword"
                                                        required="required"
                                                        size="15" maxlength="40" class="input-xlarge"
                                                        path="oldPassword"/>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="newPassword"><fmt:message
                                                key="tatami.user.new.password"/></label>

                                        <div class="controls">
                                            <form:input type="password"
                                                        id="newPassword"
                                                        required="required"
                                                        size="15" maxlength="40" class="input-xlarge"
                                                        path="newPassword"/>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="newPasswordConfirmation"><fmt:message
                                                key="tatami.user.new.password.confirmation"/></label>

                                        <div class="controls">
                                            <form:input type="password"
                                                        id="newPasswordConfirmation"
                                                        required="required"
                                                        size="15" maxlength="40" class="input-xlarge"
                                                        path="newPasswordConfirmation"/>
                                        </div>
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn btn-primary"><fmt:message
                                                key="tatami.form.save"/></button>
                                    </div>
                                </fieldset>
                            </form:form>
                        </div>
                        <div class="tab-pane" id="enterprise">
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