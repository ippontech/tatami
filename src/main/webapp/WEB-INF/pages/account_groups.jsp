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
                            <li class="active">
                                <a href="#">
                                    <i class="icon-th"></i> <fmt:message key="tatami.menu.groups"/>
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
                                <a href="/tatami/account/tags/directory">
                                    <i class="icon-tags"></i> <fmt:message key="tatami.menu.tags.directory"/>
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
                                            key="tatami.group.add.success"/>
                                </div>
                            </c:if>
                            <c:if test="${param.error == 'true'}">
                                <div class="alert alert-error">
                                    <fmt:message key="tatami.group.add.error"/>
                                </div>
                            </c:if>
                            <h2>
                                <fmt:message key="tatami.menu.groups"/>
                            </h2>
                            <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#addGroupCollapsible">
                                 <fmt:message key="tatami.group.add"/>
                            </button>
                            <div id="addGroupCollapsible" class="collapse out">
                            <br/>
                            <form:form class="form-horizontal" commandName="group" method="post" acceptCharset="utf-8">
                                <fieldset>
                                    <div class="control-group">
                                        <label class="control-label" for="name"><fmt:message
                                                key="tatami.group.add.title"/></label>

                                        <div class="controls">
                                            <form:input type="text"
                                                        id="name"
                                                        required="required"
                                                        size="30" maxlength="50" class="input-xlarge"
                                                        path="name"/>
                                        </div>
                                    </div>
                                    <div class="control-group">
                                        <label class="control-label" for="name"><fmt:message
                                                key="tatami.group.add.description"/></label>

                                        <div class="controls">
                                            <form:textarea
                                                        id="description"
                                                        class="input-xlarge"
                                                        path="description"/>
                                        </div>
                                    </div>
                                    <div class="control-group">
                                        <label class="control-label" for="name"><fmt:message
                                                key="tatami.group.add.public"/></label>

                                        <div class="controls">
                                            <form:checkbox
                                                        id="publicGroup"
                                                        class="input-xlarge"
                                                        path="publicGroup"/>

                                        </div>
                                    </div>
                                    <div class="alert">
                                        <i class="icon-warning-sign"></i> <fmt:message
                                            key="tatami.group.add.public.alert"/>
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn btn-primary"><fmt:message
                                                key="tatami.form.save"/></button>
                                    </div>
                                </fieldset>
                            </form:form>
                            </div>
                            <c:if test="${not empty groups}">
                                <legend>
                                    <fmt:message key="tatami.group.list"/>
                                </legend>
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th><fmt:message
                                                key="tatami.group.name"/></th>
                                        <th><fmt:message
                                                key="tatami.group.add.access"/></th>
                                        <th><fmt:message
                                                key="tatami.group.counter"/></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <c:forEach items="${groups}" var="group">
                                            <tr>
                                                <td>
                                                        ${group.name}
                                                </td>
                                                <td>
                                                    <c:if test="${group.publicGroup}">
                                                        <span class="label label-warning"><fmt:message
                                                                key="tatami.group.add.public"/></span>
                                                    </c:if>
                                                    <c:if test="${not group.publicGroup}">
                                                        <span class="label label-info"><fmt:message
                                                                key="tatami.group.add.private"/></span>
                                                    </c:if>
                                                </td>
                                                <td>
                                                        ${group.counter}
                                                </td>
                                                <td>
                                                    <c:forEach items="${groupsAdmin}" var="groupAdmin">
                                                        <c:if test="${groupAdmin == group}">
                                                            <c:set var="found" value="true" scope="request" />
                                                        </c:if>
                                                    </c:forEach>
                                                    <c:if test="${found}">
                                                        <button type="submit" class="btn-small btn-info" onclick="window.location = 'groups/edit?groupId=${group.groupId}'">
                                                            <fmt:message key="tatami.group.edit.link"/>
                                                        </button>
                                                    </c:if>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </tbody>
                                </table>
                            </c:if>
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
    var page = "groups";
</script>
</body>
</html>