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
                    <a href="/tatami/profile/${user.username}"><h3>${user.firstName}&nbsp;${user.lastName}</h3>
                        @${user.username}</a>
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
                               onclick="unfollowUserProfile(username)"
                               class="btn btn-info"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.followed"/></a>
                            <a href="#" id="followBtn"
                               onclick="followUserProfile(username)"
                               class="btn btn-info hide"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.follow"/></a>
                        </c:when>
                        <c:otherwise>
                            <a href="#" id="unfollowBtn"
                               onclick="unfollowUserProfile(username)"
                               class="btn btn-info hide"
                               title="${user.firstName}&nbsp;${user.lastName}"><fmt:message
                                    key="tatami.user.followed"/></a>
                            <a href="#" id="followBtn"
                               onclick="followUserProfile(username)"
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
                        <h4><fmt:message key="tatami.user.sendmessageto"/> @${user.username}</h4><br/>

                        <div id="statusToHim" class="row-fluid">
                            <form class="form-inline" onsubmit="return statusToUser();">
                                <textarea id="statusContent" rel="popover" class="focused"
                                          maxlength="140">@${user.username} </textarea>
                                <button type="submit" class="btn btn-primary"><fmt:message
                                        key="tatami.user.send"/></button>
                            </form>
                            <div class="error"></div>
                        </div>
                    </div>
                </div>
                <div id="mainContent" class="span8">
                    <div class="tab-content alert alert-success">
                        <div id="statusPanel"></div>
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
    var statusId = "${statusId}";
    var page = "status";

    //Mustache.js templates
    $('#mustache').load('/assets/templates_mustache/templates.html');

    $(document).ready(function() {
        initStatus();
    });
</script>
</body>
</html>