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
                        <img class="pull-left nomargin avatar" src="https://www.gravatar.com/avatar/${user.gravatar}?s=64" alt="">
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
                            <li class="active">
                                <a href="#">
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
                                    <fmt:message key="tatami.user.update.success"/>
                                </div>
                            </c:if>
                            <c:if test="${error == 'true'}">
                                <div class="alert alert-error">
                                    <fmt:message key="tatami.user.update.error"/>
                                </div>
                            </c:if>
                            <h2>
                                <fmt:message key="tatami.account.update.title"/>
                            </h2>

                            <form:form class="form-horizontal" commandName="user" method="post" acceptCharset="utf-8">
                                <fieldset>
                                    <legend><fmt:message key="tatami.account.update.legend"/></legend>

                                    <div class="control-group">
                                        <label class="control-label"><fmt:message
                                                key="tatami.user.email"/></label>

                                        <div class="controls">
                                            <form:input type="text" disabled="true" path="login"/>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label"><fmt:message
                                                key="tatami.user.picture"/></label>

                                        <div class="controls">
                                            <img class="nomargin avatar" src="https://www.gravatar.com/avatar/${user.gravatar}?s=64"/>
                                            <br/>
                                            <fmt:message
                                                    key="tatami.user.picture.legend"/><br/><a
                                                href="http://www.gravatar.com"
                                                target="_blank">http://www.gravatar.com</a>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="firstName"><fmt:message
                                                key="tatami.user.firstName"/></label>

                                        <div class="controls">
                                            <form:input type="text"
                                                        id="firstName"
                                                        size="15" maxlength="40" class="input-xlarge"
                                                        path="firstName"/>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="lastName"><fmt:message
                                                key="tatami.user.lastName"/></label>

                                        <div class="controls">
                                            <form:input type="text"
                                                        id="lastName"
                                                        size="15" maxlength="40" class="input-xlarge"
                                                        path="lastName"/>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="jobTitle"><fmt:message
                                                key="tatami.user.jobTitle"/></label>

                                        <div class="controls">
                                            <form:input type="text"
                                                        id="jobTitle"
                                                        size="15" maxlength="100" class="input-xlarge"
                                                        path="jobTitle"/>
                                        </div>
                                    </div>
                                    
                                    <div class="control-group">
                                        <label class="control-label" for="phoneNumber"><fmt:message
                                                key="tatami.user.phoneNumber"/></label>

                                        <div class="controls">
                                            <form:input type="text"
                                                        size="10" maxlength="20" class="input-xlarge"
                                                        path="phoneNumber"/>
                                        </div>
                                    </div>

                                    <div class="form-actions">
                                        <button type="submit" class="input-xlarge btn btn-primary">
                                            <fmt:message key="tatami.form.save"/>
                                        </button>
                                    </div>
                                </fieldset>

                            </form:form>
                            <form class="form-horizontal" action="/tatami/account/suppress" method="post">
                                <fieldset>
                                    <legend><fmt:message key="tatami.user.suppress"/></legend>
                                    <div class="form-actions">
                                        <button type="submit" class="input-xlarge btn btn-danger" onclick="return(confirm('<fmt:message key="tatami.user.suppress.confirmation"/>'));">
                                            <fmt:message key="tatami.user.suppress"/>
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