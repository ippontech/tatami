<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="/tatami/"><img
                    src="/assets/img/ippon-logo.png">&nbsp;<spring:message
                    code="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="/tatami/"><i class="icon-home icon-white"></i>&nbsp;<spring:message
                            code="tatami.home"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
                </ul>
                <ul class="nav pull-right">
                    <li class="divider-vertical"></li>
                    <li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<spring:message
                            code="tatami.logout"/></a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>

<div class="container-fluid" id="userProfile">
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
                                 title="It s you"><spring:message code="tatami.user.yourself"/></a>
                            </div>
                        </c:when>
                        <c:when test="${not empty followed && followed}">
                            <a href="#" id="unfollowBtn"
                               onclick="unfollowUser(userLogin)"
                               class="btn btn-info"
                               title="${user.firstName}&nbsp;${user.lastName}"><spring:message
                                    code="tatami.user.followed"/></a>
                        </c:when>
                        <c:otherwise>
                            <a href="#" id="followBtn"
                               onclick="followUser(userLogin)"
                               class="btn btn-info"
                               title="${user.firstName}&nbsp;${user.lastName}"><spring:message
                                    code="tatami.user.follow"/></a>
                        </c:otherwise>
                    </c:choose>
                </div>

                <div class="span1" style="width: 70px">
                    <span class="badge"><fmt:formatNumber value="${nbTweets}"
                                                          pattern="# ### ###"/></span><br/><spring:message
                        code="tatami.user.nbTweets"/>
                </div>
                <div class="span1" style="width: 70px">
                    <span class="badge"><fmt:formatNumber value="${nbFollowed}"
                                                          pattern="# ### ###"/></span><br/><spring:message
                        code="tatami.user.nbFollowedUsers"/>
                </div>
                <div class="span1" style="width: 70px">
                    <span class="badge"><fmt:formatNumber value="${nbFollowers}"
                                                          pattern="# ### ###"/></span><br/><spring:message
                        code="tatami.user.nbFollowers"/>
                </div>
            </div>

            <div class="row-fluid">
                <div id="profilemenuleft" class="span4">
                    <div class="alert alert-info">
                        <h4><spring:message code="tatami.user.tweettohim"/>@${user.login}</h4><br/>
                        <div id="tweetToHim" class="row-fluid">
                            <form class="form-inline" onsubmit="return tweetToUser();">
                                <textarea id="tweetContent" rel="popover" class="focused"
                                          maxlength="140">@${user.login} </textarea>
                                <button type="submit" class="btn btn-primary"><spring:message
                                        code="tatami.user.tweet"/></button>
                            </form>
                            <div class="error"></div>
                        </div>
                    </div>
                </div>
                <div id="profilemain" class="span8">
                    <div class="alert alert-success">
                        <div id="timeLinePanel">

                        </div>
                    </div>
                </div>
            </div>

        </c:when>
        <c:otherwise>

            <div class="row-fluid">
                <spring:message code="tatami.user.undefined"/>
            </div>

        </c:otherwise>
    </c:choose>
</div>
</div>

<jsp:include page="includes/footer.jsp"/>
<script type="text/javascript">
    var login = "<sec:authentication property="principal.username"/>";
    var userLogin = "${user.login}";
    $(document).ready(function() {
        initProfile();
    });
</script>
</body>
</html>