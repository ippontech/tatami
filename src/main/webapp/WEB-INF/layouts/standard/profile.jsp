<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

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
                    <a href="/tatami/profile/${user.login}"><h3>${user.firstName}&nbsp;${user.lastName}</h3>
                        @${user.login}</a>
                </div>
                <div class="span1" style="width: 80px">
                    <sec:authentication property='principal.username' var="login"/>
                    <c:choose>
                        <c:when test="${not empty user && user.login eq login}">
                            <div class="btn btn-info"
                                 title="It s you"><fmt:message key="tatami.user.yourself"/>
                            </div>
                        </c:when>
                        <c:when test="${not empty followed && followed}">
                            <a href="#" id="unfollowBtn"
                               onclick="unfollowUserProfile(userLogin)"
                               class="btn btn-info"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.followed"/></a>
                            <a href="#" id="followBtn"
                               onclick="followUserProfile(userLogin)"
                               class="btn btn-info hide"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.follow"/></a>
                        </c:when>
                        <c:otherwise>
                            <a href="#" id="unfollowBtn"
                               onclick="unfollowUserProfile(userLogin)"
                               class="btn btn-info hide"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.followed"/></a>
                            <a href="#" id="followBtn"
                               onclick="followUserProfile(userLogin)"
                               class="btn btn-info"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.follow"/></a>
                        </c:otherwise>
                    </c:choose>
                </div>

                <div class="span1" style="width: 70px">
                    <span class="badge"><fmt:formatNumber value="${nbStatus}"
                                                          pattern="# ### ###"/></span><br/><fmt:message
                        key="tatami.badge.status"/>
                </div>
                <div class="span1" style="width: 70px">
                    <span class="badge"><fmt:formatNumber value="${nbFollowed}"
                                                          pattern="# ### ###"/></span><br/><fmt:message
                        key="tatami.badge.followed"/>
                </div>
                <div class="span1" style="width: 70px">
                    <span class="badge"><fmt:formatNumber value="${nbFollowers}"
                                                          pattern="# ### ###"/></span><br/><fmt:message
                        key="tatami.badge.followers"/>
                </div>
            </div>

            <div class="row-fluid">
                <div id="menuContent" class="span4">
                    <div class="alert alert-info">
                        <ul class="nav nav-pills nav-stacked">
                            <li class="active">
                                <a id="statusTab" href="#statusPanel" data-toggle="tab"><fmt:message
                                        key="tatami.badge.status"/></a>
                            </li>
                            <li><a id="followingTab" href="#followingPanel" data-toggle="tab"><fmt:message
                                    key="tatami.badge.followed"/></a></li>
                            <li><a id="followersTab" href="#followersPanel" data-toggle="tab"><fmt:message
                                    key="tatami.badge.followers"/></a></li>
                        </ul>
                    </div>
                    <div class="alert alert-info">
                        <h4><fmt:message key="tatami.user.statustohim"/> @${user.login}</h4><br/>

                        <div id="statusToHim" class="row-fluid">
                            <form class="form-inline" onsubmit="return statusToUser();">
                                <textarea id="statusContent" rel="popover" class="focused"
                                          maxlength="140">@${user.login} </textarea>
                                <button type="submit" class="btn btn-primary"><fmt:message
                                        key="tatami.user.status"/></button>
                            </form>
                            <div class="error"></div>
                        </div>
                    </div>
                </div>
                <div id="mainContent" class="span8">
                    <div class="tab-content alert alert-success">
                        <div class="tab-pane active" id="statusPanel"></div>
                        <div class="tab-pane" id="followingPanel">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th><h2><fmt:message
                                            key="tatami.badge.followed"/></h2></th>
                                </tr>
                                </thead>
                                <tbody id="followingList" class="statusList"></tbody>
                            </table>
                        </div>
                        <div class="tab-pane" id="followersPanel">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th><h2><fmt:message key="tatami.badge.followers"/></h2>
                                    </th>
                                </tr>
                                </thead>
                                <tbody id="followersList" class="statusList"></tbody>
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
    var userLogin = "${user.login}";
    var page = "profile";

    //Mustache.js templates
    $('#mustache').load('/assets/templates_mustache/templates.html');

    $(document).ready(function() {
        initProfile();
    });
</script>
</body>
</html>