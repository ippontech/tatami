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

<div class="container-fluid mainPanel">
    <c:choose>
        <c:when test="${not empty user}">

            <div id="userProfileDesc" class="row-fluid">
                <div class="span1">
                    <img id="userPicture" src="http://www.gravatar.com/avatar/${user.gravatar}/>?s=64"/>
                </div>
                <div class="span7" style="width: 250px">
                    <a href="/tatami/profile/${user.username}/"><h3>${user.firstName}&nbsp;${user.lastName}</h3>
                        @${user.username}</a>
                </div>
            </div>

            <div class="row-fluid">
                <div id="menuContent" class="span4">
                    <div class="alert alert-info">
                        <ul class="nav nav-pills nav-stacked">
                            <li>
                                <a id="profileTab" href="/tatami/account"><i
                                        class="icon-user"></i>&nbsp;<fmt:message
                                        key="tatami.menu.profile"/></a>
                            </li>
                            <li class="active"><a id="passwordTab" href="#"><i
                                    class="icon-lock"></i>&nbsp;<fmt:message
                                    key="tatami.menu.password"/></a></li>
                            <li><a id="enterpriseTab" href="/tatami/account/enterprise"><i
                                    class="icon-globe"></i>&nbsp;<fmt:message
                                    key="tatami.menu.enterprise"/></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="mainContent" class="span8">
                    <div class="tab-content">
                        <div class="tab-pane" id="profile">

                        </div>
                        <div class="tab-pane active" id="password">

                            <c:if test="${success == 'true'}">
                                <div class="alert alert-success">
                                    <fmt:message
                                            key="tatami.user.password.success"/>
                                </div>
                            </c:if>

                            <h2><fmt:message
                                    key="tatami.menu.password"/></h2>

                            <form:form class="form-horizontal" commandName="userPassword" method="post">

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

    $(document).ready(function () {
        initAccount();
    });
</script>
</body>
</html>