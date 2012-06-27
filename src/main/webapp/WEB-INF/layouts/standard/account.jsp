<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

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
                    <li class="active">
                        <a id="profileTab" href="#"><i
                                class="icon-user"></i>&nbsp;<fmt:message
                                key="tatami.menu.profile"/></a>
                    </li>
                    <li><a id="passwordTab" href="/tatami/account/password"><i
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
                <div class="tab-pane active" id="profile">
                    <c:if test="${success == 'true'}">
                        <div class="alert alert-success">
                            <fmt:message
                                    key="tatami.user.update.success"/>
                        </div>
                    </c:if>
                    <c:if test="${error == 'true'}">
                        <div class="alert alert-error">
                            <fmt:message
                                    key="tatami.user.update.error"/>
                        </div>
                    </c:if>
                    <h2><fmt:message key="tatami.account.update.title"/></h2>

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
                                    <img src="http://www.gravatar.com/avatar/${user.gravatar}?s=64"/>
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
                                                required="required"
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
                                                required="required"
                                                size="15" maxlength="40" class="input-xlarge"
                                                path="lastName"/>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary"><fmt:message
                                        key="tatami.form.save"/></button>
                            </div>

                        </fieldset>

                    </form:form>
                    <form action="/tatami/account/suppress" method="post">
                        <legend><fmt:message key="tatami.user.suppress"/></legend>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-danger" onclick="return(confirm('<fmt:message key="tatami.user.suppress.confirmation"/>'));"><fmt:message
                                    key="tatami.user.suppress"/></button>
                        </div>
                    </form>
                    <br/><br/>
                </div>
                <div class="tab-pane" id="password">

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