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
                        </ul>
                    </div>
                </div>
                <div class="span8">
                    <div class="row-fluid">
                        <div class="tab-content span12">
                            <c:if test="${editGroup == 'true'}">
                                <div class="alert alert-success">
                                    <fmt:message
                                            key="tatami.group.edit.success"/>
                                </div>
                            </c:if>
                            <c:if test="${memberAdd == 'true'}">
                                <div class="alert alert-success">
                                    <fmt:message
                                            key="tatami.group.edit.member.add.success"/>
                                </div>
                            </c:if>
                            <c:if test="${memberRemove == 'true'}">
                                <div class="alert alert-success">
                                    <fmt:message
                                            key="tatami.group.edit.member.remove.success"/>
                                </div>
                            </c:if>
                            <c:if test="${noUser == 'true'}">
                                <div class="alert alert-error">
                                    <fmt:message
                                            key="tatami.group.edit.member.add.no.user"/>
                                </div>
                            </c:if>
                            <c:if test="${wrongUser == 'true'}">
                                <div class="alert alert-error">
                                    <fmt:message
                                            key="tatami.group.edit.member.add.wrong.user"/>
                                </div>
                            </c:if>
                            <ul class="breadcrumb">
                                <li><a href="../groups"><fmt:message key="tatami.menu.groups"/></a> <span class="divider">/</span></li>
                                <li class="active">${group.name}</li>
                            </ul>
                            <div class="btn-group" data-toggle="buttons-checkbox">
                                <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#editGroupCollapsible">
                                    <fmt:message key="tatami.group.edit.details"/>
                                </button>
                                <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#addMemberCollapsible">
                                    <fmt:message key="tatami.group.edit.member.add"/>
                                </button>
                            </div>
                            <div id="editGroupCollapsible" class="collapse out">
                                <br/>
                                <form:form action="edit" class="form-horizontal" commandName="group" method="post" acceptCharset="utf-8">
                                    <fieldset>
                                        <legend><fmt:message key="tatami.group.edit.details"/></legend>
                                        <input type="hidden" name="groupId" value="${group.groupId}">
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

                                        <div class="form-actions">
                                            <button type="submit" class="btn btn-primary"><fmt:message
                                                    key="tatami.form.save"/></button>
                                        </div>
                                    </fieldset>
                                </form:form>
                            </div>
                            <div id="addMemberCollapsible" class="collapse out">
                                <br/>
                                <form:form action="edit/addMember" class="form-horizontal" commandName="userGroupMembership" method="post" acceptCharset="utf-8">
                                    <fieldset>
                                        <legend><fmt:message key="tatami.group.edit.member.add"/></legend>
                                        <input type="hidden" name="groupId" value="${group.groupId}">
                                        <div class="control-group">
                                            <label class="control-label" for="name"><fmt:message
                                                    key="tatami.username"/></label>

                                            <div class="controls">
                                                <input id="username" name="username" class="span12 input-xlarge" type="text" required="required" placeholder="<fmt:message key="tatami.find.username"/>..." name="username" data-provide="typeahead"  autocomplete="off"/>
                                            </div>
                                        </div>
                                        <div class="form-actions">
                                            <button type="submit" class="btn btn-primary"><fmt:message
                                                    key="tatami.form.save"/></button>
                                        </div>
                                    </fieldset>
                                </form:form>
                            </div>
                                <h3>
                                    <fmt:message key="tatami.group.edit.list"/>
                                </h3>
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
                                                key="tatami.group.role"/></th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <c:forEach items="${users}" var="u">
                                        <tr>
                                            <td>
                                                <a href="/tatami/profile/${u.username}/" title="<fmt:message key="tatami.user.profile.show"/> @${u.username} ${u.firstName} ${u.lastName}">
                                                    <img class="pull-left nomargin avatar avatar-small" src="https://www.gravatar.com/avatar/${u.gravatar}?s=64&d=mm" alt="${u.firstName} ${u.lastName}"/>
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
                                                <c:if test="${u.role eq 'ADMIN'}"><fmt:message key="tatami.group.role.admin"/></c:if>
                                                <c:if test="${u.role eq 'MEMBER'}"><fmt:message key="tatami.group.role.member"/></c:if>
                                            </td>
                                            <td>
                                                <c:if test="${u.role eq 'MEMBER'}">
                                                <form action="edit/removeMember" method="post">
                                                    <input type="hidden" name="username" value="${u.username}"/>
                                                    <input type="hidden" name="groupId" value="${group.groupId}"/>
                                                    <button type="submit" class="btn-small btn-info">
                                                        <fmt:message key="tatami.group.edit.member.delete"/>
                                                    </button>
                                                </form>
                                                </c:if>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                    </tbody>
                                </table>
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
    var page = "groups_edit";

    $("#username").typeahead({
        source:function (query, process) {
            return $.get('/tatami/rest/search/users', {q:query}, function (data) {
                var results = [];
                for (var i = 0; i < data.length; i++) {
                    results[i] = data[i].username;
                }
                return process(results);
            });
        }
    });
</script>
</body>
</html>